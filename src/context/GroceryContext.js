import { createContext, useState, useEffect, useCallback } from 'react';

export const BudgetContext = createContext();

const BudgetProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories] = useState([
    'Housing', 'Transportation', 'Food', 'Utilities', 'Insurance', 
    'Healthcare', 'Entertainment', 'Personal Care', 'Education', 
    'Savings', 'Debt Payments', 'Income', 'Other'
  ]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter transactions by category and search term
  const handleFilter = useCallback((category, term = searchTerm) => {
    setCurrentFilter(category);
    setSearchTerm(term);
    
    let filtered = [...transactions];
    
    // Filter by category if not 'All'
    if (category !== 'All') {
      filtered = filtered.filter(transaction => transaction.category === category);
    }
    
    // Filter by search term if present
    if (term) {
      filtered = filtered.filter(transaction => 
        transaction.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    setFilteredTransactions(filtered);
  }, [transactions, searchTerm]);

  // Load data from localStorage when component mounts
  useEffect(() => {
    const storedTransactions = localStorage.getItem('budgetTransactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
      setFilteredTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  // Save data to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('budgetTransactions', JSON.stringify(transactions));
    handleFilter(currentFilter, searchTerm);
  }, [transactions, handleFilter, currentFilter, searchTerm]);

  // Add a new transaction
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      amount: parseFloat(transaction.amount),
      type: transaction.type || 'expense', // 'income' or 'expense'
      date: transaction.date || new Date().toISOString()
    };
    setTransactions([...transactions, newTransaction]);
  };

  // Edit an existing transaction
  const editTransaction = (id, updatedTransaction) => {
    const updatedTransactions = transactions.map(transaction => {
      if (transaction.id === id) {
        return {
          ...updatedTransaction,
          id,
          amount: parseFloat(updatedTransaction.amount)
        };
      }
      return transaction;
    });
    setTransactions(updatedTransactions);
  };

  // Delete a transaction
  const deleteTransaction = (id) => {
    const remainingTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(remainingTransactions);
  };

  // Calculate the total income
  const calculateIncome = () => {
    return transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0)
      .toFixed(2);
  };

  // Calculate the total expenses
  const calculateExpenses = () => {
    return transactions
      .filter(transaction => transaction.type !== 'income')
      .reduce((total, transaction) => total + transaction.amount, 0)
      .toFixed(2);
  };

  // Calculate the balance (income - expenses)
  const calculateBalance = () => {
    const income = parseFloat(calculateIncome());
    const expenses = parseFloat(calculateExpenses());
    return (income - expenses).toFixed(2);
  };

  // Calculate totals by category
  const calculateTotalByCategory = () => {
    const categoryTotals = {};
    
    categories.forEach(category => {
      const total = transactions
        .filter(transaction => transaction.category === category)
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      if (total > 0) {
        categoryTotals[category] = total.toFixed(2);
      }
    });
    
    return categoryTotals;
  };

  // Clear all transactions
  const clearAllTransactions = () => {
    setTransactions([]);
  };

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        filteredTransactions,
        categories,
        currentFilter,
        searchTerm,
        addTransaction,
        editTransaction,
        deleteTransaction,
        handleFilter,
        calculateIncome,
        calculateExpenses,
        calculateBalance,
        calculateTotalByCategory,
        clearAllTransactions,
        setSearchTerm
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetProvider;