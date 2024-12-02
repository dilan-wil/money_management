'use client'
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function CreateDialog({data }: {data: string[]}) {

    const [formData, setFormData] = useState(
        Object.fromEntries(data.map((field) => [field, ""]))
      );
    
      const [errors, setErrors] = useState(
        Object.fromEntries(data.map((field) => [field, ""]))
      );

    const [isValid, setIsValid] = useState(false)

    // Real-time validation function
    const validateField = (name: string, value: string) => {
        const error =
          value.length >= 3
            ? ""
            : `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least 3 characters long.`;
        setErrors((prev) => ({ ...prev, [name]: error }));
      };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [
            key,
            value.length >= 3
              ? ""
              : `${key.charAt(0).toUpperCase() + key.slice(1)} must be at least 3 characters long.`,
          ])
        );
    
        setErrors(newErrors);
    
        if (Object.values(newErrors).every((error) => !error)) {
          console.log("Form submitted successfully:", formData);
          // Perform your submit logic here.
        }
      };

    return(
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
                    {/* Display the name */}
                    <Label className="block text-sm font-medium text-gray-700">{name}:</Label>
                    
                    {/* Render an input with dynamic type */}
                    <Input 
                        type={name.toLowerCase() === "amount" || name.toLowerCase() === "percentage" ? "number" : "text"} 
                        placeholder={`Enter ${name}`} 
                    />
                </div>
            ))}
            </div>
            <DialogFooter style={{width: "100%"}} className="w-full flex justify-between">
                <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <Button type="submit" className="bg-green-600">Add new</Button>
            </DialogFooter>
            </form>
        </DialogContent>
    )
}