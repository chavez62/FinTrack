import { useState } from "react";
import { useGroceryContext } from "../hooks/useGroceryContext";
import { motion } from "framer-motion";
import { FaChartPie, FaFileDownload, FaTrash } from "react-icons/fa";
import {
  Card,
  Button,
  ButtonGroup,
  Alert,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define chart background colors
const categoryColors = {
  'Produce': 'rgba(40, 167, 69, 0.8)',   // Green
  'Dairy': 'rgba(13, 110, 253, 0.8)',    // Blue
  'Meat': 'rgba(220, 53, 69, 0.8)',      // Red
  'Bakery': 'rgba(255, 193, 7, 0.8)',    // Yellow
  'Frozen Foods': 'rgba(32, 201, 151, 0.8)', // Teal
  'Canned Goods': 'rgba(253, 126, 20, 0.8)', // Orange
  'Dry Goods': 'rgba(102, 16, 242, 0.8)',    // Indigo
  'Beverages': 'rgba(13, 110, 253, 0.7)',    // Light Blue
  'Snacks': 'rgba(255, 193, 7, 0.7)',        // Light Yellow
  'Household': 'rgba(111, 66, 193, 0.8)',    // Purple
  'Personal Care': 'rgba(232, 62, 140, 0.8)', // Pink
  'Other': 'rgba(108, 117, 125, 0.8)',       // Gray
};

// Fallback colors if needed
const fallbackColors = [
  "rgba(255, 99, 132, 0.8)",
  "rgba(54, 162, 235, 0.8)",
  "rgba(255, 206, 86, 0.8)",
  "rgba(75, 192, 192, 0.8)",
  "rgba(153, 102, 255, 0.8)",
  "rgba(255, 159, 64, 0.8)",
];

const GrocerySummary = () => {
  const { calculateTotal, calculateTotalByCategory, items, clearAllItems } =
    useGroceryContext();
  const [showChart, setShowChart] = useState(false);

  const totalAmount = calculateTotal();
  const categoryTotals = calculateTotalByCategory();

  // Prepare chart data
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals).map((amount) => parseFloat(amount)),
        backgroundColor: Object.keys(categoryTotals).map(category => 
          categoryColors[category] || fallbackColors[Object.keys(categoryTotals).indexOf(category) % fallbackColors.length]
        ),
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 15,
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Function to export as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Grocery Expense Summary", 15, 15);

    // Add date
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 25);

    // Add total
    doc.text(`Total Expenses: $${totalAmount}`, 15, 35);

    // Add category breakdown
    doc.text("Expense Breakdown by Category:", 15, 45);

    const tableColumn = ["Category", "Amount ($)", "Percentage"];
    const tableRows = [];

    Object.entries(categoryTotals).forEach(([category, amount]) => {
      const percentage = (
        (parseFloat(amount) / parseFloat(totalAmount)) *
        100
      ).toFixed(1);
      tableRows.push([category, amount, `${percentage}%`]);
    });

    // Add breakdown table
    doc.autoTable({
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [66, 135, 245] },
    });

    // Add items table
    const itemsTableColumn = [
      "Item",
      "Category",
      "Quantity",
      "Unit Price ($)",
      "Total ($)",
    ];
    const itemsTableRows = items.map((item) => [
      item.name,
      item.category,
      item.quantity,
      parseFloat(item.price).toFixed(2),
      item.totalPrice.toFixed(2),
    ]);

    // Add items table title
    const finalY = (doc.lastAutoTable?.finalY || 50) + 10;
    doc.text("Grocery Items", 15, finalY);

    doc.autoTable({
      startY: finalY + 5,
      head: [itemsTableColumn],
      body: itemsTableRows,
      theme: "striped",
      headStyles: { fillColor: [66, 135, 245] },
    });

    // Save the PDF
    doc.save("grocery_expenses.pdf");
  };

  // Function to confirm and clear all items
  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all items? This action cannot be undone.",
      )
    ) {
      clearAllItems();
    }
  };

  return (
    <Card className="shadow" style={{ borderTop: '4px solid var(--color-yellow)' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>Summary</Card.Title>
          <ButtonGroup>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowChart(!showChart)}
              title="Toggle Chart View"
            >
              <FaChartPie />
            </Button>

            <Button
              variant="outline-success"
              size="sm"
              onClick={exportAsPDF}
              title="Export as PDF"
              disabled={items.length === 0}
            >
              <FaFileDownload />
            </Button>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClearAll}
              title="Clear All Items"
              disabled={items.length === 0}
            >
              <FaTrash />
            </Button>
          </ButtonGroup>
        </div>

        <Alert variant="primary" className="mb-4">
          <div className="fw-bold">Total: ${totalAmount}</div>
          <div className="small">
            {items.length} item{items.length !== 1 ? "s" : ""} in your grocery
            list
          </div>
        </Alert>

        {showChart && Object.keys(categoryTotals).length > 0 ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <h5 className="mb-3">Expense Breakdown</h5>
            <div style={{ height: "250px" }}>
              <Pie data={chartData} options={chartOptions} />
            </div>
          </motion.div>
        ) : null}

        <div>
          <h5 className="mb-3">Category Breakdown</h5>

          {Object.keys(categoryTotals).length === 0 ? (
            <div className="text-muted">
              Add items to see category breakdown
            </div>
          ) : (
            <ListGroup variant="flush">
              {Object.entries(categoryTotals).map(
                ([category, amount], index) => (
                  <ListGroup.Item
                    key={category}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle me-2"
                        style={{
                          backgroundColor: categoryColors[category] || 
                            fallbackColors[index % fallbackColors.length],
                          width: "10px",
                          height: "10px",
                        }}
                      />
                      <span>{category}</span>
                    </div>
                    <span className="fw-bold">${amount}</span>
                  </ListGroup.Item>
                ),
              )}
            </ListGroup>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default GrocerySummary;
