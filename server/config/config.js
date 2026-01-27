require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
  jwtExpiration: process.env.JWT_EXPIRATION || '1h',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:3000'],
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutos
  rateLimitMaxRequests: 100, // 100 requests por ventana
  loginRateLimitMax: 5 // 5 intentos de login por ventana
};
