// components/notes/note-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useNoteStore } from "@/lib/stores/use-notes"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()),
  steps: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      order: z.number(),
    })
  ),
})

type FormValues = z.infer<typeof formSchema>

export function NoteForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const addNote = useNoteStore((state) => state.addNote)
  const [stepInput, setStepInput] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: [],
      steps: [],
    },
  })

  const onAddStep = () => {
    if (!stepInput.trim()) return

    const steps = form.getValues("steps")
    form.setValue("steps", [
      ...steps,
      {
        id: Math.random().toString(36).substr(2, 9),
        content: stepInput.trim(),
        order: steps.length,
      },
    ])
    setStepInput("")
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const steps = form.getValues("steps")
    const [reorderedStep] = steps.splice(result.source.index, 1)
    steps.splice(result.destination.index, 0, reorderedStep)

    // Update order numbers
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      order: index,
    }))

    form.setValue("steps", updatedSteps)
  }

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      await addNote(values)
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error("Failed to create note:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Note title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Setup Guides" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Steps</FormLabel>
          <div className="flex space-x-2">
            <Input
              placeholder="Add a step"
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  onAddStep()
                }
              }}
            />
            <Button type="button" onClick={onAddStep}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {form.watch("steps").map((step, index) => (
                    <Draggable
                      key={step.id}
                      draggableId={step.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center space-x-2 rounded-md border bg-card p-3"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="flex-grow">{step.content}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const steps = form.getValues("steps")
                              form.setValue(
                                "steps",
                                steps.filter((s) => s.id !== step.id)
                              )
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Note"}
        </Button>
      </form>
    </Form>
  )
}