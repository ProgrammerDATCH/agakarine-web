"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useEventStore } from "@/lib/stores/use-events"
import { Event } from "@/lib/types/event"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { EventForm } from "@/components/events/event-form"
import { EventCalendar } from "@/components/events/event-calendar"
import { EventList } from "@/components/events/event-list"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function EventsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const { events, setEvents } = useEventStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "events"),
      where("userId", "==", user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events: Event[] = []
      snapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() } as Event)
      })
      setEvents(events)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [user, setEvents])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Events</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <EventForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="space-y-4">
          <EventCalendar events={events} />
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
          <EventList events={events} />
        </TabsContent>
      </Tabs>
    </div>
  )
}