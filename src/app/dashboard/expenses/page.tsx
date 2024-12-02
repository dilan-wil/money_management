'use client'
import { useState, useEffect } from "react";
import { expensesColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ExpenseType } from "@/lib/definitions";
import { CirclePlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateDialog } from "@/components/create-dialog";

async function getData(): Promise<ExpenseType[]> {
  // Fetch data from your API here.
  return [
      {
        id: "728ed52f",
        name: "first",
        percentage: 5,
        updatedAt: "YEAHH",
        amount: 2000,
      },
      {
        id: "58498498",
        name: "second",
        updatedAt: "YEAHH",
        percentage: 10,
        amount: 400,
      },
      {
        id: "65465465",
        name: "m.com",
        updatedAt: "YEAHH",
        percentage: 30,
        amount: 100,
      },
      {
        id: "546546545",
        name: "m@example.com",
        updatedAt: "YEAHH",
        percentage: 20,
        amount: 100,
      },
  ]
}

export default function Page() {
  const [data, setData] = useState<ExpenseType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {

    const fetchData = async() => {
        const datas = await getData();
        setData(datas)
    }

    fetchData();
  }, [])

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