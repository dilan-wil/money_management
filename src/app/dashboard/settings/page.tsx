'use client'
import { addToSubCollection } from '@/functions/add-to-sub-collection'
import { deleteASubDocument } from '@/functions/delete-sub-document'
import { updateASubDocument } from '@/functions/update-sub-document'
import { updateADocument } from '@/functions/update-a-document'
import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { PlusIcon, ChevronDownIcon, ChevronRightIcon, Percent, Trash2, MoreVertical, Edit, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Category } from '@/lib/definitions'
import { useAuth } from "@/components/context/auth-context";
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'



export default function SettingsPage() {
  const { user, categories, setCategories, userInfos, setUserInfos, income } = useAuth()
  const [budgetPeriod, setBudgetPeriod] = useState('monthly')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set<string>())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [frequent, setFrequent] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryValue, setNewCategoryValue] = useState('')
  const [newCategoryBudgetPeriod, setNewCategoryBudgetPeriod] = useState('')
  const [newCategoryType, setNewCategoryType] = useState<'percentage' | 'amount'>('percentage')
  const [currentParentId, setCurrentParentId] = useState<string>("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showAmounts, setShowAmounts] = useState(false)
  const { toast } = useToast()

  const totalIncome = income?.reduce((sum: number, income: any) => sum + Number(income.amount || 0), 0)

  // const handleBudgetPeriodChange = async (value: string) => {
  //   console.log(value)
  //   if (!user) {
  //     return
  //   }
  //   try {
  //     await updateADocument("users", user.uid, { budgetPeriod: value })
  //     toast({
  //       title: "Updated",
  //       description: "Budget Period updated successfully.",
  //       variant: "success",
  //     })
  //   } catch {
  //     toast({
  //       title: "Error",
  //       description: "Failed to update budget period.",
  //       variant: "destructive",
  //     })
  //   }
  // }

  const handleAddCategory = (parentId: string) => {
    setCurrentParentId(parentId)
    setEditingCategory(null)
    setNewCategoryName('')
    setNewCategoryValue('')
    setNewCategoryType('percentage')
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setCurrentParentId(category.parent)
    setEditingCategory(category)
    setNewCategoryName(category.name)
    setNewCategoryBudgetPeriod(category.budgetPeriod)
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

      setLoading(true)

      const parentCategory = currentParentId === 'none'
        ? null
        : categories.find((category: any) => category.id === currentParentId);
      console.log(editingCategory)

      if (currentParentId !== 'none' && !parentCategory) {
        throw new Error("Parent category not found");
      }

      const parentTotalAmount = parentCategory?.totalAmount || totalIncome;


      const percentageValue =
        newCategoryType === 'amount'
          ? (value / parentTotalAmount) * 100
          : value;


      // Validate total percentage does not exceed 100%
      const totalPercentage = categories.reduce(
        (sum: any, category: any) =>
          sum + (category.parent === currentParentId ? category.percentage : 0),
        0
      );

      if (totalPercentage - (editingCategory ? editingCategory.percentage : 0) + percentageValue > 100) {
        throw new Error("Total percentage cannot exceed 100%");
      }

      //check if it is editing and editing function
      if (!user) {
        return
      }

      if (editingCategory) {
        const updatedCategory: Category = {
          ...editingCategory,
          name: newCategoryName,
          percentage: percentageValue,
          budgetPeriod: newCategoryBudgetPeriod,
          frequent: frequent
        }
        const updatedSuccessful = await updateASubDocument("users", user.uid, "categories", editingCategory.id, updatedCategory)
        console.log(updatedSuccessful)
        if (updatedSuccessful) {
          setCategories((prevCategories: any) =>
            prevCategories.map((category: any) =>
              category.id === editingCategory.id
                ? { ...category, ...updatedCategory }
                : category
            )
          );

          toast({
            variant: "success",
            title: "Category updated",
            description: "Your category has been successfully updated.",
          })
        }
      }

      // this is if it is to create
      else {
        const newCategory: Omit<Category, 'id'> = {
          name: newCategoryName,
          percentage: percentageValue,
          isParent: false,
          parent: currentParentId || 'none',
          currentAmount: 0,
          totalAmount: (percentageValue / 100) * parentTotalAmount,
          budgetPeriod: newCategoryBudgetPeriod,
          frequent: frequent
        }

        if (currentParentId !== 'none') {
          await updateASubDocument("users", user.uid, "categories", currentParentId, { isParent: true })
        }
        const addedCategory = await addToSubCollection(newCategory, user.uid, "categories")

        //check if added category is not null
        if (!addedCategory) {
          throw new Error("Failed to add new category");
        }


        // Append the new category to the categories state
        setCategories((prevCategories: any) => [
          ...prevCategories,
          { ...newCategory, id: addedCategory },
        ]);
        //show alert 
        toast({
          variant: "success",
          title: "Category added",
          description: "Your new category has been successfully added.",
        })
      }

      setIsDialogOpen(false)
      setNewCategoryName('')
      setNewCategoryValue('')
      setEditingCategory(null)
    } catch (error) {
      if (error = "Total percentage cannot exceed 100%") {
        toast({
          title: "Incorrect percentage",
          description: "Total percentage cannot exceed 100%.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save category. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    console.log(id)
    if (!user) {
      console.error('User is not authenticated');
      return false;
    }
    try {
      setLoading(true)
      const deletedSuccessful = await deleteASubDocument("users", user.uid, "categories", id)
      console.log(deletedSuccessful)
      if (deletedSuccessful) {
        // Update the categories state by filtering out the deleted category
        setCategories((prevCategories: any) =>
          prevCategories.filter((category: any) => category.id !== id)
        );

        toast({
          variant: "success",
          title: "Category deleted",
          description: "The category has been successfully deleted.",
        })
      }
      else {
        toast({
          title: "Deletion failed",
          description: "Could not delete the category. Please try again.",
          variant: "destructive",
        });
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
      const parent = categories.find((c: any) => c.id === cat.parent)
      return parent ? parent.percentage * getParentPercentage(parent) / 100 : 100
    }

    const parentPercentage = getParentPercentage(category)
    return (category.percentage / 100) * (parentPercentage / 100) * totalIncome
  }

  if (categories === null) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="mb-2">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const renderCategories = (parent: string, level: number = 0) => {
    return categories
      ?.filter((category: any) => category.parent === parent)
      .map((category: any) => (
        <Card key={category.id} className="mb-2" style={{ marginLeft: `${level * 20}px` }}>
          <CardContent className="flex flex-row items-start sm:items-center justify-between p-4 gap-2">
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
                  ? `${userInfos.currency === "CAD" || userInfos.currency === "USD" ? "$" : userInfos.currency === "EUR" ? "€" : "XAF"}
                  ${calculateDisplayAmount(category).toFixed(2)}`
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
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
    <div className="container mx-auto max-w-4xl">
      <h4>You can still budget 
        <span className='text-blue-400'> 
          {100 - (categories?.filter((category: any) => category.parent === "none").reduce((sum: number, category: Category) => sum + Number(category.percentage || 0), 0))}% 
          </span>
        of your total income(s)
      </h4>

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
                readOnly={loading}
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
                  readOnly={loading}
                />
                {newCategoryType === 'percentage' ? (
                  <Percent className="ml-2" />
                ) : (
                  <DollarSign className="ml-2" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Budget Period</Label>
              <div className="col-span-3 flex items-center">
                <Select value={newCategoryBudgetPeriod}
                  onValueChange={(value) => setNewCategoryBudgetPeriod(value)}
                >
                  <SelectTrigger id="budget-period" className="">
                    <SelectValue placeholder="Select budget period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <Label className="text-right">Frequent Category</Label><br />
                <span style={{ fontSize: 10 }} className='text-blue-400'>Check the box to show an overview of your category on the overview page</span>
              </div>
              <div className="col-span-3 flex items-center">
                <Checkbox
                  checked={frequent}
                  onCheckedChange={(checked) => setFrequent(!!checked)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={loading} onClick={handleSaveCategory}>
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                editingCategory ? 'Update' : 'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

