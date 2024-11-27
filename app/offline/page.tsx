import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <WifiOff className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">You're Offline</h1>
        <p className="mt-2 text-muted-foreground">
          But don't worry! You can still access your cached data and create new items.
          They will sync automatically when you're back online.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}