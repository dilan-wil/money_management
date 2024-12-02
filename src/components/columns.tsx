'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { IncomeType, ExpenseType } from '@/lib/definitions';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ModifyDialog } from './modify-dialog';

type ActionMenuProps<T> = {
  item: T;
  type: 'Income' | 'Expense';
};

// Reusable Action Menu Component
const ActionMenu = <T extends IncomeType | ExpenseType>({
  item,
  type,
}: ActionMenuProps<T>) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                Modify {type}
              </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
              style={{ color: 'red' }}
              onClick={() => setIsAlertOpen(true)}
          >
              Delete {type}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


          <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)}>
            <DialogTrigger asChild>
                </DialogTrigger>
            <ModifyDialog data={item} />
          </Dialog>

          <AlertDialog open={isAlertOpen} onOpenChange={() => setIsAlertOpen(!isAlertOpen)}>
            <AlertDialogTrigger asChild>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {item.name} ({item.id}) and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600"
                  onClick={() => {
                    console.log(`Deleted ${type}:`, item);
                    setIsAlertOpen(false);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    </div>
  );
};

type ColumnType = 'Income' | 'Expense';

const createColumns = <T extends IncomeType | ExpenseType>(type: 'Income' | 'Expense'): ColumnDef<T>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: type === 'Income' ? 'updatedAt' : 'percentage',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {type === 'Income' ? 'Updated At' : 'Percentage (%)'}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'XAF',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionMenu item={row.original} type={type} />,
  },
];

// Exported Columns
export const incomeColumns: ColumnDef<IncomeType>[] = createColumns<IncomeType>('Income');
export const expensesColumns: ColumnDef<ExpenseType>[] = createColumns<ExpenseType>('Expense');

