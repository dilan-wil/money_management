'use client'
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { addToSubCollection } from "@/functions/add-to-sub-collection";
import { useAuth } from "./context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


export function CreateDialog({ data, table, onClose, }: { data: string[]; table: string; onClose: () => void; }) {
  const { user, categories, userInfos } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const divisor = userInfos.budgetPeriod === "weekly" ? 4 : userInfos.budgetPeriod === "daily" ? 30 : 1;

  const [formData, setFormData] = useState(
    Object.fromEntries(data.map((field) => [field, ""]))
  );

  const [errors, setErrors] = useState(
    Object.fromEntries(data.map((field) => [field, ""]))
  );

  const validateField = (name: string, value: string) => {
    const error =
      value.length >= 3
        ? ""
        : `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least 3 characters long.`;
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.length >= 2
          ? ""
          : `${key.charAt(0).toUpperCase() + key.slice(1)} must be at least 3 characters long.`,
      ])
    );

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      if (!user) {
        console.error("User is not authenticated");
        return false;
      }

      const selectedCategory = categories.find(
        (category: any) => category.name === formData.category
      );
      if (!selectedCategory) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid category selected.",
        });
        return;
      }

      // Calculate current amount
      const currentAmount = selectedCategory.currentAmount || 0; // Assume currentAmount is tracked in categories
      const newExpenseAmount = parseFloat(formData.amount) || 0;

      if (currentAmount + newExpenseAmount > (selectedCategory.totalAmount/divisor)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Adding this expense will exceed the total allowed amount for the ${selectedCategory.name} category.`,
        });
        return;
      }

      setLoading(true);
      const addedSuccessful = await addToSubCollection(formData, user.uid, table);
      setLoading(false);

      if (addedSuccessful !== null) {
        onClose(); // Close the dialog
        toast({
          variant: "success",
          title: "Successful.",
          description: `Your new ${table} has been added.`,
        });
      } else {
        console.error("Error adding income/expense");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    }
  };


  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Income</DialogTitle>
        <DialogDescription>
          Add a new source of income to your list of incomes. Click "Add New" when you're done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          {data.map((name, index) => (
            <div key={index} className="flex flex-col w-full text-sm">
              <Label className="block text-sm font-medium text-gray-700">
                {name}:
              </Label>
              {name.toLowerCase() === "category" ? (

                <Select
                  onValueChange={(value) => {
                    const selectedCategory = categories.find((category: any) => category.id === value); // Find the full category object
                    setFormData((prev) => ({
                      ...prev,
                      [name]: selectedCategory?.name, // Store only the category name
                      categoryId: selectedCategory?.id, // Optionally store the category ID
                    }));
                    return
                  }}                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
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
              ) : (
                <Input
                  type={
                    name.toLowerCase() === "amount" || name.toLowerCase() === "percentage"
                      ? "number"
                      : "text"
                  }
                  name={name}
                  placeholder={`Enter ${name}`}
                  onChange={handleChange}
                  readOnly={loading}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter style={{ width: "100%" }} className="w-full flex justify-between">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button type="submit" className="bg-green-600" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}Add new
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}