"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useNoteStore } from "@/lib/stores/use-notes"
import { Note } from "@/lib/types/note"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { NoteForm } from "@/components/notes/note-form"
import { NoteCard } from "@/components/notes/note-card"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function NotesPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const { notes, setNotes } = useNoteStore()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notes: Note[] = []
      snapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() } as Note)
      })
      setNotes(notes)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [user, setNotes])

  // Get unique categories
  const categories = Array.from(
    new Set(notes.map((note) => note.category).filter(Boolean))
  )

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.description?.toLowerCase().includes(search.toLowerCase()) ||
      note.steps.some((step) => 
        step.content.toLowerCase().includes(search.toLowerCase())
      )

    const matchesCategory = selectedCategory === "all" || 
      note.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Notes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <NoteForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
        {filteredNotes.length === 0 && (
          <div className="text-center text-muted-foreground">
            No notes found. Try adjusting your search or category filter.
          </div>
        )}
      </div>
    </div>
  )
}