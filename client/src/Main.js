import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import AppNavbar from './components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Main = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

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

  const handleAction = (action) => {
    alert(`Action ${action} clicked!`);
    // Here you can implement the specific functionality for each action
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Navigation Bar */}
      <AppNavbar />

      {/* Main Content */}
      <div className="container-fluid flex-grow-1 py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="display-4 fw-bold text-primary mb-0">Welcome to EcoSphere</h1>
                <p className="text-muted">Gestiona tu contabilidad empresarial de manera eficiente</p>
              </div>
              <div className="d-none d-md-block">
                <i className="bi bi-calculator text-success" style={{ fontSize: '4rem' }}></i>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="row g-4">
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card h-100 shadow-sm hover-card" onClick={() => navigate('/iva')} style={{ cursor: 'pointer' }}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-pencil-square text-info" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="card-title fw-bold">Controles de IVA</h5>
                <p className="card-text text-muted">Gestiona los controles de IVA y registros relacionados.</p>
                <button className="btn btn-info w-100" onClick={() => navigate('/iva')}>
                  <i className="bi bi-arrow-right-circle me-2"></i>
                  Abrir módulo
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card h-100 shadow-sm hover-card" onClick={() => navigate('/ventas')} style={{ cursor: 'pointer' }}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-cart-check text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="card-title fw-bold">Ventas</h5>
                <p className="card-text text-muted">Registra y administra las ventas con cálculos de IVA automáticos.</p>
                <button className="btn btn-success w-100" onClick={() => navigate('/ventas')}>
                  <i className="bi bi-arrow-right-circle me-2"></i>
                  Abrir módulo
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card h-100 shadow-sm hover-card" onClick={() => handleAction(2)} style={{ cursor: 'pointer' }}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-receipt text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="card-title fw-bold">Facturas</h5>
                <p className="card-text text-muted">Gestiona y administra todas tus facturas y documentos contables.</p>
                <button className="btn btn-primary w-100">
                  <i className="bi bi-arrow-right-circle me-2"></i>
                  Ver Facturas
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card h-100 shadow-sm hover-card" onClick={() => handleAction(3)} style={{ cursor: 'pointer' }}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-graph-up text-secondary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="card-title fw-bold">Reporte de Datos</h5>
                <p className="card-text text-muted">Genera reportes detallados y análisis de tu información financiera.</p>
                <button className="btn btn-secondary w-100">
                  <i className="bi bi-arrow-right-circle me-2"></i>
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card h-100 shadow-sm" style={{ opacity: 0.6, pointerEvents: 'none' }}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-clock-history text-muted" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="card-title fw-bold text-muted">Próximamente</h5>
                <p className="card-text text-muted">Nuevas funcionalidades estarán disponibles próximamente.</p>
                <button className="btn btn-outline-secondary w-100" disabled>
                  <i className="bi bi-lock me-2"></i>
                  En Desarrollo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-3 mt-auto">
        <div className="container">
          <p className="mb-0">&copy; 2026 EcoSphere. Simplificando tu contabilidad empresarial.</p>
        </div>
      </footer>

      <style jsx>{`
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default Main;