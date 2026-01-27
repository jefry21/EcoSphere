import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const IvaControls = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-vh-100 d-flex flex-column" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <AppNavbar />
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <i className="bi bi-journal-check text-warning me-3" style={{ fontSize: '2rem' }}></i>
          <h2 className="fw-bold text-primary mb-0">Controles de IVA</h2>
        </div>

        {/* Panel de módulos */}
        <div className="row g-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <p className="text-muted mb-4">Aquí podrás agregar los componentes necesarios para gestionar el IVA (libros de compras/ventas, declaraciones, reportes, etc.).</p>

                {/* Placeholder de secciones */}
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h5 className="fw-semibold">Libros de Compras</h5>
                      <p className="text-muted">Agregar tabla/formulario para registro de compras.</p>
                      <button className="btn btn-primary btn-sm">Agregar componente</button>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h5 className="fw-semibold">Libros de Ventas</h5>
                      <p className="text-muted">Agregar tabla/formulario para registro de ventas.</p>
                      <button className="btn btn-primary btn-sm">Agregar componente</button>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="border rounded p-3">
                      <h5 className="fw-semibold">Declaraciones y Reportes</h5>
                      <p className="text-muted">Lugar para gráficas, totales y generación de reportes.</p>
                      <button className="btn btn-secondary btn-sm">Configurar</button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-end">
                  <button className="btn btn-outline-primary" onClick={() => navigate('/main')}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver al dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-primary text-white text-center py-3 mt-auto">
        <div className="container">
          <p className="mb-0">&copy; 2026 EcoSphere. Módulo de Controles de IVA.</p>
        </div>
      </footer>
    </div>
  );
};

export default IvaControls;
