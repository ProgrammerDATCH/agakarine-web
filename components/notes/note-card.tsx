"use client"

import { Note } from "@/lib/types/note"
import { useNoteStore } from "@/lib/stores/use-notes"
import { formatDistanceToNow } from "date-fns"
import { Copy, Folder, Tag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const { deleteNote } = useNoteStore()
  const { toast } = useToast()

  const copyToClipboard = () => {
    const stepsText = note.steps
      .sort((a, b) => a.order - b.order)
      .map((step, index) => `${index + 1}. ${step.content}`)
      .join('\n')

    const fullText = `${note.title}\n\n${note.description ? note.description + '\n\n' : ''}${stepsText}`
    
    navigator.clipboard.writeText(fullText).then(() => {
      toast({
        description: "Copied to clipboard",
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {note.title}
            </CardTitle>
            {note.description && (
              <CardDescription>{note.description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Note</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this note? This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteNote(note.id)}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {note.category && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Folder className="h-3 w-3" />
              {note.category}
            </Badge>
          )}
          {note.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {note.steps
              .sort((a, b) => a.order - b.order)
              .map((step, index) => (
                <div
                  key={step.id}
                  className="flex gap-2 rounded-md bg-muted p-3"
                >
                  <span className="text-muted-foreground">
                    {index + 1}.
                  </span>
                  <span>{step.content}</span>
                </div>
              ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Last updated {formatDistanceToNow(new Date(note.updatedAt))} ago
          </p>
        </div>
      </CardContent>
    </Card>
  )
}