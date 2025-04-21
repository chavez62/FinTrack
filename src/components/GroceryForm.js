import { useState } from "react";
import { useGroceryContext } from "../hooks/useGroceryContext";
import { motion } from "framer-motion";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const GroceryForm = () => {
  const { addItem, categories } = useGroceryContext();
  const [formData, setFormData] = useState({
    name: "",
    category: "Produce",
    quantity: 1,
    price: "",
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
      setError("Item name is required");
      return;
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      setError("Please enter a valid price");
      return;
    }

    if (
      !formData.quantity ||
      isNaN(formData.quantity) ||
      parseInt(formData.quantity) <= 0
    ) {
      setError("Please enter a valid quantity");
      return;
    }

    // Clear error if validation passed
    setError("");

    // Add the item
    addItem({
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
    });

    // Reset form
    setFormData({
      name: "",
      category: "Produce",
      quantity: 1,
      price: "",
    });
  };

  return (
    <motion.div
      className="p-4 bg-white shadow"
      style={{ borderTop: '4px solid var(--color-green)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="mb-4">Add Grocery Item</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Apples"
              />
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
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Price Per Unit ($)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                placeholder="0.00"
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="success" type="submit" className="w-100 mt-3">
          Add Item
        </Button>
      </Form>
    </motion.div>
  );
};

export default GroceryForm;

