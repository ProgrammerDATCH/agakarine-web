"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollText, Calendar, DollarSign, BookOpen, Settings } from "lucide-react"

const routes = [
  {
    label: "Tasks",
    icon: ScrollText,
    href: "/dashboard/tasks",
    color: "text-sky-500",
  },
  {
    label: "Events",
    icon: Calendar,
    href: "/dashboard/events",
    color: "text-violet-500",
  },
  {
    label: "Debts",
    icon: DollarSign,
    href: "/dashboard/debts",
    color: "text-pink-700",
  },
  {
    label: "Notes",
    icon: BookOpen,
    href: "/dashboard/notes",
    color: "text-orange-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === route.href ? "bg-accent" : "transparent",
          )}
        >
          <route.icon className={cn("mr-2 h-4 w-4", route.color)} />
          <span>{route.label}</span>
        </Link>
      ))}
    </nav>
  )
}