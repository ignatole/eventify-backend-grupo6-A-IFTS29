# Eventify - Sistema de Gestión para Producción de Eventos

Sistema completo de gestión para empresas de producción de eventos. Permite orquestar lanzamientos, festivales, roadshows y experiencias desde un hub centralizado. Prioridades claras, equipos sincronizados y clientes informados.

## 🎪 Características

### Funcionalidades Principales
- **Gestión de Tareas**: CRUD completo de tareas organizadas por áreas (compras, ventas, producción, logística)
- **Gestión de Clientes**: Base de datos de contactos con información detallada y vinculación a productos
- **Gestión de Proyectos**: Control de proyectos activos con seguimiento de entregables y dependencias
- **Gestión de Productos**: Catálogo de productos y servicios vinculados a clientes
- **Áreas de Producción**: Organización por departamentos especializados con vistas dedicadas

### Seguridad y Autenticación
- **Autenticación JWT**: Sistema de inicio de sesión seguro con tokens
- **Protección de Rutas**: Middleware de autenticación para rutas protegidas
- **Hash de Contraseñas**: Encriptación automática con bcrypt
- **Gestión de Sesiones**: Cookies httpOnly para sesiones web
- **Helmet**: Se añadió la dependencia `helmet` y se activó con `app.use(helmet())` en `src/app.js`. Helmet aplica un conjunto de cabeceras HTTP seguras.
- **Ocultar `X-Powered-By`**: Se deshabilitó la cabecera `X-Powered-By` con `app.disable('x-powered-by')` para evitar filtrar información del servidor.
- **Limitador de peticiones**: Se agregó `express-rate-limit` y se configuró un limitador global (`limiter`) y un limitador específico para autenticación (`authLimiter`) en `src/app.js` (p.ej. 200 req/15min global, 20 req/15min para endpoints de auth). Esto ayuda a mitigar abusos y ataques de fuerza bruta.

### Interfaz de Usuario
- **Diseño Moderno**: UI/UX enfocada en la temática de eventos con gradientes y efectos visuales
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Vistas Optimizadas**: Tarjetas interactivas para clientes, áreas y proyectos
- **Tema Oscuro**: Interfaz con estilo neon y efectos de luz

### Tecnología
- **Backend**: Node.js con Express
- **Base de Datos**: MongoDB con Mongoose
- **Vistas**: Motor de plantillas Pug
- **Autenticación**: JWT (JSON Web Tokens)

## 📋 Requisitos

- Node.js 16 o superior
- MongoDB (local o remoto)
- npm o yarn

## Instalación
1. Clona el repositorio o descarga el código.
2. Instala dependencias:

```powershell
npm install
```

3. Configura las variables de entorno creando un archivo `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=Eventify
JWT_SECRET=tu_secret_key_super_segura_cambiar_en_produccion
PORT=3000
```

## 🚀 Ejecutar

### Modo Desarrollo (con auto-reload)

```powershell
npm run dev
```

### Modo Producción

```powershell
npm start
```

### Poblar Base de Datos (Seed)

Para cargar datos iniciales en la base de datos:

```powershell
npm run seed
```

Por defecto el servidor se ejecuta en `http://localhost:3000`.

## 📁 Estructura del Proyecto

```
src/
├── app.js                 # Configuración principal de Express
├── config/
│   └── db.js             # Configuración de conexión a MongoDB
├── controllers/          # Lógica de negocio
│   ├── authController.js # Controlador de autenticación
│   ├── clientsController.js
│   ├── departmentsController.js
│   ├── productsController.js
│   ├── projectsController.js
│   └── tasksController.js
├── middleware/           # Middlewares personalizados
│   ├── auth.js          # Middleware de autenticación JWT
│   ├── errorHandler.js
│   ├── logger.js
│   └── notFound.js
├── models/              # Modelos de Mongoose
│   ├── User.js
│   ├── Client.js
│   ├── Department.js
│   ├── Product.js
│   ├── Project.js
│   └── Task.js
├── routes/              # Definición de rutas
│   ├── auth.js          # Rutas de autenticación
│   ├── clients.js
│   ├── departments.js
│   ├── products.js
│   ├── projects.js
│   ├── tasks.js
│   └── index.js
├── views/               # Plantillas Pug
│   ├── layout.pug       # Layout principal
│   ├── layout-auth.pug  # Layout para autenticación
│   ├── index.pug        # Página principal
│   ├── auth/           # Vistas de autenticación
│   ├── clients/
│   ├── departments/
│   ├── products/
│   ├── projects/
│   └── tasks/
├── data/                # Datos iniciales en JSON (para seed)
└── scripts/
    └── seed.js          # Script para poblar la base de datos
```

## 🌐 Rutas y Endpoints

### Autenticación (Web y API)

#### Web (HTML)
- `GET /auth/login` - Página de inicio de sesión
- `POST /auth/login` - Procesar inicio de sesión (redirige a home)
- `GET /auth/register` - Página de registro
- `POST /auth/register` - Procesar registro (redirige a home)
- `GET /auth/profile` - Perfil del usuario (requiere autenticación)
- `GET /auth/logout` - Cerrar sesión

#### API (JSON)
- `POST /api/auth/register` - Registrar un nuevo usuario
  ```json
  {
    "name": "Juan Pérez",
    "email": "juan@eventify.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
  Nota: El campo `role` se asigna automáticamente como "user". No es necesario en el registro.

- `POST /api/auth/login` - Iniciar sesión
  ```json
  {
    "email": "juan@eventify.com",
    "password": "password123"
  }
  ```
  Retorna un token JWT que debe incluirse en las peticiones protegidas.

- `GET /api/auth/profile` - Obtener perfil del usuario autenticado (requiere token)

### Uso del Token JWT

Para usar las rutas protegidas (API), incluye el token en el header `Authorization`:

```
Authorization: Bearer <tu_token_jwt>
```

Para las rutas web, el token se guarda automáticamente en una cookie httpOnly al iniciar sesión.

### Rutas Web (Protegidas)

Todas las rutas principales requieren autenticación. Si no estás autenticado, serás redirigido a `/auth/login`.

- `GET /` - Dashboard principal con resumen de actividades
- `GET /clients` - Lista de clientes con tarjetas interactivas
- `GET /clients/new` - Formulario para crear nuevo cliente
- `GET /tasks` - Lista de tareas
- `GET /products` - Lista de productos
- `GET /projects` - Lista de proyectos
- `GET /departments` - Lista de áreas de producción

### Rutas API (JSON)

- `GET /tasks/json` - Obtener todas las tareas en formato JSON
- `GET /tasks/user/:userId/json` - Obtener las tareas asignadas a un usuario
- `GET /clients/json` - Obtener todos los clientes (JSON)
- `POST /clients` - Crear un cliente
- `GET /products/json` - Obtener productos (JSON)
- `GET /projects/json` - Obtener proyectos (JSON)
- `POST /projects` - Crear un proyecto
- `GET /departments/json` - Obtener departamentos (JSON)

## 🔒 Middleware de Autenticación

Para proteger rutas, usa el middleware `authenticate` de `src/middleware/auth.js`:

```javascript
import { authenticate } from './middleware/auth.js';

router.get('/ruta-protegida', authenticate, controller);
```

El middleware:
- Lee el token del header `Authorization` (API) o de la cookie `token` (Web)
- Valida el token JWT
- Carga el usuario en `req.user`
- Redirige a `/auth/login` si es una petición HTML sin autenticación
- Retorna 401 si es una petición API sin autenticación

## 🎨 Características de Diseño

- **Tema Oscuro**: Interfaz con fondo oscuro y efectos de luz neon
- **Gradientes**: Uso de gradientes modernos en tarjetas y elementos
- **Tarjetas Interactivas**: Hover effects y animaciones sutiles
- **Iconos Dinámicos**: Iconos contextuales según el tipo de contenido
- **Responsive**: Diseño adaptable a móviles y tablets
- **Tipografía**: Space Grotesk para un look moderno y legible

## 🛠️ Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con auto-reload
- `npm run seed` - Pobla la base de datos con datos iniciales
- `npm run lint` - Ejecuta el linter (configurar según necesidad)

## 👥 Usuarios de Prueba

Después de ejecutar `npm run seed`, puedes usar estos usuarios (la contraseña es el nombre del email sin el dominio):

- `romina@eventify.com` / `romina`
- `matias@eventify.com` / `matias`
- `laura@eventify.com` / `laura`
- `ivan@eventify.com` / `ivan`
- `ignacio@eventify.com` / `ignacio`

## 🚀 Despliegue en Render.com

### Configuración en Render

1. **Crear un nuevo Web Service** en Render (no Static Site)
2. **Conectar tu repositorio** de GitHub
3. **Configuración del servicio:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
   - **No configurar** un "Publish Directory" (este es un servicio web, no un sitio estático)

### Variables de Entorno

Configura las siguientes variables de entorno en Render:

- `MONGODB_URI`: URI de tu base de datos MongoDB (ej: `mongodb://localhost:27017` o URI de MongoDB Atlas)
- `DB_NAME`: Nombre de la base de datos (por defecto: `Eventify`)
- `JWT_SECRET`: Clave secreta para JWT (genera una clave segura y aleatoria)
- `PORT`: Render asigna el puerto automáticamente, pero puedes dejarlo en `3000` como respaldo
- `NODE_ENV`: `production`

### Notas para Despliegue

- Render asigna automáticamente el puerto, y el código usa `process.env.PORT`
- Asegúrate de tener MongoDB accesible desde Render (MongoDB Atlas es recomendado)
- El archivo `render.yaml` en la raíz del proyecto contiene la configuración base
- Después del despliegue, ejecuta `npm run seed` manualmente o desde la consola de Render para poblar datos iniciales

### MongoDB Atlas (Recomendado)

Si usas MongoDB Atlas, la URI debería verse así:

```
mongodb+srv://usuario:password@cluster.mongodb.net/Eventify?retryWrites=true&w=majority
```

## 📄 Licencia

Este proyecto es parte de un trabajo académico del grupo 6-A de IFTS29.
