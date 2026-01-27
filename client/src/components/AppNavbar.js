import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfile = () => {
    alert('Funcionalidad de Perfil próximamente disponible');
  };

  const handleSettings = () => {
    alert('Funcionalidad de Configuraciones próximamente disponible');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow">
      <div className="container">
        <Navbar.Brand href="#">
          <i className="bi bi-graph-up-arrow text-warning me-2" style={{ fontSize: '1.5rem' }}></i>
          EcoSphere
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#dashboard">Dashboard</Nav.Link>
            <Nav.Link href="#profile">Profile</Nav.Link>
            <Nav.Link href="#settings">Settings</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              title={
                <>
                  <i className="bi bi-person-circle me-1"></i>
                  Usuario
                </>
              }
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item onClick={handleProfile}>
                <i className="bi bi-person me-2"></i>Perfil
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleSettings}>
                <i className="bi bi-gear me-2"></i>Configuraciones
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default AppNavbar;
