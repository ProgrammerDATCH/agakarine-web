"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTaskStore } from "@/lib/stores/use-tasks"
import { Task } from "@/lib/types/task"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { TaskForm } from "@/components/tasks/task-form"
import { TaskList } from "@/components/tasks/task-list"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function TasksPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const { tasks, setTasks } = useTaskStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks: Task[] = []
      snapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() } as Task)
      })
      setTasks(tasks)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [user, setTasks])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TaskList
          title="To Do"
          tasks={tasks.filter((task) => task.status === "todo")}
        />
        <TaskList
          title="In Progress"
          tasks={tasks.filter((task) => task.status === "in-progress")}
        />
        <TaskList
          title="Done"
          tasks={tasks.filter((task) => task.status === "done")}
        />
      </div>
    </div>
  )
}