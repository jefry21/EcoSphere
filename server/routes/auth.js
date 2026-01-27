const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { loginValidation } = require('../middleware/validation');
const authenticateToken = require('../middleware/auth');
const { login, getProfile, verifyToken } = require('../controllers/authController');
const config = require('../config/config');

// Rate limiter específico para login (más restrictivo)
const loginLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.loginRateLimitMax,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rutas públicas
router.post('/login', loginLimiter, loginValidation, login);

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticateToken, getProfile);
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;
