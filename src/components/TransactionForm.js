import { useState } from "react";
import { useBudgetContext } from "../hooks/useBudgetContext";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const TransactionForm = () => {
  const { addTransaction, categories } = useBudgetContext();
  const [formData, setFormData] = useState({
    name: "",
    category: "Housing",
    amount: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0]
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name.trim()) {
      setError("Transaction description is required");
      return;
    }

    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      parseFloat(formData.amount) <= 0
    ) {
      setError("Please enter a valid amount");
      return;
    }

    if (!formData.date) {
      setError("Please select a date");
      return;
    }

    // Clear error if validation passed
    setError("");

    // Add the transaction
    addTransaction({
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: formData.date
    });

    // Reset form
    setFormData({
      name: "",
      category: formData.type === "income" ? "Income" : "Housing",
      amount: "",
      type: "expense",
      date: new Date().toISOString().split("T")[0]
    });
  };

  return (
    <motion.div
      className="p-4 bg-white shadow card"
      style={{ 
        borderTop: `4px solid ${formData.type === "income" ? "var(--color-success)" : "var(--color-primary)"}`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h5 className="mb-4 d-flex align-items-center">
        <span className={`rounded-circle me-2 p-2 ${formData.type === "income" ? "bg-success" : "bg-primary"} bg-opacity-10`}>
          <FaWallet size={16} className={formData.type === "income" ? "text-success" : "text-primary"} />
        </span>
        Add New Transaction
      </h5>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Rent payment"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Amount ($)</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                placeholder="0.00"
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button 
          variant={formData.type === "income" ? "success" : "primary"} 
          type="submit" 
          className="w-100 mt-3 py-2"
          style={{ 
            background: formData.type === "income" ? 'var(--gradient-success)' : 'var(--gradient-primary)',
            border: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          <FaWallet className="me-2" />
          Add {formData.type === "income" ? "Income" : "Expense"}
        </Button>
      </Form>
    </motion.div>
  );
};

export default TransactionForm;