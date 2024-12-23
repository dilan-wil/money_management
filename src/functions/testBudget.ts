// Simulated Category type
export type Category = {
    id: string
    name: string
    percentage: number
    isParent: boolean
    parent: string
    currentAmount: number
  }
  
  // Simulated database
  let simulatedDb: Category[] = [
    { id: '1', name: 'Essentials', percentage: 50, isParent: true, parent: "none", currentAmount:Math.random() * 1000},
    { id: '2', name: 'Food', percentage: 30, isParent: false, parent: "1", currentAmount:Math.random() * 1000},
    { id: '3', name: 'Transport', percentage: 20, isParent: false, parent: "1", currentAmount:Math.random() * 1000},
    { id: '4', name: 'Lifestyle', percentage: 30, isParent: true, parent: "none", currentAmount:Math.random() * 1000},
    { id: '5', name: 'Clothing', percentage: 15, isParent: true, parent: "4", currentAmount:Math.random() * 1000},
    { id: '7', name: 'Retro', percentage: 15, isParent: false, parent: "5", currentAmount:Math.random() * 1000},
    { id: '6', name: 'Entertainment', percentage: 15, isParent: false, parent: "4", currentAmount:Math.random() * 1000},
  ]
  
  // Simulated addSubcategory function
  export async function addSubcategory(category: Omit<Category, 'id' | 'currentAmount'>): Promise<void> {
    const newCategory: Category = {
      ...category,
      currentAmount: 0,
      id: Date.now().toString(), // Generate a unique ID
    }
    simulatedDb.push(newCategory)
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
  }
  
  // Simulated deleteCategory function
  export async function deleteCategory(categoryId: string): Promise<void> {
    simulatedDb = simulatedDb.filter(category => category.id !== categoryId)
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
  }
  
  // Simulated getCategories function
  export async function getCategories(): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    return [...simulatedDb] // Return a copy of the simulated database
  }