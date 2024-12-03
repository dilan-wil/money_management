"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", expenses: 120000, savings: 30000 },
  { month: "February", expenses: 100000, savings: 50000 },
  { month: "March", expenses: 110000, savings: 40000 },
  { month: "April", expenses: 80000, savings: 70000 },
  { month: "May", expenses: 100000, savings: 50000 },
  { month: "June", expenses: 90000, savings: 60000 },
]

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-1))",
  },
  savings: {
    label: "Savings",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function DoubleLineChart() {
  return (
    <Card className="w-full sm:w-1/2">
      <CardHeader>
        <CardTitle><span className="text-orange-600">Expense</span> - <span className="text-teal-700">Savings</span></CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="expenses"
              type="monotone"
              stroke="var(--color-expenses)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="savings"
              type="monotone"
              stroke="var(--color-savings)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Saved up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              How much you spent vs what you saved from january to juin
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
