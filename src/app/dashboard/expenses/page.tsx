import { expensesColumns } from "@/components/columns"
import { DataTable } from "@/components/data-table"
import { ExpenseType, IncomeType } from "@/lib/definitions"

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

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={expensesColumns} data={data} />
    </div>
  )
}
3