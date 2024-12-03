'use client'
import { DoubleLineChart } from "@/components/double-line-chart"
import { PieDonutChart } from "@/components/pie-donut-chart"
import { useAuth } from "@/components/context/auth-context"
import { IncomeType } from "@/lib/definitions";
import { useState, useEffect } from "react";
import { getASubCollection } from "@/functions/get-a-sub-collection";

export default function Page() {
    return(
        <div>
            <div className="grid rounded-lg grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 mb-4 bg-gray-100">
                {/* Today's Allowed Expense */}
                <div className="bg-cyan-500 text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Today's Allowed Expense</h2>
                    <p className="text-3xl font-bold">XAF 2000</p>
                </div>

                {/* Today's Amount to Spend Left */}
                <div className="bg-cyan-500 text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Today's Amount Left</h2>
                    <p className="text-3xl font-bold">XAF 500</p>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-cyan-500 text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Monthly Revenue</h2>
                    <p className="text-3xl font-bold">XAF 150,000</p>
                </div>

                {/* Monthly Savings */}
                <div className="bg-cyan-500 text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Monthly Savings</h2>
                    <p className="text-3xl font-bold">XAF 50,000</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <DoubleLineChart />
                <PieDonutChart />
            </div>

        </div>

    )
}