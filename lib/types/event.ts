export interface Event {
    id: string
    title: string
    description?: string
    startDate: string
    endDate?: string
    location?: string
    reminderEnabled: boolean
    reminderTime?: string // ISO string for when to send reminder
    userId: string
    createdAt: string
    updatedAt: string
  }