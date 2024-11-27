
import { useState, useEffect } from "react"
import { useToast } from "./use-toast"

interface QueueItem {
  id: string
  type: 'create' | 'update' | 'delete'
  collection: string
  data: any
}

export function useSyncQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const { toast } = useToast()

  const addToQueue = (item: QueueItem) => {
    setQueue((prev) => [...prev, item])
  }

  useEffect(() => {
    if (!navigator.onLine || queue.length === 0) return

    const sync = async () => {
      const failedItems: QueueItem[] = []

      for (const item of queue) {
        try {
          // Attempt to sync each item
          await fetch(`/api/${item.collection}`, {
            method: item.type === 'create' ? 'POST' : 
                   item.type === 'update' ? 'PUT' : 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data),
          })
        } catch (error) {
          failedItems.push(item)
        }
      }

      if (failedItems.length === 0) {
        toast({
          title: "Sync Complete",
          description: `${queue.length} items synchronized successfully.`,
        })
        setQueue([])
      } else {
        setQueue(failedItems)
        toast({
          title: "Sync Partially Complete",
          description: `${queue.length - failedItems.length} items synchronized. ${failedItems.length} items remaining.`,
          variant: "destructive",
        })
      }
    }

    sync()
  }, [queue, toast])

  return { addToQueue, queueLength: queue.length }
}