'use client';

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
import { IncomeType, ExpenseType } from "@/lib/definitions";
import { updateASubDocument } from "@/functions/update-sub-document";
import { useAuth } from "./context/auth-context"; 
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";


type DataType = IncomeType | ExpenseType;

export function ModifyDialog({data, table, onClose,}: {data: DataType; table: string; onClose: () => void;}) {

  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<DataType>(data);

  const [errors, setErrors] = useState(
    Object.fromEntries(Object.keys(data).map((key) => [key, ""]))
  );

  // Real-time validation function
  const validateField = (name: string, value: string) => {
    const error =
      value.length >= 3
        ? ""
        : `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least 3 characters long.`;
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as DataType));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = Object.entries(formData).reduce((acc, [key, value]) => {
      let error = "";

      if (typeof value === "string" && value.trim().length < 3) {
        error = `${key.charAt(0).toUpperCase() + key.slice(1)} must be at least 3 characters long.`;
      } else if (typeof value === "number" && value < 0) {
        error = `${key.charAt(0).toUpperCase() + key.slice(1)} must be a positive number.`;
      }

      return { ...acc, [key]: error };
    }, {});

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {

      // Perform your submit logic here.

      if (!user) {
        console.error("User is not authenticated");
        return false;
      }
      setLoading(true);
      const updatedSuccessful = await updateASubDocument("users", user.uid, table, data.id, formData);
      setLoading(false);

      if (updatedSuccessful === true) {
        onClose(); // Close the dialog
        toast({
          variant: "success",
          title: "Successful.",
          description: `${table} ${table === "incomes" ? (data as IncomeType).source : (data as ExpenseType).category} has been updated.`,
        })
      } else {
        console.error("Error updating income/expense");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
      }
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Modify Data</DialogTitle>
        <DialogDescription>
          Modify the details. Ensure all fields are at least 3 characters long.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          {Object.entries(formData)
            .filter(([key]) => key !== "updatedAt") // Exclude the "updatedAt" field
            .map(([name, value]) => (
              <div key={name} className="flex flex-col w-full text-sm">
                <Label className="block text-sm font-medium text-gray-700">
                  {name.charAt(0).toUpperCase() + name.slice(1)}:
                </Label>
                <Input
                  name={name}
                  value={value}
                  onChange={handleChange}
                  placeholder={`Enter ${name}`}
                  type={
                    name.toLowerCase() === "amount" || name.toLowerCase() === "percentage"
                      ? "number"
                      : "text"
                  }
                  readOnly={(name === "id") || loading} // Make the "id" field read-only
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
        </div>
        <DialogFooter className="w-full flex justify-between">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button type="submit" className="bg-green-600" disabled={loading}>
            {loading && <Loader2 className="animate-spin"/>}
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
