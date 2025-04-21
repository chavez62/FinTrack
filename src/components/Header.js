import { FaWallet, FaChartBar } from "react-icons/fa";
import { Navbar, Container } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar 
      style={{ 
        background: 'var(--gradient-header)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }} 
      variant="dark" 
      expand="lg" 
    >
      <Container>
        <Navbar.Brand className="d-flex align-items-center">
          <div className="me-3 d-flex align-items-center justify-content-center" 
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%'
            }}>
            <FaWallet size={22} className="text-white" />
          </div>
          <div>
            <span className="fw-bold">FinTrack</span>
            <span className="d-block small opacity-75">Personal Budget Tracker</span>
          </div>
        </Navbar.Brand>
        <div className="d-flex align-items-center text-white">
          <FaChartBar className="me-2" />
          <span className="d-none d-md-block">Take control of your finances</span>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;