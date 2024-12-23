'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { PlusIcon, ChevronDownIcon, ChevronRightIcon, Percent, Trash2, MoreVertical, Edit, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addSubcategory, deleteCategory, updateCategory, getCategories, Category } from '@/functions/testBudget'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const TOTAL_INCOME = 50000

export default function SettingsPage() {
  const [budgetPeriod, setBudgetPeriod] = useState('monthly')
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set<string>())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryValue, setNewCategoryValue] = useState('')
  const [newCategoryType, setNewCategoryType] = useState<'percentage' | 'amount'>('percentage')
  const [currentParentId, setCurrentParentId] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showAmounts, setShowAmounts] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories)
    }
    fetchCategories()
  }, [])

  const handleAddCategory = (parentId: string | null) => {
    setCurrentParentId(parentId)
    setEditingCategory(null)
    setNewCategoryName('')
    setNewCategoryValue('')
    setNewCategoryType('percentage')
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setNewCategoryName(category.name)
    setNewCategoryValue(category.percentage.toString())
    setNewCategoryType('percentage')
    setIsDialogOpen(true)
  }

  const handleSaveCategory = async () => {
    try {
      const value = parseFloat(newCategoryValue)
      if (isNaN(value) || value < 0) {
        throw new Error("Invalid value")
      }

      if (editingCategory) {
        const updatedCategory: Category = {
          ...editingCategory,
          name: newCategoryName,
          [newCategoryType]: value,
        }
        await updateCategory(updatedCategory)
        toast({
          title: "Category updated",
          description: "Your category has been successfully updated.",
        })
      } else {
        const newCategory: Omit<Category, 'id' | 'currentAmount'> = {
          name: newCategoryName,
          percentage: value,
          isParent: currentParentId === 'none',
          parent: currentParentId || 'none'
        }
        await addSubcategory(newCategory)
        toast({
          title: "Category added",
          description: "Your new category has been successfully added.",
        })
      }
      const updatedCategories = await getCategories()
      setCategories(updatedCategories)
      setIsDialogOpen(false)
      setNewCategoryName('')
      setNewCategoryValue('')
      setEditingCategory(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id)
      const updatedCategories = await getCategories()
      setCategories(updatedCategories)
      toast({
        title: "Category deleted",
        description: "The category has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const calculateDisplayAmount = (category: Category): number => {
    const getParentPercentage = (cat: Category): number => {
      if (cat.parent === 'none') return 100
      const parent = categories.find(c => c.id === cat.parent)
      return parent ? parent.percentage * getParentPercentage(parent) / 100 : 100
    }

    const parentPercentage = getParentPercentage(category)
    return (category.percentage / 100) * (parentPercentage / 100) * TOTAL_INCOME
  }

  const renderCategories = (parent: string, level: number = 0) => {
    return categories
      .filter(category => category.parent === parent)
      .map((category) => (
        <Card key={category.id} className="mb-2" style={{ marginLeft: `${level * 20}px` }}>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-2">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {category.isParent && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleItem(category.id)}
                >
                  {expandedItems.has(category.id) ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </Button>
              )}
              <span className="font-medium">{category.name}</span>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              <span className="text-sm text-gray-600">
                {showAmounts
                  ? `$${calculateDisplayAmount(category).toFixed(2)}`
                  : `${category.percentage.toFixed(2)}%`
                }
              </span>
              <div className="hidden sm:flex sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddCategory(category.id)}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleAddCategory(category.id)}>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Subcategory
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
          {category.isParent && expandedItems.has(category.id) && renderCategories(category.id, level + 1)}
        </Card>
      ))
  }

  return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="mb-8">
              <Label htmlFor="budget-period" className="text-lg font-medium mb-2">Budget Period</Label>
              <Select value={budgetPeriod} onValueChange={setBudgetPeriod}>
                <SelectTrigger id="budget-period" className="w-full">
                  <SelectValue placeholder="Select budget period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-2xl font-semibold">Budget Categories</h2>
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-amounts"
                      checked={showAmounts}
                      onCheckedChange={setShowAmounts}
                    />
                    <Label htmlFor="show-amounts" className="text-sm">
                      {showAmounts ? 'Show Amounts' : 'Show Percentages'}
                    </Label>
                  </div>
                  <Button onClick={() => handleAddCategory('none')}>
                    <PlusIcon className="w-4 h-4 mr-0 sm:mr-2" />
                    <span className='max-sm:hidden'>Add Category</span>
                  </Button>
                </div>
              </div>
              {renderCategories('none')}
            </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : `Add New ${currentParentId === 'none' ? 'Category' : 'Subcategory'}`}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value-type" className="text-right">
                  Type
                </Label>
                <RadioGroup
                  id="value-type"
                  value={newCategoryType}
                  onValueChange={(value: any) => setNewCategoryType(value as 'percentage' | 'amount')}
                  className="flex col-span-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage">Percentage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amount" id="amount" />
                    <Label htmlFor="amount">Amount</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  {newCategoryType === 'percentage' ? 'Percentage' : 'Amount'}
                </Label>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="value"
                    value={newCategoryValue}
                    onChange={(e) => setNewCategoryValue(e.target.value)}
                    className="flex-grow"
                    type="number"
                    min="0"
                    max={newCategoryType === 'percentage' ? "100" : undefined}
                  />
                  {newCategoryType === 'percentage' ? (
                    <Percent className="ml-2" />
                  ) : (
                    <DollarSign className="ml-2" />
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveCategory}>
                {editingCategory ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}

