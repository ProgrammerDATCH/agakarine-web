"use client"

import { Debt } from "@/lib/types/debt"
import { useDebtStore } from "@/lib/stores/use-debts"
import { format } from "date-fns"
import { Calendar, Check, Clock, Trash2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

interface DebtCardProps {
  debt: Debt
}

export function DebtCard({ debt }: DebtCardProps) {
  const { deleteDebt, markAsPaid } = useDebtStore()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {debt.personName}
              {debt.isPaid && (
                <Badge variant="outline" className="text-green-600">
                  <Check className="mr-1 h-3 w-3" />
                  Paid
                </Badge>
              )}
            </CardTitle>
            {debt.description && (
              <CardDescription>{debt.description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!debt.isPaid && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => markAsPaid(debt.id)}
              >
                Mark as Paid
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Debt</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this debt record? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteDebt(debt.id)}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {debt.isLent ? "+" : "-"}${debt.amount.toFixed(2)}
        </div>
      </CardContent>
      <CardFooter className="flex gap-4 text-sm text-muted-foreground">
        {debt.dueDate && (
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            Due {format(new Date(debt.dueDate), "PP")}
          </div>
        )}
        {debt.reminderEnabled && debt.reminderDate && (
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            Reminder on {format(new Date(debt.reminderDate), "PP")}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}