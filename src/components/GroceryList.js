import { useState } from "react";
import { useGroceryContext } from "../hooks/useGroceryContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import GroceryEditModal from "./GroceryEditModal";
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

const GroceryList = () => {
  const {
    filteredItems,
    categories,
    currentFilter,
    handleFilter,
    searchTerm,
    setSearchTerm,
    deleteItem,
  } = useGroceryContext();

  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
  };

  return (
    <div className="bg-white shadow p-4" style={{ borderTop: '4px solid var(--color-blue)' }}>
      <h2 className="mb-4">Grocery List</h2>

      {/* Search and Filter */}
      <div className="mb-4">
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search items..."
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

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-5 text-muted">
          No items found. Add some grocery items!
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layout
                  >
                    <td>{item.name}</td>
                    <td>
                      <Badge 
                        className={`badge-${item.category.toLowerCase().replace(/\s+/g, '-')}`} 
                        pill
                      >
                        {item.category}
                      </Badge>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${parseFloat(item.price).toFixed(2)}</td>
                    <td>
                      <strong>${item.totalPrice.toFixed(2)}</strong>
                    </td>
                    <td className="text-end">
                      <Button
                        variant="link"
                        className="p-0 me-3 text-primary"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit size={18} />
                      </Button>
                      <Button
                        variant="link"
                        className="p-0 text-danger"
                        onClick={() => deleteItem(item.id)}
                      >
                        <FaTrash size={18} />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </Table>
        </div>
      )}

      {editingItem && (
        <GroceryEditModal item={editingItem} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default GroceryList;

