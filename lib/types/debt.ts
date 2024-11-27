export interface Debt {
    id: string
    personName: string
    amount: number
    description?: string
    dueDate?: string
    isPaid: boolean
    isLent: boolean // true if you lent money, false if you borrowed
    userId: string
    createdAt: string
    updatedAt: string
    reminderEnabled: boolean
    reminderDate?: string
  }