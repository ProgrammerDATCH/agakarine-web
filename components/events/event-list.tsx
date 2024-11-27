"use client"

import { Event } from "@/lib/types/event"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useEventStore } from "@/lib/stores/use-events"

interface EventListProps {
  events: Event[]
}

export function EventList({ events }: EventListProps) {
  const deleteEvent = useEventStore((state) => state.deleteEvent)

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{event.title}</CardTitle>
                {event.description && (
                  <CardDescription>{event.description}</CardDescription>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Event</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this event? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteEvent(event.id)}
                      className="bg-destructive text-destructive-foreground"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(event.startDate), "PPP")}
                {event.endDate && ` - ${format(new Date(event.endDate), "PPP")}`}
              </div>
              {event.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  {event.location}
                </div>
              )}
              {event.reminderEnabled && event.reminderTime && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  Reminder set for {format(new Date(event.reminderTime), "PPP p")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}