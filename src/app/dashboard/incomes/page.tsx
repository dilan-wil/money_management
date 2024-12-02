'use client';
import { useState, useEffect } from "react";
import { incomeColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { IncomeType } from "@/lib/definitions";
import { CirclePlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateDialog } from "@/components/create-dialog";
import { getASubCollection } from "../../../functions/get-a-sub-collection";
import { useAuth } from "@/components/context/auth-context";

export default function Page() {
  const { user } = useAuth();
  const [data, setData] = useState<IncomeType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    // Set up real-time listener
    const unsubscribe = getASubCollection("users", user.uid, "incomes", setData);

    // Cleanup listener on component unmount
    return () => unsubscribe && unsubscribe();
  }, [user]);

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between w-full pb-7">
        <p className="text-2xl font-bold">Incomes</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button className="bg-green-700">
              <CirclePlus className="sm" />
              Add New Income
            </Button>
          </DialogTrigger>
          <CreateDialog
            data={["name", "amount"]}
            table="incomes"
            onClose={() => setDialogOpen(false)} // Close dialog after submission
          />
        </Dialog>
      </div>
      <div className="text-xl">Total Income : {data.reduce((sum, income) => sum + (income.amount || 0), 0)} XAF</div>
      <DataTable columns={incomeColumns} data={data} />
    </div>
  );
}
