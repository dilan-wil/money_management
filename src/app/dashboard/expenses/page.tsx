'use client'
import { useState, useEffect } from "react";
import { ExpensesColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ExpenseType } from "@/lib/definitions";
import { CirclePlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateDialog } from "@/components/create-dialog";
import { useAuth } from "@/components/context/auth-context";

export default function Page() {
  const { user, expenses } = useAuth();
  const [expenseArray, setExpenseArray] = useState<ExpenseType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (expenses) {
      setExpenseArray(expenses);
    }
  }, [expenses]);

  const totalExpense = expenseArray?.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between w-full pb-7">
        <p className="text-2xl font-bold">Expenses</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button className="bg-green-700">
              <CirclePlus className="sm" />
              Add New Expense
            </Button>
          </DialogTrigger>
          <CreateDialog
            data={["category", "description", "amount"]}
            table="expenses"
            onClose={() => setDialogOpen(false)} // Close dialog after submission
          />
        </Dialog>
      </div>
      {expenses === null ? (
        <div>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className="mt-6 animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-6 bg-gray-300 rounded w-full"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="text-xl">Total Expense per month : {totalExpense} XAF</div>
          <DataTable columns={ExpensesColumns()} data={expenseArray} type="expense" />
        </>
      )}
    </div>
  );
}
