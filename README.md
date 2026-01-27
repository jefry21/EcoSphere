# EcoSphere

Sistema de gestión de contabilidad empresarial con autenticación JWT y arquitectura cliente-servidor.

## 🏗️ Arquitectura

**Frontend**: React 19 + React Router + Bootstrap 5  
**Backend**: Node.js + Express 5 + JWT  
**Seguridad**: Helmet, CORS, Rate Limiting, Validación

## 📁 Estructura del Proyecto

```
EcoSphere/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── services/      # API centralizada
│   │   ├── Login.js       # Página de login
│   │   ├── Main.js        # Dashboard principal
│   │   └── App.js         # Router principal
│   └── .env               # Variables de entorno
│
└── server/                # Backend Express
    ├── config/            # Configuración
    ├── controllers/       # Lógica de negocio
    ├── middleware/        # Auth, validación, errores
    ├── routes/            # Rutas de la API
    ├── index.js           # Servidor principal
    └── .env               # Variables de entorno (NO COMMITEAR)
```

## 🚀 Instalación

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

## 🔐 Credenciales por Defecto

- **Usuario**: `admin`
- **Contraseña**: `password`

## 🛡️ Características de Seguridad

✅ **Implementado:**
- ✅ JWT para autenticación stateless
- ✅ Bcrypt para hash de contraseñas (10 rounds)
- ✅ Helmet.js para headers HTTP seguros
- ✅ CORS configurado específicamente
- ✅ Rate limiting (100 req/15min general, 5 req/15min login)
- ✅ Validación de inputs con express-validator
- ✅ Manejo centralizado de errores
- ✅ Logger (Morgan) para auditoría
- ✅ .gitignore protegiendo .env
- ✅ Arquitectura MVC separada
- ✅ Interceptores de Axios para tokens

## 📡 API Endpoints

### Autenticación

**POST** `/api/login`  
Login de usuario
```json
{
  "username": "admin",
  "password": "password"
}
```

**GET** `/api/profile` 🔒  
Obtener perfil del usuario autenticado  
Requiere: `Authorization: Bearer <token>`

**GET** `/api/verify` 🔒  
Verificar validez del token  
Requiere: `Authorization: Bearer <token>`

**GET** `/health`  
Health check del servidor

## ⚙️ Variables de Entorno

### Server (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRATION=1h
CLIENT_URL=http://localhost:3000,http://localhost:3001
```

### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🔄 Próximas Mejoras

- [ ] Integración con base de datos (MongoDB/PostgreSQL)
- [ ] Refresh tokens
- [ ] Tests unitarios y de integración
- [ ] Documentación Swagger/OpenAPI
- [ ] HTTPS en producción
- [ ] Registro de usuarios
- [ ] Recuperación de contraseña

## 📝 Notas de Desarrollo

- Los datos actualmente se almacenan **en memoria** (se pierden al reiniciar)
- El servidor se reinicia automáticamente con `nodemon` en modo desarrollo
- CORS está configurado para localhost:3000 y localhost:3001
- Rate limiting puede ajustarse en `server/config/config.js`

## 🐛 Debugging

Ver logs del servidor en la terminal donde corre `npm run dev`  
Health check: `http://localhost:5000/health`

---

**Versión**: 1.0.0  
**Licencia**: ISC