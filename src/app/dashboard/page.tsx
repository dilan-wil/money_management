'use client'
import { DoubleLineChart } from "@/components/double-line-chart"
import { PieDonutChart } from "@/components/pie-donut-chart"
import { useAuth } from "@/components/context/auth-context"
import { useState, useEffect } from "react";
import { getASubCollection } from "@/functions/get-a-sub-collection";
import { getCategories, Category } from '@/functions/testBudget'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from "@/hooks/use-toast";
import CategorySummaryCard from "@/components/category-summary-card";

export default function Page() {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories()
            const categoriesWithAmounts = fetchedCategories.map(cat => ({
                ...cat,
                currentAmount: Math.random() * 1000,
                totalAmount: 1000
            }))
            setCategories(categoriesWithAmounts)
        }
        fetchCategories()
    }, [])

    return (
        <div>
            <div className="container mx-auto pb-8">
                {/* Today's Allowed Expense */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <CategorySummaryCard category={category}/>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <DoubleLineChart />
                <PieDonutChart />
            </div>

        </div>

    )
}