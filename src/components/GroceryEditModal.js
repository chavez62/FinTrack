import { useState, useEffect } from 'react';
import { useGroceryContext } from '../hooks/useGroceryContext';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

const GroceryEditModal = ({ item, onClose }) => {
  const { editItem, categories } = useGroceryContext();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 1,
    price: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price
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
      setError('Item name is required');
      return;
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }
    
    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }
    
    // Clear error if validation passed
    setError('');
    
    // Edit the item
    editItem(item.id, {
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price)
    });
    
    // Close the modal
    onClose();
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Grocery Item</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
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
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Price Per Unit ($)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0.01"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GroceryEditModal;