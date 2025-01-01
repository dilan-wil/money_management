'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/components/context/auth-context'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'
import { ArrowUpIcon, ArrowDownIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChartContainer } from "@/components/ui/chart"
import { Skeleton } from '@/components/ui/skeleton'

const monthlyData = [
    { name: 'Jan', income: 4200, expenses: 3800 },
    { name: 'Feb', income: 4300, expenses: 3900 },
    { name: 'Mar', income: 4400, expenses: 3700 },
    { name: 'Apr', income: 4100, expenses: 3600 },
    { name: 'May', income: 4500, expenses: 4000 },
    { name: 'Jun', income: 4600, expenses: 4100 },
]

// Mock data for savings trend
const savingsTrendData = [
    { name: 'Jan', savings: 400 },
    { name: 'Feb', savings: 450 },
    { name: 'Mar', savings: 700 },
    { name: 'Apr', savings: 500 },
    { name: 'May', savings: 500 },
    { name: 'Jun', savings: 550 },
]
const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']

export default function FinancialSummaryPage() {
    const { categories, income, expenses, userInfos } = useAuth()
    const [totalSpent, setTotalSpent] = useState(0)
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalExpenses, setTotalExpenses] = useState(0)
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

    useEffect(() => {
        const totalIncome = income?.reduce((sum: number, income: any) => sum + Number(income.amount || 0), 0);
        setTotalIncome(totalIncome)
        const totalExpenses = expenses?.reduce((sum: number, expense: any) => sum + Number(expense.amount || 0), 0);
        setTotalExpenses(totalExpenses)
    }, [categories, income, expenses])

    if (!categories) {
        return (
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Financial Summary</h1>
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <Skeleton className="h-40" />
                    <Skeleton className="h-40" />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-80" />
                    <Skeleton className="h-80" />
                </div>
            </div>
        );
    }

    const remainingBudget = totalIncome - totalExpenses
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100

    const pieChartData = categories
        .filter((cat: any) => cat.parent === 'none')
        .map((category: any, index: number) => ({
            name: category.name,
            value: category.totalAmount,
            color: COLORS[index % COLORS.length]
        }))

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev)
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId)
            } else {
                newSet.add(categoryId)
            }
            return newSet
        })
    }

    const renderCategoryBreakdown = (parentId: string = 'none', level: number = 0) => {
        return categories
            .filter((category: any) => category.parent === parentId)
            .map((category: any) => (
                <div key={category.id} style={{ marginLeft: `${level * 20}px` }}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                            {categories.some((cat: any) => cat.parent === category.id) && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleCategory(category.id)}
                                >
                                    {expandedCategories.has(category.id) ? (
                                        <ChevronDownIcon className="w-4 h-4" />
                                    ) : (
                                        <ChevronRightIcon className="w-4 h-4" />
                                    )}
                                </Button>
                            )}
                            <p className="font-medium">{category.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">{userInfos.currency === "CAD" || userInfos.currency === "USD" ? "$" : userInfos.currency === "EUR" ? "€" : "XAF"}{category.totalAmount}</p>
                            <p className="text-sm text-gray-500">
                                {category.percentage}% of total
                            </p>
                        </div>
                    </div>
                    <Progress value={category.percentage} className="h-2 mb-2" />
                    {expandedCategories.has(category.id) && renderCategoryBreakdown(category.id, level + 1)}
                </div>
            ))
    }

    return (
        <div className="container mx-auto max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">Financial Summary</h1>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{userInfos.currency === "CAD" || userInfos.currency === "USD" ? "$" : userInfos.currency === "EUR" ? "€" : "XAF"}{totalIncome}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{userInfos.currency === "CAD" || userInfos.currency === "USD" ? "$" : userInfos.currency === "EUR" ? "€" : "XAF"}{totalExpenses}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            {((totalExpenses / totalIncome) * 100)}% of total income
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Remaining Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{userInfos.currency === "CAD" || userInfos.currency === "USD" ? "$" : userInfos.currency === "EUR" ? "€" : "XAF"}{remainingBudget}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            {((remainingBudget / totalIncome) * 100)}% of total income
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Savings Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{savingsRate}%</p>
                        <Progress value={savingsRate} className="h-2 mt-4" />
                        {savingsRate >= 20 ? (
                            <p className="text-sm text-green-500 mt-2 flex items-center">
                                <ArrowUpIcon className="w-4 h-4 mr-1" />
                                Good savings rate! Keep it up!
                            </p>
                        ) : (
                            <p className="text-sm text-red-500 mt-2 flex items-center">
                                <ArrowDownIcon className="w-4 h-4 mr-1" />
                                Try to increase your savings rate to at least 20%
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Budget Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(totalExpenses / totalIncome) * 100} className="h-2 mb-4" />
                        <p className="text-lg font-semibold">
                            {((totalExpenses / totalIncome) * 100)}% of budget used
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {userInfos.currency === "CAD" || userInfos.currency === "USD" ? "$" : userInfos.currency === "EUR" ? "€" : "XAF"}{remainingBudget} remaining
                        </p>
                    </CardContent>
                </Card>
            </div>


            <div className="grid gap-6 md:grid-cols-2">

                <Card>
                    <CardHeader>
                        <CardTitle>Category Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {renderCategoryBreakdown()}
                        </div>
                    </CardContent>
                </Card>

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


                {/* Monthly Income vs Expenses */}
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Monthly Income vs Expenses</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ChartContainer
                            config={{
                                income: {
                                    label: "Income",
                                    color: "hsl(var(--chart-1))",
                                },
                                expenses: {
                                    label: "Expenses",
                                    color: "hsl(var(--chart-2))",
                                },
                            }}
                            className="h-full w-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="income" fill="var(--color-income)" />
                                    <Bar dataKey="expenses" fill="var(--color-expenses)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Savings Trend */}
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Savings Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ChartContainer
                            config={{
                                savings: {
                                    label: "Savings",
                                    color: "hsl(var(--chart-3))",
                                },
                            }}
                            className="h-full w-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={savingsTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="savings" stroke="var(--color-savings)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}