import { create } from "zustand"
import { persist } from "zustand/middleware"
import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc 
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Event } from "@/lib/types/event"

interface EventStore {
  events: Event[]
  setEvents: (events: Event[]) => void
  addEvent: (event: Omit<Event, "id" | "createdAt" | "updatedAt" | "userId">) => Promise<void>
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
}

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      events: [],
      setEvents: (events) => set({ events }),
      addEvent: async (eventData) => {
        const newEvent = {
          ...eventData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "current-user-id", // Will be replaced with actual user ID
        }
        
        const docRef = await addDoc(collection(db, "events"), newEvent)
        const event = { ...newEvent, id: docRef.id }
        set({ events: [...get().events, event] })

        // If reminder is enabled, schedule it
        if (eventData.reminderEnabled && eventData.reminderTime) {
          await fetch("/api/schedule-reminder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId: docRef.id,
              reminderTime: eventData.reminderTime,
              title: eventData.title,
              startDate: eventData.startDate,
            }),
          })
        }
      },
      updateEvent: async (id, eventData) => {
        const eventRef = doc(db, "events", id)
        const updatedData = {
          ...eventData,
          updatedAt: new Date().toISOString(),
        }
        
        await updateDoc(eventRef, updatedData)
        set({
          events: get().events.map((event) =>
            event.id === id ? { ...event, ...updatedData } : event
          ),
        })
      },
      deleteEvent: async (id) => {
        await deleteDoc(doc(db, "events", id))
        set({ events: get().events.filter((event) => event.id !== id) })
      },
    }),
    {
      name: "event-store",
    }
  )
)