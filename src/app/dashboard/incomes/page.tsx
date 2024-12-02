'use client'
import { useState, useEffect } from "react";
import { incomeColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { IncomeType } from "@/lib/definitions";
import { CirclePlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateDialog } from "@/components/create-dialog";

async function getData(): Promise<IncomeType[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "first",
      updatedAt: "yeahh",
      amount: 2000,
    },
    {
      id: "58498498",
      name: "second",
      updatedAt: "yeahh",
      amount: 400,
    },
    {
      id: "65465465",
      name: "m.com",
      updatedAt: "yeahh",
      amount: 100,
    },
    {
      id: "546546545",
      name: "m@example.com",
      updatedAt: "yeahh",
      amount: 100,
    },
  ];
}

export default function Page() {
  const [data, setData] = useState<IncomeType[]>([]);
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
      <div className="text-xl">Total Income : 200000 XAF</div>
      <DataTable columns={incomeColumns} data={data} />
    </div>
  );
}
