import { incomeColumns } from "@/components/columns"
import { DataTable } from "@/components/data-table"
import { IncomeType } from "@/lib/definitions"

async function getData(): Promise<IncomeType[]> {
  // Fetch data from your API here.
  return [
      {
        id: "728ed52f",
        name: "first",
        amount: 2000,
      },
      {
        id: "58498498",
        name: "second",
        amount: 400,
      },
      {
        id: "65465465",
        name: "m.com",
        amount: 100,
      },
      {
        id: "546546545",
        name: "m@example.com",
        amount: 100,
      },
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={incomeColumns} data={data} />
    </div>
  )
}
