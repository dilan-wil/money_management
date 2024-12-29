import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { useAuth } from './context/auth-context'
import { ExpenseType } from '@/lib/definitions'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { addToSubCollection } from '@/functions/add-to-sub-collection'
import { Timestamp } from 'firebase/firestore'
import { calculateCurrentAmount } from '@/functions/calculate-current-amount'

export const CategorySummaryCard = ({ category, minimalist }: { category: any, minimalist: boolean }) => {
    const { categories, user, expenses, userInfos } = useAuth()
    const [amount, setAmount] = useState<number | null>(null)
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { toast } = useToast()
    const divisor = category.budgetPeriod === "weekly" ? 4 : category.budgetPeriod === "daily" ? 30 : 1;

    // Calculate currentAmount for base on the budgetPeriod expenses
    const currentAmount = calculateCurrentAmount(
        expenses,
        category.id,
        category.budgetPeriod
    );

    // Calculate the amount left for the category
    const amountLeft = (category.totalAmount / divisor) - currentAmount


    // Calculate progress value
    const progressValue = (currentAmount / (category.totalAmount / divisor)) * 100

    const handleSaveExpense = async () => {
        setLoading(true);
        if (!user) return;

        // Check if the expense will exceed the budget
        const newCurrentAmount = currentAmount + (amount === null ? 0 : amount);
        if (newCurrentAmount > category.totalAmount / divisor) {
            toast({
                title: "Budget Exceeded",
                description: "You cannot add this expense because it exceeds the category's budget.",
                variant: "destructive",  // Show error style
            });
            setLoading(false);
            return; // Prevent further processing
        }

        const newExpense: Omit<ExpenseType, 'id'> = {
            category: category.name,
            categoryId: category.id,
            amount: amount === null ? 0 : amount,
            description: description,
        };

        try {
            await addToSubCollection(newExpense, user?.uid, "expenses");
            toast({
                title: "Expense added",
                description: "Expense added successfully.",
                variant: "success",
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            setIsDialogOpen(false);
            setAmount(null)
            setDescription("")
        }
    };


    return (
        <div>
            <Card key={category.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50" style={{ backgroundImage: 'url(/chalk.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <CardTitle className="text-lg text-gray-300">{category.name}<br /></CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="mb-4">
                        <Progress className={`${progressValue > 75 ? '[&>*]:bg-red-600' : '[&>*]:bg-blue-600'}`} value={progressValue} />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                        {userInfos.currency === "CAD" || userInfos.currency === "USD" ? "$" : userInfos.currency === "EUR" ? "€" : "XAF"}
                        {(currentAmount)} /
                        {userInfos.currency === "CAD" || userInfos.currency === "USD" ? "$" : userInfos.currency === "EUR" ? "€" : "XAF"}
                        {(category.totalAmount / divisor).toFixed(2)}
                    </p>
                    <p className='text-sm text-gray-500 mb-2'>
                        You have <strong className='text-blue-400'>{amountLeft}</strong>
                        {userInfos.currency === "CAD" || userInfos.currency === "USD" ? "$ " : userInfos.currency === "EUR" ? "€ " : "XAF "}
                        for <strong className='text-blue-400'>{category.name} </strong>
                        this <strong className='text-blue-400'>{category.budgetPeriod === "weekly" ? "Week" : category.budgetPeriod === "Day" ? 30 : "Month"}</strong>

                    </p>
                    <Button onClick={() => setIsDialogOpen(true)} className="w-full bg-green-600">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Expense
                    </Button>
                </CardContent>
            </Card>

            {/* Dialog to add expense */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Expense</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <Select
                                value={category.id}
                                disabled
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories
                                        .filter((category: any) => category.isParent === false) // Filter categories
                                        .map((category: any) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount === null ? "" : amount}
                                onChange={(e) => setAmount(e.target.valueAsNumber)}
                                className="col-span-3"
                                readOnly={loading}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                                readOnly={loading}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={loading} onClick={handleSaveExpense}>
                            {loading && <Loader2 className='animate-spin' />} Save Expense
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default CategorySummaryCard;
