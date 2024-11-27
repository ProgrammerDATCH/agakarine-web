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
import { Note, Step } from "@/lib/types/note"

interface NoteStore {
  notes: Note[]
  setNotes: (notes: Note[]) => void
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "userId">) => Promise<void>
  updateNote: (id: string, note: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  updateSteps: (noteId: string, steps: Step[]) => Promise<void>
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      setNotes: (notes) => set({ notes }),
      addNote: async (noteData) => {
        const newNote = {
          ...noteData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "current-user-id", // Will be replaced with actual user ID
        }
        
        const docRef = await addDoc(collection(db, "notes"), newNote)
        const note = { ...newNote, id: docRef.id }
        set({ notes: [...get().notes, note] })
      },
      updateNote: async (id, noteData) => {
        const noteRef = doc(db, "notes", id)
        const updatedData = {
          ...noteData,
          updatedAt: new Date().toISOString(),
        }
        
        await updateDoc(noteRef, updatedData)
        set({
          notes: get().notes.map((note) =>
            note.id === id ? { ...note, ...updatedData } : note
          ),
        })
      },
      deleteNote: async (id) => {
        await deleteDoc(doc(db, "notes", id))
        set({ notes: get().notes.filter((note) => note.id !== id) })
      },
      updateSteps: async (noteId, steps) => {
        const noteRef = doc(db, "notes", noteId)
        const updatedData = {
          steps,
          updatedAt: new Date().toISOString(),
        }
        
        await updateDoc(noteRef, updatedData)
        set({
          notes: get().notes.map((note) =>
            note.id === noteId ? { ...note, ...updatedData } : note
          ),
        })
      },
    }),
    {
      name: "note-store",
    }
  )
)