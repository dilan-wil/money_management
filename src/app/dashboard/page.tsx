'use client'
import { DoubleLineChart } from "@/components/double-line-chart"
import { PieDonutChart } from "@/components/pie-donut-chart"
import { useAuth } from "@/components/context/auth-context"
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import CategorySummaryCard from "@/components/category-summary-card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusIcon } from "lucide-react";

export default function Page() {
    const { categories } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time or wait for data fetch
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <div className="container mx-auto pb-8">
                {/* Today's Allowed Expense */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading
                        ? Array.from({ length: 4 }).map((_, idx) => (
                            <Skeleton
                                key={idx}
                                className="w-full h-32 sm:h-40 bg-gray-200 rounded-lg"
                            />
                        ))
                        : categories
                            ?.filter((category: any) => category.frequent === true) // Filter categories
                            .map((category: any) => (
                                <CategorySummaryCard key={category.id} category={category} minimalist={false}/>
                            ))
                    }

                    {!loading && (
                        <Link href="/dashboard/settings">
                            <Card className="cursor-pointer flex justify-center items-center h-32 sm:h-40 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <CardContent>
                                    <PlusIcon className="w-8 h-8 text-green-600" />
                                </CardContent>
                            </Card>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                {/* <DoubleLineChart /> */}
                <PieDonutChart />
            </div>

        </div>

    )
}