import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Main from './Main';
import IvaControls from './IvaControls';
import VentasControls from './VentasControls';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/iva" element={<IvaControls />} />
          <Route path="/ventas" element={<VentasControls />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
