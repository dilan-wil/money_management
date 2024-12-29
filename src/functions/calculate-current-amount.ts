import { ExpenseType } from '@/lib/definitions';
import { Timestamp } from 'firebase/firestore';

/**
 * Calculate the total expenses for a given category and budget period.
 * @param expenses - List of expenses.
 * @param categoryId - The ID of the category to filter by.
 * @param budgetPeriod - The budget period ('daily', 'weekly', 'monthly').
 * @returns The total amount for the given period.
 */
export const calculateCurrentAmount = (
  expenses: ExpenseType[],
  categoryId: string,
  budgetPeriod: 'daily' | 'weekly' | 'monthly'
): number => {
  const now = new Date();
  let startDate: Date;

  switch (budgetPeriod) {
    case 'daily':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0); // Start of today
      break;

    case 'weekly':
      const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Previous Monday
      startDate.setHours(0, 0, 0, 0);
      break;

    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the month
      break;

    default:
      throw new Error(`Invalid budget period: ${budgetPeriod}`);
  }

  return expenses
    .filter((expense) => {
      if (!expense.createdAt || expense.categoryId !== categoryId) return false;

      const createdAt =
        expense.createdAt instanceof Timestamp
          ? expense.createdAt.toDate()
          : expense.createdAt;

      return createdAt >= startDate && createdAt <= now;
    })
    .reduce((total, expense) => total + (expense.amount ?? 0), 0);
};
