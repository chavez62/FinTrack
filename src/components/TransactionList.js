import { useState } from "react";
import { useBudgetContext } from "../hooks/useBudgetContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";
import TransactionEditModal from "./TransactionEditModal";
import {
  Table,
  Form,
  InputGroup,
  Button,
  Badge,
  Container,
  Row,
  Col,
} from "react-bootstrap";

const TransactionList = () => {
  const {
    filteredTransactions,
    categories,
    currentFilter,
    handleFilter,
    searchTerm,
    setSearchTerm,
    deleteTransaction,
  } = useBudgetContext();

  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white shadow p-4 card" style={{ borderTop: '4px solid var(--color-primary)' }}>
      <h5 className="mb-4 d-flex align-items-center">
        <span className="rounded-circle me-2 p-2 bg-primary bg-opacity-10">
          <FaArrowDown size={16} className="text-primary" />
        </span>
        Transaction History
      </h5>

      {/* Search and Filter */}
      <div className="mb-4">
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleFilter(currentFilter, e.target.value);
            }}
          />
        </InputGroup>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <Button
            variant={currentFilter === "All" ? "primary" : "outline-secondary"}
            size="sm"
            onClick={() => handleFilter("All")}
          >
            All
          </Button>

          {categories.map((category) => {
            const categoryClass = `badge-${category.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <Button
                key={category}
                className={currentFilter === category ? categoryClass : ""}
                variant={
                  currentFilter === category ? "primary" : "outline-secondary"
                }
                size="sm"
                onClick={() => handleFilter(category)}
              >
                {category}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-5 text-muted">
          No transactions found. Add some transactions to get started!
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layout
                  >
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.name}</td>
                    <td>
                      <Badge 
                        className={`badge-${transaction.category.toLowerCase().replace(/\s+/g, '-')}`} 
                        pill
                      >
                        {transaction.category}
                      </Badge>
                    </td>
                    <td>
                      {transaction.type === "income" ? (
                        <span className="income-indicator">
                          <FaArrowUp className="me-1" />Income
                        </span>
                      ) : (
                        <span className="expense-indicator">
                          <FaArrowDown className="me-1" />Expense
                        </span>
                      )}
                    </td>
                    <td>
                      <strong 
                        className={transaction.type === "income" ? "income-indicator" : "expense-indicator"}
                      >
                        ${parseFloat(transaction.amount).toFixed(2)}
                      </strong>
                    </td>
                    <td className="text-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="rounded-circle p-1 me-2 border-0"
                        onClick={() => handleEdit(transaction)}
                      >
                        <FaEdit size={14} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-circle p-1 border-0"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        <FaTrash size={14} />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </Table>
        </div>
      )}

      {editingTransaction && (
        <TransactionEditModal item={editingTransaction} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default TransactionList;