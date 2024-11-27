"use client"

import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Event } from "@/lib/types/event"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface EventCalendarProps {
  events: Event[]
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Create a map of dates to events
  const eventsByDate = events.reduce((acc, event) => {
    const date = format(new Date(event.startDate), "yyyy-MM-dd")
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      components={{
        DayContent: ({ day }) => {
          const dateKey = format(day, "yyyy-MM-dd")
          const dayEvents = eventsByDate[dateKey] || []

          return (
            <div className="relative w-full p-2">
              <div>{format(day, "d")}</div>
              {dayEvents.length > 0 && (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="w-80">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {format(day, "MMMM d, yyyy")}
                      </p>
                      <div className="space-y-1">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="text-sm"
                          >
                            <span className="font-medium">{event.title}</span>
                            {event.location && (
                              <span className="text-muted-foreground">
                                {" "}
                                • {event.location}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          )
        },
      }}
    />
  )
}