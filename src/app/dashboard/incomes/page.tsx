'use client';
import { useState, useEffect } from "react";
import { IncomeColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { IncomeType } from "@/lib/definitions";
import { CirclePlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateDialog } from "@/components/create-dialog";
import { useAuth } from "@/components/context/auth-context";
import { Card } from "@/components/ui/card";

export default function Page() {
  const { income, userInfos } = useAuth();
  const [incomes, setIncomes] = useState<IncomeType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  // const test = Incom
  useEffect(() => {
    if (income) {
      console.log(income)
      setIncomes(income)
    }
  }, [income]);

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
            data={["source", "amount"]}
            table="incomes"
            onClose={() => setDialogOpen(false)} // Close dialog after submission
          />
        </Dialog>
      </div>
      <div className="text-xl">Total Income : {incomes?.reduce((sum, income) => sum + Number(income.amount || 0), 0)} XAF</div>

      <DataTable columns={IncomeColumns()} data={incomes} />
    </div>
  );
}
