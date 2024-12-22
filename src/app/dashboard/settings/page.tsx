'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/context/auth-context';
import { PlusIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

type Category = {
  name: string;
  percentage: number;
  isParent: boolean;
  parent: string;
};

const initialCategories: Category[] = [
  {
    name: 'test1',
    percentage: 20,
    isParent: true,
    parent: "none"
  },
  {
    name: 'food',
    percentage: 50,
    isParent: false,
    parent: "test1"
  },
  {
    name: 'transport',
    percentage: 50,
    isParent: false,
    parent: "test1"
  },
  {
    name: 'lifestyle',
    percentage: 20,
    isParent: true,
    parent: "none"
  },
  {
    name: 'dress',
    percentage: 20,
    isParent: true,
    parent: "lifestyle"
  },
  {
    name: 'casual',
    percentage: 70,
    isParent: false,
    parent: "dress"
  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [budgetPeriod, setBudgetPeriod] = useState('monthly'); // daily, monthly, yearly
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set<string>());
  const [newElement, setNewElement] = useState<string>('');
  const [newPercentage, setNewPercentage] = useState<number>(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number | null>(null);
  const [dialogType, setDialogType] = useState<'category' | 'element' | null>(null);

  const handleAddCategory = () => {
    setDialogType('category');
    setCurrentCategoryIndex(null);
  };

  const handleAddElement = (index: number) => {
    setDialogType('element');
    setCurrentCategoryIndex(index);
  };

  const handleSaveCategory = () => {
    if (dialogType === 'category') {
      const newCategory: Category = { name: newElement, percentage: 0, isParent: true, parent: "none" };
      setCategories([...categories, newCategory]);
    } else if (dialogType === 'element' && currentCategoryIndex !== null) {
      const updatedCategories = [...categories];
      updatedCategories[currentCategoryIndex].isParent = false; // Mark the current category as non-parent
      setCategories(updatedCategories);
    }

    setNewElement('');
    setDialogType(null); // Close the dialog
  };

  const handlePercentageChange = (value: string) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setNewPercentage(parsedValue);
    }
  };

  const handleSavePercentage = () => {
    if (currentCategoryIndex !== null) {
      const updatedCategories = [...categories];
      updatedCategories[currentCategoryIndex].percentage = newPercentage;
      setCategories(updatedCategories);
    }

    setNewPercentage(0);
    setDialogType(null); // Close the dialog
  };

  const toggleItem = (index: number) => {
    const itemKey = `item-${index}`;
    setExpandedItems(prev => prev.has(itemKey) ? prev.delete(itemKey) : prev.add(itemKey));
  };

  const renderCategories = (parent: string, level: number = 0) => {
    return categories
      .filter(category => category.parent === parent)
      .map((category, index) => (
        <div key={index} style={{ marginLeft: `${level * 20}px` }}>
          <div className='w-full flex justify-between bg-gray-100 items-center'>
            <div className='flex gap-5'>
              <Button onClick={() => toggleItem(index)}>
                {expandedItems.has(`item-${index}`) ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                )}
              </Button>
              <span>{category.name}</span>
              {category.isParent && <Button onClick={() => handleAddElement(index)}>Add Element</Button>}
            </div>
            <div className='flex gap-5'>
              <span>{category.percentage}% of income</span>
            </div>
          </div>
          {category.isParent && expandedItems.has(`item-${index}`) && renderCategories(category.name, level + 1)}
        </div>
      ));
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Budget Period */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Budget Period</label>
        <select
          value={budgetPeriod}
          onChange={(e) => setBudgetPeriod(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* List Categories */}
      <div>
        {renderCategories('none', 0)}
      </div>
    </div>
  );
}
