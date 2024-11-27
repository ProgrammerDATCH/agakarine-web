"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useDebtStore } from "@/lib/stores/use-debts"
import { Debt } from "@/lib/types/debt"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { DebtForm } from "@/components/debts/debt-form"
import { DebtStats } from "@/components/debts/debt-stats"
import { DebtCard } from "@/components/debts/debt-card"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

type FilterType = "all" | "lent" | "borrowed" | "unpaid" | "paid"

export default function DebtsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const { debts, setDebts } = useDebtStore()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>("all")

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "debts"),
      where("userId", "==", user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const debts: Debt[] = []
      snapshot.forEach((doc) => {
        debts.push({ id: doc.id, ...doc.data() } as Debt)
      })
      setDebts(debts)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [user, setDebts])

  const filteredDebts = debts.filter((debt) => {
    switch (filter) {
      case "lent":
        return debt.isLent
      case "borrowed":
        return !debt.isLent
      case "unpaid":
        return !debt.isPaid
      case "paid":
        return debt.isPaid
      default:
        return true
    }
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Debts</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Debt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Debt</DialogTitle>
            </DialogHeader>
            <DebtForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <DebtStats debts={debts} />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Records</h3>
          <p className="text-sm text-muted-foreground">
            Manage your lending and borrowing records
          </p>
        </div>
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as FilterType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter debts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Records</SelectItem>
            <SelectItem value="lent">Money Lent</SelectItem>
            <SelectItem value="borrowed">Money Borrowed</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredDebts.map((debt) => (
          <DebtCard key={debt.id} debt={debt} />
        ))}
      </div>
    </div>
  )
}