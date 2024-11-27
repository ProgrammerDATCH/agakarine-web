"use client"

import { Debt } from "@/lib/types/debt"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface DebtStatsProps {
  debts: Debt[]
}

export function DebtStats({ debts }: DebtStatsProps) {
  const totalLent = debts
    .filter((debt) => debt.isLent && !debt.isPaid)
    .reduce((sum, debt) => sum + debt.amount, 0)

  const totalBorrowed = debts
    .filter((debt) => !debt.isLent && !debt.isPaid)
    .reduce((sum, debt) => sum + debt.amount, 0)

  const netBalance = totalLent - totalBorrowed

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Money Lent</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalLent.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Money Borrowed</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalBorrowed.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={cn(
            "text-2xl font-bold",
            netBalance > 0 ? "text-green-600" : "text-red-600"
          )}>
            ${netBalance.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}