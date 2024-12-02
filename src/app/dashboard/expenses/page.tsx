'use client'
import { useState, useEffect } from "react";
import { expensesColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ExpenseType } from "@/lib/definitions";
import { CirclePlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateDialog } from "@/components/create-dialog";
import { useAuth } from "@/components/context/auth-context";
import { getASubCollection } from "@/functions/get-a-sub-collection";

export default function Page() {
  const { user } = useAuth()
  const [data, setData] = useState<ExpenseType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    // Set up real-time listener
    const unsubscribe = getASubCollection("users", user.uid, "expenses", setData);

    // Cleanup listener on component unmount
    return () => unsubscribe && unsubscribe();
  }, [user]);

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
            data={["name", "percentage"]}
            table="expenses"
            onClose={() => setDialogOpen(false)} // Close dialog after submission
          />
        </Dialog>
      </div>
      <div className="text-xl">Total Expense per month : 200000 XAF</div>
      <DataTable columns={expensesColumns} data={data} />
    </div>
  );
}