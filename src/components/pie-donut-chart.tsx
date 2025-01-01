"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'
import { ChartContainer } from "@/components/ui/chart"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "./context/auth-context"
const chartData = [
  { name: "chrome", amount: 35000, fill: "var(--color-chrome)" },
  { name: "transport", amount: 25000, fill: "var(--color-safari)" },
  { name: "restaurant", amount: 20000, fill: "var(--color-firefox)" },
  { name: "other", amount: 20000, fill: "var(--color-other)" },
]

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']

export function PieDonutChart() {
    const {categories} = useAuth()
  

  const pieChartData = categories
  .filter((cat: any) => cat.parent === 'none')
  .map((category: any, index: number) => ({
      name: category.name,
      value: category.totalAmount,
      color: COLORS[index % COLORS.length]
  }))
  return (
      <Card className="max-w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] overflow-hidden">
          <ChartContainer
            config={{
              ...Object.fromEntries(
                pieChartData.map((item: any) => [
                  item.name,
                  { label: item.name, color: item.color },
                ])
              ),
            }}
            className="h-full w-full overflow-hidden"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
  
  )
}
