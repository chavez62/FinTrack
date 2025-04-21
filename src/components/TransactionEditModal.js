import { useState, useEffect } from 'react';
import { useBudgetContext } from '../hooks/useBudgetContext';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

const TransactionEditModal = ({ item, onClose }) => {
  const { editTransaction, categories } = useBudgetContext();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        amount: item.amount,
        type: item.type || 'expense',
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim()) {
      setError('Transaction description is required');
      return;
    }
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!formData.date) {
      setError('Please select a date');
      return;
    }
    
    // Clear error if validation passed
    setError('');
    
    // Edit the transaction
    editTransaction(item.id, {
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: formData.date
    });
    
    // Close the modal
    onClose();
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Transaction</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>
          
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
          
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Amount ($)</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant={formData.type === "income" ? "success" : "primary"} 
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionEditModal;