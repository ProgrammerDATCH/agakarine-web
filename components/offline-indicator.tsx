"use client"

import { useOffline } from "@/hooks/use-offline"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const isOnline = useOffline()

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm text-destructive-foreground">
      <WifiOff className="h-4 w-4" />
      Offline Mode
    </div>
  )
}