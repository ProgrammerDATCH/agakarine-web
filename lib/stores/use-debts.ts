import { create } from "zustand"
import { persist } from "zustand/middleware"
import { 
  collection, 
  query, 
  where, 
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc 
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Debt } from "@/lib/types/debt"

interface DebtStore {
  debts: Debt[]
  setDebts: (debts: Debt[]) => void
  addDebt: (debt: Omit<Debt, "id" | "createdAt" | "updatedAt" | "userId">) => Promise<void>
  updateDebt: (id: string, debt: Partial<Debt>) => Promise<void>
  deleteDebt: (id: string) => Promise<void>
  markAsPaid: (id: string) => Promise<void>
}

export const useDebtStore = create<DebtStore>()(
  persist(
    (set, get) => ({
      debts: [],
      setDebts: (debts) => set({ debts }),
      addDebt: async (debtData) => {
        const newDebt = {
          ...debtData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "current-user-id", // Will be replaced with actual user ID
        }
        
        const docRef = await addDoc(collection(db, "debts"), newDebt)
        const debt = { ...newDebt, id: docRef.id }
        set({ debts: [...get().debts, debt] })

        // Schedule reminder if enabled
        if (debtData.reminderEnabled && debtData.reminderDate) {
          await fetch("/api/schedule-reminder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              debtId: docRef.id,
              reminderDate: debtData.reminderDate,
              personName: debtData.personName,
              amount: debtData.amount,
              isLent: debtData.isLent,
            }),
          })
        }
      },
      updateDebt: async (id, debtData) => {
        const debtRef = doc(db, "debts", id)
        const updatedData = {
          ...debtData,
          updatedAt: new Date().toISOString(),
        }
        
        await updateDoc(debtRef, updatedData)
        set({
          debts: get().debts.map((debt) =>
            debt.id === id ? { ...debt, ...updatedData } : debt
          ),
        })
      },
      deleteDebt: async (id) => {
        await deleteDoc(doc(db, "debts", id))
        set({ debts: get().debts.filter((debt) => debt.id !== id) })
      },
      markAsPaid: async (id) => {
        const debtRef = doc(db, "debts", id)
        const updatedData = {
          isPaid: true,
          updatedAt: new Date().toISOString(),
        }
        
        await updateDoc(debtRef, updatedData)
        set({
          debts: get().debts.map((debt) =>
            debt.id === id ? { ...debt, ...updatedData } : debt
          ),
        })
      },
    }),
    {
      name: "debt-store",
    }
  )
)