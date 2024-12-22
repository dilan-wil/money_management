import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Category } from '@/functions/testBudget';


export const CategorySummaryCard = ({category} : {category: Category}) => {
    const progressValue = (category.currentAmount / category.totalAmount) * 100;

    return (
        <div >
            <Card key={category.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50" style={{ backgroundImage: 'url(/chalk.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <CardTitle className="text-lg text-gray-300">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="mb-4">
                        <Progress className={`${progressValue > 75 ? '[&>*]:bg-red-600' : '[&>*]:bg-blue-600'}`} value={(category.currentAmount / category.totalAmount) * 100}/>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                        ${category.currentAmount.toFixed(2)} / ${category.totalAmount.toFixed(2)}
                    </p>
                    <Button  className="w-full bg-green-600">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Expense
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default CategorySummaryCard;