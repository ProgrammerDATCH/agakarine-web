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
import { Task, TaskStatus } from "@/lib/types/task"

interface TaskStore {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">) => Promise<void>
  updateTask: (id: string, task: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      addTask: async (taskData) => {
        const newTask = {
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "current-user-id", // We'll replace this with actual user ID
        }
        
        const docRef = await addDoc(collection(db, "tasks"), newTask)
        const task = { ...newTask, id: docRef.id }
        set({ tasks: [...get().tasks, task] })
      },
      updateTask: async (id, taskData) => {
        const taskRef = doc(db, "tasks", id)
        const updatedData = {
          ...taskData,
          updatedAt: new Date().toISOString(),
        }
        
        await updateDoc(taskRef, updatedData)
        set({
          tasks: get().tasks.map((task) =>
            task.id === id ? { ...task, ...updatedData } : task
          ),
        })
      },
      deleteTask: async (id) => {
        await deleteDoc(doc(db, "tasks", id))
        set({ tasks: get().tasks.filter((task) => task.id !== id) })
      },
      updateTaskStatus: async (id, status) => {
        const taskRef = doc(db, "tasks", id)
        const updatedData = {
          status,
          updatedAt: new Date().toISOString(),
        }
        
        await updateDoc(taskRef, updatedData)
        set({
          tasks: get().tasks.map((task) =>
            task.id === id ? { ...task, ...updatedData } : task
          ),
        })
      },
    }),
    {
      name: "task-store",
    }
  )
)