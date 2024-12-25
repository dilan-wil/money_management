'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { IncomeType, ExpenseType } from '@/lib/definitions';
import { MoreHorizontal, ArrowUpDown, Loader2 } from 'lucide-react';
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
import { deleteASubDocument } from '@/functions/delete-sub-document';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './context/auth-context';

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDelete = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return false;
    }
    setLoading(true);
    const deletedSuccessful = await deleteASubDocument(
      'users',
      user.uid,
      `${type.toLowerCase()}s`,
      item.id
    );
    setLoading(false);

    if (deletedSuccessful === true) {
      setIsAlertOpen(false);
      toast({
        variant: 'success',
        title: 'Successful.',
        description: `${type} ${item.id} has been deleted successfully.`,
      });
    } else {
      console.error('Error deleting document');
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

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

      <Dialog
        open={isDialogOpen}
        onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
      >
        <DialogTrigger asChild></DialogTrigger>
        <ModifyDialog
          data={item}
          table={type.toLowerCase() + 's'}
          onClose={() => setIsDialogOpen(false)}
        />
      </Dialog>

      <AlertDialog
        open={isAlertOpen}
        onOpenChange={() => setIsAlertOpen(!isAlertOpen)}
      >
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              {type === 'Income' ? (item as IncomeType).source : (item as ExpenseType).category} (
              {item.id}) and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

type ColumnType = 'Income' | 'Expense';

const createColumns = <T extends IncomeType | ExpenseType>(
  type: ColumnType,
  currency: string
): ColumnDef<T>[] => {
  const commonColumns: ColumnDef<T>[] = [
    {
      accessorKey: type === 'Income' ? 'source' : 'category',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          aria-label={`Sort by ${type === 'Income' ? 'Source' : 'Category'}`}
        >
          {type === 'Income' ? 'Source' : 'Category'}
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
          aria-label="Sort by Amount"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency || "XAF",
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
  ];

  const specificColumns: ColumnDef<T>[] =
    type === 'Expense'
      ? [
        {
          accessorKey: 'description',
          header: 'Description',
        },
        {
          accessorKey: 'updatedAt',
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              aria-label="Sort by Date"
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
        },
      ]
      : [
        {
          accessorKey: 'updatedAt',
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              aria-label="Sort by Updated At"
            >
              Updated At
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
        },
      ];

  return [...commonColumns, ...specificColumns,
  {
    id: 'actions',
    cell: ({ row }) => <ActionMenu item={row.original} type={type} />,
  }];
};

// Exported Columns
// Columns will be created inside the component where `userInfos.currency` is available
export function IncomeColumns() {
  const { userInfos } = useAuth();  // Access user info inside component
  return createColumns<IncomeType>('Income', userInfos.currency);
};

export  function ExpensesColumns(){
  const { userInfos } = useAuth();  // Access user info inside component
  return createColumns<ExpenseType>('Expense', userInfos.currency);
};