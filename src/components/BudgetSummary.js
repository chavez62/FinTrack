import { useState } from "react";
import { useBudgetContext } from "../hooks/useBudgetContext";
import { motion } from "framer-motion";
import { FaChartPie, FaChartBar, FaFileDownload, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import {
  Card,
  Button,
  ButtonGroup,
  Alert,
  ListGroup,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define chart background colors for categories
const categoryColors = {
  'Housing': 'rgba(10, 61, 98, 0.8)',        // Dark Blue
  'Transportation': 'rgba(220, 53, 69, 0.8)', // Red
  'Food': 'rgba(40, 167, 69, 0.8)',          // Green
  'Utilities': 'rgba(32, 201, 151, 0.8)',    // Teal
  'Insurance': 'rgba(111, 66, 193, 0.8)',    // Purple
  'Healthcare': 'rgba(232, 62, 140, 0.8)',   // Pink
  'Entertainment': 'rgba(253, 126, 20, 0.8)', // Orange
  'Personal Care': 'rgba(102, 16, 242, 0.8)', // Indigo
  'Education': 'rgba(52, 152, 219, 0.8)',    // Light Blue
  'Savings': 'rgba(40, 167, 69, 0.7)',       // Light Green
  'Debt Payments': 'rgba(220, 53, 69, 0.7)', // Light Red
  'Income': 'rgba(46, 204, 113, 0.8)',       // Bright Green
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

const BudgetSummary = () => {
  const { 
    calculateIncome, 
    calculateExpenses, 
    calculateBalance, 
    calculateTotalByCategory, 
    transactions, 
    clearAllTransactions 
  } = useBudgetContext();
  
  const [showChart, setShowChart] = useState(false);

  const income = calculateIncome();
  const expenses = calculateExpenses();
  const balance = calculateBalance();
  const categoryTotals = calculateTotalByCategory();

  // Prepare chart data for expenses by category (exclude Income)
  const expenseChartData = {
    labels: Object.keys(categoryTotals).filter(cat => cat !== 'Income'),
    datasets: [
      {
        data: Object.entries(categoryTotals)
          .filter(([cat]) => cat !== 'Income')
          .map(([_, amount]) => parseFloat(amount)),
        backgroundColor: Object.keys(categoryTotals)
          .filter(cat => cat !== 'Income')
          .map(category => 
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

  // Calculate balance status class
  const getBalanceStatusClass = () => {
    const balanceNum = parseFloat(balance);
    if (balanceNum > 0) return "success";
    if (balanceNum < 0) return "danger";
    return "warning";
  };

  // Function to export as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Budget Summary Report", 15, 15);

    // Add date
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 25);

    // Add financial summary
    doc.text("Financial Summary:", 15, 35);
    doc.text(`Income: $${income}`, 20, 45);
    doc.text(`Expenses: $${expenses}`, 20, 55);
    doc.text(`Balance: $${balance}`, 20, 65);

    // Add category breakdown
    doc.text("Expense Breakdown by Category:", 15, 80);

    const tableColumn = ["Category", "Amount ($)", "Percentage"];
    const tableRows = [];

    // Filter out income from category totals for percentage calculation
    const expenseTotals = Object.entries(categoryTotals)
      .filter(([category]) => category !== 'Income');
    
    const totalExpenses = parseFloat(expenses);

    expenseTotals.forEach(([category, amount]) => {
      const percentage = (
        (parseFloat(amount) / totalExpenses) *
        100
      ).toFixed(1);
      tableRows.push([category, amount, `${percentage}%`]);
    });

    // Add breakdown table
    doc.autoTable({
      startY: 85,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [66, 135, 245] },
    });

    // Add transactions table
    const transactionsTableColumn = [
      "Date",
      "Description",
      "Category",
      "Type",
      "Amount ($)",
    ];
    
    const transactionsTableRows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.name,
      t.category,
      t.type === 'income' ? 'Income' : 'Expense',
      parseFloat(t.amount).toFixed(2),
    ]);

    // Add transactions table title
    const finalY = (doc.lastAutoTable?.finalY || 85) + 10;
    doc.text("Transactions", 15, finalY);

    doc.autoTable({
      startY: finalY + 5,
      head: [transactionsTableColumn],
      body: transactionsTableRows,
      theme: "striped",
      headStyles: { fillColor: [66, 135, 245] },
    });

    // Save the PDF
    doc.save("budget_report.pdf");
  };

  // Function to confirm and clear all transactions
  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all transactions? This action cannot be undone.",
      )
    ) {
      clearAllTransactions();
    }
  };

  return (
    <Card className="shadow" style={{ borderTop: '4px solid var(--color-secondary)' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="d-flex align-items-center m-0">
            <span className="rounded-circle me-2 p-2 bg-secondary bg-opacity-10">
              <FaChartPie size={16} className="text-secondary" />
            </span>
            Budget Overview
          </h5>
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
              disabled={transactions.length === 0}
            >
              <FaFileDownload />
            </Button>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClearAll}
              title="Clear All Transactions"
              disabled={transactions.length === 0}
            >
              <FaTrash />
            </Button>
          </ButtonGroup>
        </div>

        {/* Summary Cards */}
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-3 mb-3">
            {/* Income Card */}
            <div className="summary-card income flex-grow-1">
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center rounded-circle bg-white p-2 me-3" style={{ width: '42px', height: '42px' }}>
                  <FaArrowUp className="text-success" size={18} />
                </div>
                <div>
                  <div className="opacity-75">Total Income</div>
                  <div className="h4 mb-0 fw-bold">${income}</div>
                </div>
              </div>
            </div>
            
            {/* Expenses Card */}
            <div className="summary-card expense flex-grow-1">
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center rounded-circle bg-white p-2 me-3" style={{ width: '42px', height: '42px' }}>
                  <FaArrowDown className="text-danger" size={18} />
                </div>
                <div>
                  <div className="opacity-75">Total Expenses</div>
                  <div className="h4 mb-0 fw-bold">${expenses}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Balance Card */}
          <div className="summary-card balance mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="opacity-75">Current Balance</div>
                <div className="h3 mb-0 fw-bold">${balance}</div>
                <div className="small mt-1 opacity-75">
                  {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} recorded
                </div>
              </div>
              <div className="display-4 opacity-50">
                {parseFloat(balance) >= 0 ? "+" : ""}
              </div>
            </div>
          </div>
          
          {/* Progress Bar for Budget Health */}
          {parseFloat(income) > 0 && (
            <div className="mt-2">
              <small className="text-muted d-block mb-1">
                Budget Utilization ({Math.min(100, Math.round((parseFloat(expenses) / parseFloat(income)) * 100))}%)
              </small>
              <ProgressBar 
                variant={parseFloat(expenses) > parseFloat(income) ? "danger" : "success"}
                now={Math.min(100, Math.round((parseFloat(expenses) / parseFloat(income)) * 100))} 
              />
            </div>
          )}
        </div>

        {showChart && Object.keys(expenseChartData.labels).length > 0 ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-light rounded-3"
          >
            <h6 className="mb-3 text-secondary d-flex align-items-center">
              <FaChartPie size={14} className="me-2" />
              Expense Breakdown
            </h6>
            <div style={{ height: "250px" }}>
              <Pie data={expenseChartData} options={chartOptions} />
            </div>
          </motion.div>
        ) : null}

        <div>
          <h6 className="mb-3 text-secondary d-flex align-items-center">
            <FaChartBar size={14} className="me-2" />
            Category Breakdown
          </h6>

          {Object.keys(categoryTotals).length === 0 ? (
            <div className="text-muted">
              Add transactions to see category breakdown
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

export default BudgetSummary;