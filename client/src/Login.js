import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post('/api/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/main');
    } catch (err) {
      if (err.response) {
        // El servidor respondió con un error
        setError(err.response.data.message || 'Invalid credentials');
      } else if (err.request) {
        // No hubo respuesta del servidor
        setError('Cannot connect to server. Please try again.');
      } else {
        // Error al configurar la petición
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">EcoSphere</h2>
                  <p className="text-muted">Welcome back! Please sign in to your account.</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">Username</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-person"></i></span>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-lock"></i></span>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>
                  {error && <div className="alert alert-danger" role="alert">{error}</div>}
                  <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                  </button>
                </form>
                <div className="text-center">
                  <small className="text-muted">Forgot your password? <a href="#" className="text-decoration-none">Reset it here</a></small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;