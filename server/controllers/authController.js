const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Almacenamiento en memoria (temporal)
let users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('password', 10),
    role: 'admin'
  }
];

// Login de usuario
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener perfil del usuario autenticado
const getProfile = (req, res) => {
  // req.user viene del middleware authenticateToken
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    role: user.role
  });
};

// Verificar token (para validación del cliente)
const verifyToken = (req, res) => {
  // Si llegamos aquí, el token es válido (pasó por authenticateToken)
  res.json({
    valid: true,
    user: req.user
  });
};

module.exports = {
  login,
  getProfile,
  verifyToken
};
