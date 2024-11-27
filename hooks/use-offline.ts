import { useState, useEffect } from "react"
import { useToast } from "./use-toast"

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Handle online status changes
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "Back Online",
        description: "Your changes will now sync automatically.",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You're Offline",
        description: "Changes will be saved locally and sync when you're back online.",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  return isOnline
}