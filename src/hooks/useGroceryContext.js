import { useContext } from 'react';
import { BudgetContext } from '../context/GroceryContext';

export const useBudgetContext = () => {
  const context = useContext(BudgetContext);
  
  if (!context) {
    throw new Error('useBudgetContext must be used within a BudgetProvider');
  }
  
  return context;
};