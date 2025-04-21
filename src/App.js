import { useState } from 'react';
import './App.css';
import BudgetProvider from './context/BudgetContext';
import Header from './components/Header';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetSummary from './components/BudgetSummary';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';

function App() {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'add', 'summary'

  return (
    <BudgetProvider>
      <div className="min-vh-100" style={{ background: '#f7f9fc' }}>
        <Header />
        
        <Container className="py-4">
          {/* Mobile Navigation Tabs */}
          <div className="d-md-none mb-4">
            <Tab.Container id="mobile-tabs" activeKey={activeTab} onSelect={setActiveTab}>
              <Nav variant="pills" className="bg-white rounded shadow" fill>
                <Nav.Item>
                  <Nav.Link eventKey="list">Transactions</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="add">Add New</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="summary">Summary</Nav.Link>
                </Nav.Item>
              </Nav>
              
              <Tab.Content className="mt-3">
                <Tab.Pane eventKey="list">
                  <TransactionList />
                </Tab.Pane>
                <Tab.Pane eventKey="add">
                  <TransactionForm />
                </Tab.Pane>
                <Tab.Pane eventKey="summary">
                  <BudgetSummary />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
          
          {/* Desktop View - Grid Layout */}
          <div className="d-none d-md-block">
            <Row>
              <Col md={4} lg={3}>
                <TransactionForm />
                <div className="mt-4">
                  <BudgetSummary />
                </div>
              </Col>
              <Col md={8} lg={9}>
                <TransactionList />
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </BudgetProvider>
  );
}

export default App;