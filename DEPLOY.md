# 🚀 Guía de Despliegue en Render.com

## Configuración Inicial

### 1. Crear el Servicio Correcto

**⚠️ IMPORTANTE**: Asegúrate de crear un **Web Service** (no Static Site)

En Render Dashboard:
1. Click en "New +" 
2. Selecciona **"Web Service"** (NO Static Site)
3. Conecta tu repositorio de GitHub

### 2. Configuración del Build

En la configuración del servicio:

- **Name**: `eventify-backend` (o el que prefieras)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free` (o el que prefieras)

**⚠️ NO configures un "Publish Directory"** - Este es un servicio web, no un sitio estático.

### 3. Variables de Entorno

Agrega estas variables de entorno en Render (Settings > Environment):

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Entorno de producción |
| `PORT` | (vacío) | Render asigna el puerto automáticamente |
| `MONGODB_URI` | `mongodb://...` | URI de tu base de datos MongoDB |
| `DB_NAME` | `Eventify` | Nombre de la base de datos |
| `JWT_SECRET` | `clave_secreta...` | Clave segura para JWT (genera una aleatoria) |

### 4. MongoDB

#### Opción A: MongoDB Atlas (Recomendado)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster (gratis disponible)
3. Obtén la connection string
4. Configura `MONGODB_URI` en Render con el formato:
   ```
   mongodb+srv://usuario:password@cluster.mongodb.net/Eventify?retryWrites=true&w=majority
   ```
5. En MongoDB Atlas, agrega la IP de Render (0.0.0.0/0 para permitir todas las IPs en desarrollo)

#### Opción B: MongoDB en Render

1. En Render, crea un nuevo **MongoDB** service
2. Render te dará una URI interna automáticamente
3. Usa esa URI en `MONGODB_URI`

### 5. Desplegar

1. Haz commit y push del archivo `render.yaml` si lo usas
2. Render detectará automáticamente el despliegue
3. Espera a que termine el build (puede tomar 2-3 minutos)

### 6. Poblar la Base de Datos

Después del despliegue exitoso:

1. Ve a la consola del servicio en Render (Shell tab)
2. Ejecuta: `npm run seed`
3. Esto cargará los datos iniciales

## Solución de Problemas

### Error: "Publish directory dist does not exist"

**Causa**: El servicio está configurado como Static Site en lugar de Web Service.

**Solución**: 
1. Elimina el servicio actual
2. Crea un nuevo **Web Service** (no Static Site)
3. Asegúrate de que NO haya un "Publish Directory" configurado

### Error: "Failed to start server due to DB connection error"

**Causa**: MongoDB no es accesible o la URI es incorrecta.

**Solución**:
1. Verifica que `MONGODB_URI` esté correctamente configurado
2. Si usas MongoDB Atlas, verifica que la IP de Render esté en la whitelist
3. Verifica que el usuario y contraseña sean correctos

### Error: Puerto no disponible

**Causa**: Render asigna el puerto automáticamente.

**Solución**: El código ya usa `process.env.PORT || 3000`, así que Render asignará el puerto automáticamente. No necesitas configurar PORT manualmente.

## Verificación

Después del despliegue, verifica:

1. ✅ El servicio está en estado "Live"
2. ✅ Puedes acceder a `https://tu-app.onrender.com/auth/login`
3. ✅ Puedes registrar un nuevo usuario
4. ✅ Puedes iniciar sesión

## Usar el archivo render.yaml (Opcional)

Si prefieres usar el archivo `render.yaml` incluido en el proyecto:

1. Asegúrate de que esté en la raíz del repositorio
2. En Render, selecciona "Infrastructure as Code"
3. Render usará automáticamente la configuración del archivo
4. Solo necesitarás configurar manualmente `MONGODB_URI` y `JWT_SECRET` (por seguridad)

## Contacto

Si tienes problemas con el despliegue, revisa los logs en Render para más detalles del error.


