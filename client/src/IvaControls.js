import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const IvaControls = () => {
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
    tasaCambio: '7.80'
  });

  const [calculos, setCalculos] = useState({
    precioSinIVA: 0,
    totalSinImpuesto: 0,
    tasaIVA: 0,
    ivaPercentaje: 0,
    idp: 0
  });

  // Estado para NITs (Proveedores)
  const [nitsList, setNitsList] = useState([]);
  const [showNitModal, setShowNitModal] = useState(false);
  const [showListaNitModal, setShowListaNitModal] = useState(false);
  const [showEditNitModal, setShowEditNitModal] = useState(false);
  const [nitFormData, setNitFormData] = useState({
    nit: '',
    nombre: '',
    descripcion: ''
  });
  const [nitEditando, setNitEditando] = useState(null);

  // Estado para Documentos de Compras
  const [documentosList, setDocumentosList] = useState([]);
  const [showListaDocumentosModal, setShowListaDocumentosModal] = useState(false);
  const [showEditDocumentoModal, setShowEditDocumentoModal] = useState(false);
  const [documentoEditando, setDocumentoEditando] = useState(null);
  const [busquedaDocumento, setBusquedaDocumento] = useState('');

  // Estado para Combustible
  const [showCombustibleModal, setShowCombustibleModal] = useState(false);
  const [combustibleData, setCombustibleData] = useState({
    tipoCombustible: '',
    cantidadGalones: ''
  });
  const [combustibleGuardado, setCombustibleGuardado] = useState(null);

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

  // Función de cálculo para COMPRAS
  const calculateIVA = (currentForm, combustible) => {
    const precioTotal = parseFloat(currentForm.precioTotal) || 0;

    if (precioTotal <= 0) {
      setCalculos({
        precioSinIVA: 0,
        totalSinImpuesto: 0,
        tasaIVA: 0,
        ivaPercentaje: 0,
        idp: 0
      });
      return;
    }

    if (currentForm.tipo === 'COMBUSTIBLE' && combustible && combustible.tipoCombustible) {
      // Cálculo para COMBUSTIBLE con tasas específicas e IDP
      let tasaIVA = 0;
      let idp = 0;

      if (combustible.tipoCombustible === 'SUPER') {
        tasaIVA = 4.70;
        idp = parseFloat(combustible.cantidadGalones) * 4.70 || 0;
      } else if (combustible.tipoCombustible === 'REGULAR') {
        tasaIVA = 4.60;
        idp = parseFloat(combustible.cantidadGalones) * 4.60 || 0;
      } else if (combustible.tipoCombustible === 'DIESEL') {
        tasaIVA = 1.30;
        idp = parseFloat(combustible.cantidadGalones) * 1.30 || 0;
      }

      const precioSinIVA = Math.round((precioTotal / (1 + tasaIVA / 100)) * 100) / 100;
      const ivaCalculado = Math.round((precioTotal - precioSinIVA) * 100) / 100;

      setCalculos({
        precioSinIVA: precioSinIVA.toFixed(2),
        totalSinImpuesto: precioSinIVA.toFixed(2),
        tasaIVA: tasaIVA,
        ivaPercentaje: tasaIVA,
        idp: idp.toFixed(2)
      });
    } else if (currentForm.tipo === 'BIEN' || currentForm.tipo === 'SERVICIO') {
      // Cálculo para BIEN y SERVICIO (12% IVA)
      const precioSinIVA = Math.round((precioTotal / 1.12) * 100) / 100;
      const ivaCalculado = Math.round((precioTotal - precioSinIVA) * 100) / 100;

      setCalculos({
        precioSinIVA: precioSinIVA.toFixed(2),
        totalSinImpuesto: precioSinIVA.toFixed(2),
        tasaIVA: 12,
        ivaPercentaje: 12,
        idp: 0
      });
    } else if (currentForm.tipo === 'PEQUEÑO CONTRIBUYENTE') {
      // PEQUEÑO CONTRIBUYENTE: Sin IVA
      setCalculos({
        precioSinIVA: precioTotal.toFixed(2),
        totalSinImpuesto: precioTotal.toFixed(2),
        tasaIVA: 0,
        ivaPercentaje: 0,
        idp: 0
      });
    } else {
      // Resetear cálculos si no hay tipo válido
      setCalculos({
        precioSinIVA: 0,
        totalSinImpuesto: 0,
        tasaIVA: 0,
        ivaPercentaje: 0,
        idp: 0
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Si selecciona COMBUSTIBLE, abrir modal
    if (name === 'tipo' && value === 'COMBUSTIBLE') {
      setShowCombustibleModal(true);
      setCombustibleData({ tipoCombustible: '', cantidadGalones: '' });
    }

    // Si escribe un NIT, buscar el nombre automáticamente
    if (name === 'nit' && value) {
      const nitEncontrado = nitsList.find(item => item.nit === value);
      if (nitEncontrado) {
        setFormData(prev => ({ ...prev, nombre: nitEncontrado.nombre }));
      }
    }

    // Calcular IVA cuando cambie precio, tipo o ambos
    if ((name === 'precioTotal' && newFormData.tipo) || (name === 'tipo' && newFormData.precioTotal && parseFloat(newFormData.precioTotal) > 0)) {
      calculateIVA(newFormData, combustibleGuardado);
    }
  };

  const handleCombustibleChange = (e) => {
    const { name, value } = e.target;
    setCombustibleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardarCombustible = () => {
    if (combustibleData.tipoCombustible && combustibleData.cantidadGalones) {
      setCombustibleGuardado(combustibleData);
      setShowCombustibleModal(false);
      setTimeout(() => calculateIVA({ ...formData }, combustibleData), 0);
    } else {
      alert('Por favor complete todos los campos');
    }
  };

  const handleCerrarCombustibleModal = () => {
    setShowCombustibleModal(false);
    if (!combustibleGuardado) {
      setFormData(prev => ({ ...prev, tipo: '' }));
    }
  };

  // Funciones para NITs
  const handleNitInputChange = (e) => {
    const { name, value } = e.target;
    setNitFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgregarNit = () => {
    if (!nitFormData.nit || !nitFormData.nombre) {
      alert('Por favor complete al menos NIT y Nombre');
      return;
    }

    const nuevoNit = {
      id: Date.now(),
      ...nitFormData,
      estado: 'ACTIVO'
    };

    setNitsList([...nitsList, nuevoNit]);
    alert('Proveedor agregado exitosamente');
    setNitFormData({ nit: '', nombre: '', descripcion: '' });
    setShowNitModal(false);
  };

  const handleToggleEstadoNit = (id) => {
    setNitsList(nitsList.map(nit => 
      nit.id === id 
        ? { ...nit, estado: nit.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }
        : nit
    ));
  };

  const handleAbrirEditNit = (nit) => {
    setNitEditando({ ...nit });
    setShowEditNitModal(true);
  };

  const handleGuardarEditNit = () => {
    if (nitEditando.nit && nitEditando.nombre) {
      setNitsList(nitsList.map(item => 
        item.id === nitEditando.id ? nitEditando : item
      ));
      setShowEditNitModal(false);
      setNitEditando(null);
      alert('Proveedor actualizado exitosamente');
    } else {
      alert('Por favor complete NIT y Nombre');
    }
  };

  // Funciones para Documentos
  const handleGuardarDocumento = () => {
    if (!formData.periodo || !formData.fecha || !formData.nit || !formData.nombre || !formData.tipo || !formData.precioTotal) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const nuevoDocumento = {
      id: Date.now(),
      ...formData,
      calculos: calculos,
      combustibleGuardado: combustibleGuardado,
      fechaGuardado: new Date().toLocaleString('es-GT'),
      tipoDocumento: 'COMPRA'
    };

    setDocumentosList([...documentosList, nuevoDocumento]);
    alert('Compra guardada exitosamente');
    
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
      tasaCambio: '7.80'
    });
    
    setCalculos({
      precioSinIVA: 0,
      totalSinImpuesto: 0,
      tasaIVA: 0,
      ivaPercentaje: 0,
      idp: 0
    });
    setCombustibleGuardado(null);
  };

  const handleAbrirEditDocumento = (doc) => {
    setDocumentoEditando({ ...doc });
    setShowEditDocumentoModal(true);
  };

  const handleGuardarEditDocumento = () => {
    if (documentoEditando.periodo && documentoEditando.fecha && documentoEditando.nit && documentoEditando.nombre) {
      setDocumentosList(documentosList.map(item =>
        item.id === documentoEditando.id ? documentoEditando : item
      ));
      setShowEditDocumentoModal(false);
      setDocumentoEditando(null);
      alert('Documento actualizado exitosamente');
    } else {
      alert('Por favor complete los campos requeridos');
    }
  };

  const handleEliminarDocumento = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      setDocumentosList(documentosList.filter(item => item.id !== id));
      alert('Documento eliminado');
    }
  };

  const documentosFiltrados = documentosList.filter(doc =>
    doc.nit.toLowerCase().includes(busquedaDocumento.toLowerCase()) ||
    doc.nombre.toLowerCase().includes(busquedaDocumento.toLowerCase()) ||
    doc.numeroSerie.toLowerCase().includes(busquedaDocumento.toLowerCase())
  );

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f0f2f5' }}>
      <AppNavbar />
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="fw-bold text-primary mb-0">
                <i className="bi bi-journal-check me-2"></i>Control de Compras
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
                  <i className="bi bi-shop me-2"></i>Gestión de Compras
                </h5>

                {/* Secciones de Proveedores y Documentos */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h5 className="fw-semibold">
                        <i className="bi bi-building me-2" style={{ color: '#0d6efd', fontSize: '1.2rem' }}></i>Proveedores (NITs)
                      </h5>
                      <p className="text-muted">Gestiona proveedores y registra compras.</p>
                      <div className="d-flex gap-2 flex-wrap">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => setShowNitModal(true)}
                        >
                          <i className="bi bi-plus-circle me-1"></i>Agregar Proveedor
                        </button>
                        <button 
                          className="btn btn-info btn-sm"
                          onClick={() => setShowListaNitModal(true)}
                          disabled={nitsList.length === 0}
                        >
                          <i className="bi bi-eye me-1"></i>Ver Proveedores ({nitsList.length})
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h5 className="fw-semibold">
                        <i className="bi bi-file-earmark-check me-2" style={{ color: '#0d6efd', fontSize: '1.2rem' }}></i>Documentos de Compra
                      </h5>
                      <p className="text-muted">Guarda, edita y gestiona tus compras.</p>
                      <div className="d-flex gap-2 flex-wrap">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={handleGuardarDocumento}
                        >
                          <i className="bi bi-save me-1"></i>Guardar Compra
                        </button>
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => setShowListaDocumentosModal(true)}
                          disabled={documentosList.length === 0}
                        >
                          <i className="bi bi-folder-open me-1"></i>Ver Compras ({documentosList.length})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />
                <h6 className="fw-bold text-secondary mb-3">
                  <i className="bi bi-pencil-square me-2"></i>Ingrese los Datos de la Compra
                </h6>

                {/* Formulario de Compras */}
                <div className="row g-3">
                  {/* Período */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="periodo" className="form-label fw-semibold">Período</label>
                    <select
                      id="periodo"
                      name="periodo"
                      className="form-select"
                      value={formData.periodo}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione el mes</option>
                      {meses.map((mes) => (
                        <option key={mes.value} value={mes.value}>{mes.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fecha */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="fecha" className="form-label fw-semibold">Fecha</label>
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
                    <label htmlFor="numeroSerie" className="form-label fw-semibold">Número de Serie</label>
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
                    <label htmlFor="numeroMovimiento" className="form-label fw-semibold">Número de Movimiento</label>
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

                  {/* NIT del Proveedor */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="nit" className="form-label fw-semibold">NIT del Proveedor</label>
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

                  {/* Nombre del Proveedor */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="nombre" className="form-label fw-semibold">Nombre del Proveedor</label>
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
                    <label htmlFor="tipo" className="form-label fw-semibold">Tipo de Documento</label>
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
                      <option value="COMBUSTIBLE">COMBUSTIBLE</option>
                      <option value="PEQUEÑO CONTRIBUYENTE">PEQUEÑO CONTRIBUYENTE</option>
                    </select>
                  </div>

                  {/* Precio Total */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="precioTotal" className="form-label fw-semibold">Precio Total</label>
                    <input
                      type="number"
                      id="precioTotal"
                      name="precioTotal"
                      className="form-control"
                      step="0.01"
                      placeholder="Ej: 1500.00"
                      value={formData.precioTotal}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Moneda */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="moneda" className="form-label fw-semibold">Moneda</label>
                    <select
                      id="moneda"
                      name="moneda"
                      className="form-select"
                      value={formData.moneda}
                      onChange={handleInputChange}
                    >
                      <option value="GTQ">GTQ (Quetzal)</option>
                      <option value="USD">USD (Dólar)</option>
                    </select>
                  </div>

                  {/* Tasa de Cambio */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="tasaCambio" className="form-label fw-semibold">Tasa de Cambio (GTQ/USD)</label>
                    <input
                      type="number"
                      id="tasaCambio"
                      name="tasaCambio"
                      className="form-control"
                      step="0.01"
                      placeholder="Ej: 7.80"
                      value={formData.tasaCambio}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <hr />

                {/* Resumen de Combustible */}
                {formData.tipo === 'COMBUSTIBLE' && combustibleGuardado && (
                  <div className="alert alert-warning d-flex align-items-center justify-content-between gap-3 flex-wrap">
                    <div className="d-flex align-items-center gap-3">
                      <i className="bi bi-fuel-pump-fill fs-3 text-warning"></i>
                      <div>
                        <div className="fw-semibold">Combustible seleccionado</div>
                        <small className="text-muted">
                          Tipo: {combustibleGuardado.tipoCombustible} · Galones: {combustibleGuardado.cantidadGalones}
                        </small>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm shadow-sm"
                      onClick={() => setShowCombustibleModal(true)}
                    >
                      <i className="bi bi-pencil-square me-1"></i>Editar combustible
                    </button>
                  </div>
                )}

                {/* Cálculos mostrados */}
                {calculos.precioSinIVA !== 0 || calculos.ivaPercentaje !== 0 ? (
                  <div className="row g-3">
                    <div className="col-12 col-md-3">
                      <label className="form-label fw-semibold">Precio Sin IVA</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        readOnly
                        value={`${getSimboloMoneda()} ${parseFloat(calculos.precioSinIVA).toFixed(2)}`}
                      />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label fw-semibold">Tasa de IVA</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        readOnly
                        value={`${calculos.tasaIVA}%`}
                      />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label fw-semibold">Total Sin Impuesto</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        readOnly
                        value={`${getSimboloMoneda()} ${parseFloat(calculos.totalSinImpuesto).toFixed(2)}`}
                      />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label fw-semibold">IVA</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        readOnly
                        value={`${getSimboloMoneda()} ${(parseFloat(formData.precioTotal || 0) - parseFloat(calculos.totalSinImpuesto || 0)).toFixed(2)}`}
                      />
                    </div>
                    {calculos.idp > 0 && (
                      <div className="col-12 col-md-3">
                        <label className="form-label fw-semibold">IDP (Combustible)</label>
                        <input
                          type="text"
                          className="form-control bg-light"
                          readOnly
                          value={`${getSimboloMoneda()} ${parseFloat(calculos.idp).toFixed(2)}`}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted text-center">Ingrese los datos para ver los cálculos</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Combustible */}
      {showCombustibleModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  <i className="bi bi-fuel-pump me-2"></i>Ingrese Datos de Combustible
                </h5>
                <button type="button" className="btn-close" onClick={handleCerrarCombustibleModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tipo de Combustible</label>
                  <select
                    name="tipoCombustible"
                    className="form-select"
                    value={combustibleData.tipoCombustible}
                    onChange={handleCombustibleChange}
                  >
                    <option value="">Seleccione tipo</option>
                    <option value="SUPER">SUPER (4.70%)</option>
                    <option value="REGULAR">REGULAR (4.60%)</option>
                    <option value="DIESEL">DIESEL (1.30%)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Cantidad (Galones)</label>
                  <input
                    type="number"
                    name="cantidadGalones"
                    className="form-control"
                    placeholder="Ingrese cantidad"
                    value={combustibleData.cantidadGalones}
                    onChange={handleCombustibleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCerrarCombustibleModal}>Cancelar</button>
                <button type="button" className="btn btn-warning" onClick={handleGuardarCombustible}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar NIT */}
      {showNitModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title"><i className="bi bi-plus-circle me-2"></i>Agregar Proveedor</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowNitModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">NIT</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: 1234567-8"
                    value={nitFormData.nit}
                    onChange={(e) => setNitFormData({...nitFormData, nit: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del proveedor"
                    value={nitFormData.nombre}
                    onChange={(e) => setNitFormData({...nitFormData, nombre: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea
                    className="form-control"
                    placeholder="Descripción (opcional)"
                    value={nitFormData.descripcion}
                    onChange={(e) => setNitFormData({...nitFormData, descripcion: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNitModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleAgregarNit}>Agregar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lista de NITs */}
      {showListaNitModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title"><i className="bi bi-list-check me-2"></i>Lista de Proveedores ({nitsList.length})</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowListaNitModal(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {nitsList.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>NIT</th>
                          <th>Nombre</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nitsList.map((item) => (
                          <tr key={item.id}>
                            <td><span className="badge bg-primary">{item.nit}</span></td>
                            <td>{item.nombre}</td>
                            <td><span className={`badge ${item.estado === 'ACTIVO' ? 'bg-success' : 'bg-danger'}`}>{item.estado}</span></td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleAbrirEditNit(item)}>Editar</button>
                              <button className="btn btn-sm btn-outline-warning" onClick={() => handleToggleEstadoNit(item.id)}>
                                {item.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center">No hay proveedores registrados</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowListaNitModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar NIT */}
      {showEditNitModal && nitEditando && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title"><i className="bi bi-pencil-square me-2"></i>Editar Proveedor</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditNitModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">NIT</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nitEditando.nit}
                    onChange={(e) => setNitEditando({...nitEditando, nit: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nitEditando.nombre}
                    onChange={(e) => setNitEditando({...nitEditando, nombre: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea
                    className="form-control"
                    value={nitEditando.descripcion}
                    onChange={(e) => setNitEditando({...nitEditando, descripcion: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditNitModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleGuardarEditNit}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lista de Documentos */}
      {showListaDocumentosModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title"><i className="bi bi-file-earmark-check me-2"></i>Documentos de Compra ({documentosList.length})</h5>
                <button type="button" className="btn-close" onClick={() => setShowListaDocumentosModal(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <div className="mb-3">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Buscar por NIT, nombre o serie..."
                    value={busquedaDocumento}
                    onChange={(e) => setBusquedaDocumento(e.target.value)}
                  />
                </div>
                {documentosFiltrados.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Período</th>
                          <th>NIT</th>
                          <th>Proveedor</th>
                          <th>Tipo</th>
                          <th>Total</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documentosFiltrados.map((doc) => (
                          <tr key={doc.id}>
                            <td>{doc.periodo}</td>
                            <td>{doc.nit}</td>
                            <td>{doc.nombre}</td>
                            <td><span className="badge bg-info">{doc.tipo}</span></td>
                            <td>{getSimboloMoneda()} {parseFloat(doc.precioTotal).toFixed(2)}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleAbrirEditDocumento(doc)}>Editar</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminarDocumento(doc.id)}>Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center">No hay documentos registrados</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowListaDocumentosModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Documento */}
      {showEditDocumentoModal && documentoEditando && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title"><i className="bi bi-pencil-square me-2"></i>Editar Compra</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditDocumentoModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Período</label>
                    <input type="text" className="form-control" value={documentoEditando.periodo} onChange={(e) => setDocumentoEditando({...documentoEditando, periodo: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Fecha</label>
                    <input type="date" className="form-control" value={documentoEditando.fecha} onChange={(e) => setDocumentoEditando({...documentoEditando, fecha: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">NIT</label>
                    <input type="text" className="form-control" value={documentoEditando.nit} onChange={(e) => setDocumentoEditando({...documentoEditando, nit: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Nombre</label>
                    <input type="text" className="form-control" value={documentoEditando.nombre} onChange={(e) => setDocumentoEditando({...documentoEditando, nombre: e.target.value})} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Total</label>
                    <input type="number" className="form-control" value={documentoEditando.precioTotal} onChange={(e) => setDocumentoEditando({...documentoEditando, precioTotal: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditDocumentoModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleGuardarEditDocumento}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-primary text-white text-center py-3 mt-auto">
        <div className="container">
          <p className="mb-0">&copy; 2026 EcoSphere. Módulo de Controles de IVA.</p>
        </div>
      </footer>
    </div>
  );
};

export default IvaControls;
