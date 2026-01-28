const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Logger
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

// Seguridad
app.use(helmet());

// CORS configurado específicamente (soporta múltiples orígenes)
const allowedOrigins = Array.isArray(config.clientUrl)
  ? config.clientUrl
  : String(config.clientUrl)
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // permitir herramientas como Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting general
const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rutas
app.use('/api', authRoutes);

// Ruta 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
  console.log(`📍 Accepting requests from: ${allowedOrigins.join(', ')}`);
});