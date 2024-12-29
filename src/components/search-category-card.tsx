'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { useAuth } from './context/auth-context'
import { Category } from '@/lib/definitions'
import CategorySummaryCard from './category-summary-card'

export const SearchCategoryCard = ({ searchWord }: { searchWord: string }) => {
    const { categories } = useAuth()
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            const filteredCategories = categories?.filter((cat: Category) =>
                cat.name.toLowerCase().includes(searchWord?.toLowerCase() || '')
            )
            setFilteredCategories(filteredCategories)
        }
        fetchCategories()
    }, [searchWord])

    return (
        <div className="container mx-auto max-w-4xl">
            <h2 className='mb-4'>Search Results for "{searchWord}"</h2>
            {categories.length === 0 ? (
                <p>No categories found matching your search.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCategories.map((category: Category) => (
                        <CategorySummaryCard category={category} minimalist={true}/>
                    ))}
                </div>
            )}
        </div>
    )
}

