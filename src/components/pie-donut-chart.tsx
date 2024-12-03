"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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
  { name: "chrome", amount: 35000, fill: "var(--color-chrome)" },
  { name: "transport", amount: 25000, fill: "var(--color-safari)" },
  { name: "restaurant", amount: 20000, fill: "var(--color-firefox)" },
  { name: "other", amount: 20000, fill: "var(--color-other)" },
]

const chartConfig = {
  amount: {
    label: "amount",
  },
  food: {
    label: "Food",
    color: "hsl(var(--chart-1))",
  },
  transport: {
    label: "transport",
    color: "hsl(var(--chart-2))",
  },
  restaurant: {
    label: "restaurant",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "other",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function PieDonutChart() {
  const totalamount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0)
  }, [])

  return (
    <Card className="flex flex-col w-full sm:w-1/2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense Categories Ratio</CardTitle>
        <CardDescription>Representation of each of your expenses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalamount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          XAF
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
