import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const VentasControls = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    periodo: '',
    fecha: '',
    numeroSerie: '',
    numeroMovimiento: '',
    nit: '',
    nombre: '',
    tipo: '',
    precioTotal: '',
    moneda: 'GTQ',
    tasaCambio: '7.80',
    numeroConstancia: ''
  });

  const [calculos, setCalculos] = useState({
    totalSinImpuesto: 0,
    ivaPercentaje: 0,
    impuesto: 0
  });

  // Estado para Clientes
  const [clientesList, setClientesList] = useState([]);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showListaClientesModal, setShowListaClientesModal] = useState(false);
  const [showEditClienteModal, setShowEditClienteModal] = useState(false);
  const [clienteFormData, setClienteFormData] = useState({
    nit: '',
    nombre: '',
    email: '',
    telefono: ''
  });
  const [clienteEditando, setClienteEditando] = useState(null);

  // Estado para Documentos de Ventas
  const [documentosVentaList, setDocumentosVentaList] = useState([]);
  const [showListaDocumentosVentasModal, setShowListaDocumentosVentasModal] = useState(false);
  const [showEditDocumentoVentaModal, setShowEditDocumentoVentaModal] = useState(false);
  const [documentoVentaEditando, setDocumentoVentaEditando] = useState(null);
  const [busquedaDocumentoVenta, setBusquedaDocumentoVenta] = useState('');

  const meses = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  const getTasaCambio = () => {
    return parseFloat(formData.tasaCambio) || 7.80;
  };

  const getSimboloMoneda = () => {
    return formData.moneda === 'GTQ' ? 'Q' : '$';
  };

  // Función de cálculo para VENTAS
  const calculateIVAVentas = (currentForm) => {
    const precioTotal = parseFloat(currentForm.precioTotal) || 0;

    if (precioTotal <= 0) {
      setCalculos({
        totalSinImpuesto: 0,
        ivaPercentaje: 0,
        impuesto: 0
      });
      return;
    }

    if (currentForm.tipo === 'BIEN' || currentForm.tipo === 'SERVICIO') {
      // Cálculo para BIEN y SERVICIO (12% IVA)
      // Fórmula exacta: precioTotal = subtotal * 1.12
      // Por lo tanto: subtotal = precioTotal / 1.12
      const subtotal = Math.round((precioTotal / 1.12) * 100) / 100;
      const impuesto = Math.round((precioTotal - subtotal) * 100) / 100;

      setCalculos({
        totalSinImpuesto: subtotal.toFixed(2),
        ivaPercentaje: 12,
        impuesto: impuesto.toFixed(2)
      });
    } else if (currentForm.tipo === 'EXCENTO') {
      // EXCENTO: Sin IVA (0%)
      setCalculos({
        totalSinImpuesto: precioTotal.toFixed(2),
        ivaPercentaje: 0,
        impuesto: '0.00'
      });
    } else if (currentForm.tipo === 'RETEN') {
      // RETEN: Sin IVA, pero con retención implícita
      setCalculos({
        totalSinImpuesto: precioTotal.toFixed(2),
        ivaPercentaje: 0,
        impuesto: '0.00'
      });
    } else if (currentForm.tipo === 'EXPORTACIÓN') {
      // EXPORTACIÓN: Sin IVA (0%)
      setCalculos({
        totalSinImpuesto: precioTotal.toFixed(2),
        ivaPercentaje: 0,
        impuesto: '0.00'
      });
    } else {
      // Resetear cálculos si no hay tipo válido
      setCalculos({
        totalSinImpuesto: 0,
        ivaPercentaje: 0,
        impuesto: 0
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    
    // Si cambia el tipo de documento, limpiar numeroConstancia si no es EXCENTO o RETEN
    if (name === 'tipo' && value !== 'EXCENTO' && value !== 'RETEN') {
      newFormData.numeroConstancia = '';
    }
    
    setFormData(newFormData);

    // Si escribe un NIT, buscar el nombre automáticamente
    if (name === 'nit' && value) {
      const clienteEncontrado = clientesList.find(item => item.nit === value);
      if (clienteEncontrado) {
        setFormData(prev => ({ ...prev, nombre: clienteEncontrado.nombre }));
      }
    }

    // Calcular IVA cuando cambie precio, tipo o ambos
    if ((name === 'precioTotal' && newFormData.tipo) || (name === 'tipo' && newFormData.precioTotal && parseFloat(newFormData.precioTotal) > 0)) {
      calculateIVAVentas(newFormData);
    }
  };

  // Funciones para manejar Clientes
  const handleNitInputChangeCliente = (e) => {
    const { name, value } = e.target;
    setClienteFormData({ ...clienteFormData, [name]: value });
  };

  const handleCerrarClienteModal = () => {
    setShowClienteModal(false);
    setClienteFormData({ nit: '', nombre: '', email: '', telefono: '' });
  };

  const handleAgregarCliente = () => {
    if (!clienteFormData.nit || !clienteFormData.nombre) {
      alert('Por favor complete al menos NIT y Nombre');
      return;
    }

    const nuevoCliente = {
      id: Date.now(),
      ...clienteFormData,
      estado: 'ACTIVO'
    };

    setClientesList([...clientesList, nuevoCliente]);
    alert('Cliente agregado exitosamente');
    handleCerrarClienteModal();
  };

  const handleToggleEstadoCliente = (id) => {
    setClientesList(clientesList.map(cliente => 
      cliente.id === id 
        ? { ...cliente, estado: cliente.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }
        : cliente
    ));
  };

  const handleAbrirEditCliente = (cliente) => {
    setClienteEditando({ ...cliente });
    setShowEditClienteModal(true);
  };

  const handleGuardarEditCliente = () => {
    if (clienteEditando.nit && clienteEditando.nombre) {
      setClientesList(clientesList.map(item => 
        item.id === clienteEditando.id ? clienteEditando : item
      ));
      setShowEditClienteModal(false);
      setClienteEditando(null);
      alert('Cliente actualizado exitosamente');
    } else {
      alert('Por favor complete NIT y Nombre');
    }
  };

  const handleCancelarEditCliente = () => {
    setShowEditClienteModal(false);
    setClienteEditando(null);
  };

  // Funciones para manejar Documentos de Ventas
  const handleGuardarDocumentoVenta = () => {
    // Validar campos requeridos
    if (!formData.periodo || !formData.fecha || !formData.nit || !formData.nombre || !formData.tipo || !formData.precioTotal) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    // Validar número de constancia si es EXCENTO o RETEN
    if ((formData.tipo === 'EXCENTO' || formData.tipo === 'RETEN') && !formData.numeroConstancia) {
      alert(`Por favor ingrese el número de constancia para ${formData.tipo}`);
      return;
    }

    const nuevoDocumentoVenta = {
      id: Date.now(),
      ...formData,
      calculos: calculos,
      fechaGuardado: new Date().toLocaleString('es-GT'),
      tipoDocumento: 'VENTA'
    };

    setDocumentosVentaList([...documentosVentaList, nuevoDocumentoVenta]);
    alert('Venta guardada exitosamente');
    
    // Limpiar formulario
    setFormData({
      periodo: '',
      fecha: '',
      numeroSerie: '',
      numeroMovimiento: '',
      nit: '',
      nombre: '',
      tipo: '',
      precioTotal: '',
      moneda: 'GTQ',
      tasaCambio: '7.80',
      numeroConstancia: ''
    });
    
    // Resetear cálculos
    setCalculos({
      totalSinImpuesto: 0,
      ivaPercentaje: 0,
      impuesto: 0
    });
  };

  const handleAbrirEditDocumentoVenta = (doc) => {
    setDocumentoVentaEditando({ ...doc });
    setShowEditDocumentoVentaModal(true);
  };

  const handleGuardarEditDocumentoVenta = () => {
    if (documentoVentaEditando.periodo && documentoVentaEditando.fecha && documentoVentaEditando.nit && documentoVentaEditando.nombre) {
      setDocumentosVentaList(documentosVentaList.map(item =>
        item.id === documentoVentaEditando.id ? documentoVentaEditando : item
      ));
      setShowEditDocumentoVentaModal(false);
      setDocumentoVentaEditando(null);
      alert('Venta actualizada exitosamente');
    } else {
      alert('Por favor complete los campos requeridos');
    }
  };

  const handleEliminarDocumentoVenta = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta venta?')) {
      setDocumentosVentaList(documentosVentaList.filter(doc => doc.id !== id));
      alert('Venta eliminada exitosamente');
    }
  };

  const documentosVentaFiltrados = documentosVentaList.filter(doc =>
    doc.nit.toLowerCase().includes(busquedaDocumentoVenta.toLowerCase()) ||
    doc.nombre.toLowerCase().includes(busquedaDocumentoVenta.toLowerCase()) ||
    doc.numeroSerie.toLowerCase().includes(busquedaDocumentoVenta.toLowerCase())
  );

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f0f2f5' }}>
      <AppNavbar />
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="fw-bold text-primary mb-0">
                <i className="bi bi-cart-check me-2"></i>Control de Ventas
              </h3>
              <button className="btn btn-outline-secondary" onClick={() => navigate('/main')}>
                <i className="bi bi-arrow-left me-2"></i>Volver al Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-4 text-primary">
                  <i className="bi bi-shop me-2"></i>Gestión de Ventas
                </h5>

                {/* Secciones de Clientes y Documentos */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h5 className="fw-semibold">
                        <i className="bi bi-people-fill me-2" style={{ color: '#0d6efd', fontSize: '1.2rem' }}></i>Clientes
                      </h5>
                      <p className="text-muted">Gestiona los clientes y registra ventas.</p>
                      <div className="d-flex gap-2 flex-wrap">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => setShowClienteModal(true)}
                        >
                          <i className="bi bi-plus-circle me-1"></i>Agregar Cliente
                        </button>
                        <button 
                          className="btn btn-info btn-sm"
                          onClick={() => setShowListaClientesModal(true)}
                          disabled={clientesList.length === 0}
                        >
                          <i className="bi bi-eye me-1"></i>Ver Clientes ({clientesList.length})
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h5 className="fw-semibold">
                        <i className="bi bi-file-earmark-check me-2" style={{ color: '#0d6efd', fontSize: '1.2rem' }}></i>Documentos de Venta
                      </h5>
                      <p className="text-muted">Guarda, edita y gestiona tus facturas de venta.</p>
                      <div className="d-flex gap-2 flex-wrap">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={handleGuardarDocumentoVenta}
                        >
                          <i className="bi bi-save me-1"></i>Guardar Venta
                        </button>
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => setShowListaDocumentosVentasModal(true)}
                          disabled={documentosVentaList.length === 0}
                        >
                          <i className="bi bi-folder-open me-1"></i>Ver Ventas ({documentosVentaList.length})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />
                <h6 className="fw-bold text-secondary mb-3">
                  <i className="bi bi-pencil-square me-2"></i>Ingrese los Datos de la Venta
                </h6>

                {/* Formulario de Ventas */}
                <div className="row g-3">
                  {/* Período */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="periodo" className="form-label fw-semibold">
                      Período
                    </label>
                    <select
                      id="periodo"
                      name="periodo"
                      className="form-select"
                      value={formData.periodo}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione el mes</option>
                      {meses.map((mes) => (
                        <option key={mes.value} value={mes.value}>
                          {mes.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fecha */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="fecha" className="form-label fw-semibold">
                      Fecha
                    </label>
                    <input
                      type="date"
                      id="fecha"
                      name="fecha"
                      className="form-control"
                      value={formData.fecha}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Número de Serie */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="numeroSerie" className="form-label fw-semibold">
                      Número de Serie
                    </label>
                    <input
                      type="text"
                      id="numeroSerie"
                      name="numeroSerie"
                      className="form-control"
                      placeholder="Ej: A001"
                      value={formData.numeroSerie}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Número de Movimiento */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="numeroMovimiento" className="form-label fw-semibold">
                      Número de Movimiento
                    </label>
                    <input
                      type="text"
                      id="numeroMovimiento"
                      name="numeroMovimiento"
                      className="form-control"
                      placeholder="Ej: 0000001"
                      value={formData.numeroMovimiento}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* NIT del Cliente */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="nit" className="form-label fw-semibold">
                      NIT del Cliente
                    </label>
                    <input
                      type="text"
                      id="nit"
                      name="nit"
                      className="form-control"
                      placeholder="Ej: 1234567-8"
                      value={formData.nit}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Nombre del Cliente */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="nombre" className="form-label fw-semibold">
                      Nombre del Cliente
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="form-control"
                      placeholder="Ingrese el nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Tipo */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="tipo" className="form-label fw-semibold">
                      Tipo de Documento
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      className="form-select"
                      value={formData.tipo}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione un tipo</option>
                      <option value="BIEN">BIEN</option>
                      <option value="SERVICIO">SERVICIO</option>
                      <option value="EXCENTO">EXCENTO</option>
                      <option value="RETEN">RETEN</option>
                      <option value="EXPORTACIÓN">EXPORTACIÓN</option>
                    </select>
                  </div>

                  {/* N° Constancia - Mostrar solo para EXCENTO y RETEN */}
                  {(formData.tipo === 'EXCENTO' || formData.tipo === 'RETEN') && (
                    <div className="col-12 col-md-6">
                      <label htmlFor="numeroConstancia" className="form-label fw-semibold">
                        N° Constancia de {formData.tipo}
                      </label>
                      <input
                        type="text"
                        id="numeroConstancia"
                        name="numeroConstancia"
                        className="form-control"
                        placeholder={`Ingrese el N° de constancia ${formData.tipo}`}
                        value={formData.numeroConstancia}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}

                  {/* Tasa de Cambio */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="tasaCambio" className="form-label fw-semibold">
                      Tasa de Cambio (1 USD = ? GTQ)
                    </label>
                    <input
                      type="number"
                      id="tasaCambio"
                      name="tasaCambio"
                      className="form-control"
                      placeholder="Ej: 7.80"
                      value={formData.tasaCambio}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0.01"
                    />
                  </div>

                  {/* Moneda */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="moneda" className="form-label fw-semibold">
                      Moneda
                    </label>
                    <select
                      id="moneda"
                      name="moneda"
                      className="form-select"
                      value={formData.moneda}
                      onChange={handleInputChange}
                    >
                      <option value="GTQ">Quetzal (Q)</option>
                      <option value="USD">Dólar (USD)</option>
                    </select>
                  </div>

                  {/* Total de Documento */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="precioTotal" className="form-label fw-semibold">
                      Total de Documento
                    </label>
                    <input
                      type="number"
                      id="precioTotal"
                      name="precioTotal"
                      className="form-control"
                      placeholder={`Ingrese el total (${getSimboloMoneda()})`}
                      value={formData.precioTotal}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                    />
                  </div>

                  {/* Sección de Detalles */}
                  {formData.tipo && formData.precioTotal && (
                    <>
                      <div className="col-12">
                        <hr className="my-2" />
                        <h6 className="fw-bold text-primary mb-3">
                          <i className="bi bi-calculator me-2"></i>Detalles de Cálculo
                        </h6>
                      </div>

                      <div className="col-12 col-md-4">
                        <div className="card bg-light">
                          <div className="card-body p-3">
                            <small className="text-muted">Total Sin Impuesto</small>
                            <h5 className="mb-0 text-dark">{getSimboloMoneda()} {parseFloat(calculos.totalSinImpuesto).toFixed(2)}</h5>
                            {formData.moneda === 'USD' && <small className="text-muted d-block mt-1">Q {(parseFloat(calculos.totalSinImpuesto) * getTasaCambio()).toFixed(2)}</small>}
                            {formData.moneda === 'GTQ' && <small className="text-muted d-block mt-1">$ {(parseFloat(calculos.totalSinImpuesto) / getTasaCambio()).toFixed(2)}</small>}
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <div className="card bg-light">
                          <div className="card-body p-3">
                            <small className="text-muted">IVA %</small>
                            <h5 className="mb-0 text-dark">{calculos.ivaPercentaje}</h5>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <div className="card bg-light">
                          <div className="card-body p-3">
                            <small className="text-muted">Impuesto (IVA)</small>
                            <h5 className="mb-0 text-dark">{getSimboloMoneda()} {parseFloat(calculos.impuesto || 0).toFixed(2)}</h5>
                            {formData.moneda === 'USD' && <small className="text-muted d-block mt-1">Q {(parseFloat(calculos.impuesto || 0) * getTasaCambio()).toFixed(2)}</small>}
                            {formData.moneda === 'GTQ' && <small className="text-muted d-block mt-1">$ {(parseFloat(calculos.impuesto || 0) / getTasaCambio()).toFixed(2)}</small>}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Agregar Clientes */}
      {showClienteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="bi bi-person-plus me-2"></i>
                  Agregar Cliente
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCerrarClienteModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="nit" className="form-label fw-semibold">
                    NIT *
                  </label>
                  <input
                    type="text"
                    id="nit"
                    name="nit"
                    className="form-control"
                    placeholder="Ej: 1234567-8"
                    value={clienteFormData.nit}
                    onChange={handleNitInputChangeCliente}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label fw-semibold">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    placeholder="Ingrese el nombre"
                    value={clienteFormData.nombre}
                    onChange={handleNitInputChangeCliente}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email (Opcional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="cliente@example.com"
                    value={clienteFormData.email}
                    onChange={handleNitInputChangeCliente}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label fw-semibold">
                    Teléfono (Opcional)
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    className="form-control"
                    placeholder="Ej: 2222-2222"
                    value={clienteFormData.telefono}
                    onChange={handleNitInputChangeCliente}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCerrarClienteModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-success" onClick={handleAgregarCliente}>
                  <i className="bi bi-check-circle me-1"></i>Agregar Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Ver Lista de Clientes */}
      {showListaClientesModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">
                  <i className="bi bi-list-check me-2"></i>
                  Lista de Clientes ({clientesList.length})
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowListaClientesModal(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {clientesList.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th>NIT</th>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientesList.map((cliente) => (
                          <tr key={cliente.id}>
                            <td>{cliente.nit}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.email || '-'}</td>
                            <td>{cliente.telefono || '-'}</td>
                            <td>
                              <span className={`badge ${cliente.estado === 'ACTIVO' ? 'bg-success' : 'bg-secondary'}`}>
                                {cliente.estado}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-primary me-1"
                                onClick={() => handleAbrirEditCliente(cliente)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-warning"
                                onClick={() => handleToggleEstadoCliente(cliente.id)}
                              >
                                <i className="bi bi-arrow-repeat"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center">No hay clientes registrados</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowListaClientesModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Cliente */}
      {showEditClienteModal && clienteEditando && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Cliente
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCancelarEditCliente}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">NIT</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={clienteEditando.nit}
                    onChange={(e) => setClienteEditando({...clienteEditando, nit: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={clienteEditando.nombre}
                    onChange={(e) => setClienteEditando({...clienteEditando, nombre: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={clienteEditando.email}
                    onChange={(e) => setClienteEditando({...clienteEditando, email: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Teléfono</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    value={clienteEditando.telefono}
                    onChange={(e) => setClienteEditando({...clienteEditando, telefono: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Estado</label>
                  <select 
                    className="form-select"
                    value={clienteEditando.estado}
                    onChange={(e) => setClienteEditando({...clienteEditando, estado: e.target.value})}
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelarEditCliente}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleGuardarEditCliente}>
                  <i className="bi bi-check-circle me-1"></i>Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Ver Lista de Documentos de Ventas */}
      {showListaDocumentosVentasModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  <i className="bi bi-folder-open me-2"></i>
                  Documentos de Venta Guardados ({documentosVentaList.length})
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowListaDocumentosVentasModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Buscar por NIT, Nombre o N° Serie..."
                    value={busquedaDocumentoVenta}
                    onChange={(e) => setBusquedaDocumentoVenta(e.target.value)}
                  />
                </div>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {documentosVentaFiltrados.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover align-middle">
                        <thead className="table-light sticky-top">
                          <tr>
                            <th>Período</th>
                            <th>Fecha</th>
                            <th>N° Serie</th>
                            <th>N° Mov</th>
                            <th>NIT</th>
                            <th>Cliente</th>
                            <th>Tipo</th>
                            <th>Total</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documentosVentaFiltrados.map((doc) => (
                            <tr key={doc.id}>
                              <td>{doc.periodo}</td>
                              <td>{doc.fecha}</td>
                              <td>{doc.numeroSerie}</td>
                              <td>{doc.numeroMovimiento}</td>
                              <td>{doc.nit}</td>
                              <td>{doc.nombre}</td>
                              <td><span className="badge bg-info">{doc.tipo}</span></td>
                              <td>{doc.moneda === 'GTQ' ? 'Q' : '$'} {parseFloat(doc.precioTotal).toFixed(2)}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-primary me-1"
                                  onClick={() => handleAbrirEditDocumentoVenta(doc)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleEliminarDocumentoVenta(doc.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted text-center">No hay documentos guardados</p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowListaDocumentosVentasModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Documento de Venta */}
      {showEditDocumentoVentaModal && documentoVentaEditando && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Venta
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditDocumentoVentaModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Período</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={documentoVentaEditando.periodo}
                      onChange={(e) => setDocumentoVentaEditando({...documentoVentaEditando, periodo: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Fecha</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={documentoVentaEditando.fecha}
                      onChange={(e) => setDocumentoVentaEditando({...documentoVentaEditando, fecha: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">NIT Cliente</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={documentoVentaEditando.nit}
                      onChange={(e) => setDocumentoVentaEditando({...documentoVentaEditando, nit: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Nombre Cliente</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={documentoVentaEditando.nombre}
                      onChange={(e) => setDocumentoVentaEditando({...documentoVentaEditando, nombre: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">N° Serie</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={documentoVentaEditando.numeroSerie}
                      onChange={(e) => setDocumentoVentaEditando({...documentoVentaEditando, numeroSerie: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">N° Movimiento</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={documentoVentaEditando.numeroMovimiento}
                      onChange={(e) => setDocumentoVentaEditando({...documentoVentaEditando, numeroMovimiento: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tipo</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={documentoVentaEditando.tipo}
                      onChange={(e) => setDocumentoVentaEditando({...documentoVentaEditando, tipo: e.target.value})}
                    />
                  </div>
                  {(documentoVentaEditando.tipo === 'EXCENTO' || documentoVentaEditando.tipo === 'RETEN') && (
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">N° Constancia</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={documentoVentaEditando.numeroConstancia || ''}
                        onChange={(e) => setDocumentoVentaEditando({...documentoVentaEditando, numeroConstancia: e.target.value})}
                        placeholder={`N° de constancia ${documentoVentaEditando.tipo}`}
                      />
                    </div>
                  )}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Total</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={documentoVentaEditando.precioTotal}
                      onChange={(e) => setDocumentoVentaEditando({...documentoVentaEditando, precioTotal: e.target.value})}
                      step="0.01"
                    />
                  </div>
                  <div className="col-12">
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      <small><strong>Guardado:</strong> {documentoVentaEditando.fechaGuardado}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditDocumentoVentaModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleGuardarEditDocumentoVenta}>
                  <i className="bi bi-check-circle me-1"></i>Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-primary text-white text-center py-3 mt-auto">
        <p className="mb-0">&copy; 2026 EcoSphere - Sistema de Control de Ventas</p>
      </footer>
    </div>
  );
};

export default VentasControls;
