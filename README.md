# 🌳 DevTree

> Plataforma de enlaces personalizables estilo LinkTree construida con TypeScript, React y Node.js

![DevTree](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)

---

## ✨ Características

- ✅ **Autenticación JWT** - Sistema seguro de login y registro
- ✅ **Perfil Personalizable** - Handle único, descripción e imagen de perfil
- ✅ **Enlaces Ilimitados** - Agrega todos tus enlaces sociales
- ✅ **Drag & Drop** - Reordena tus enlaces fácilmente
- ✅ **Analytics** - Tracking de visitas y clicks
- ✅ **Multilenguaje** - Soporte para inglés, español, francés y portugués
- ✅ **Dark Mode** - Tema oscuro/claro
- ✅ **Responsive** - Diseño adaptable a móviles y desktop
- ✅ **API Documentada** - Swagger/OpenAPI integrado

---

## 🚀 Demo

- **Frontend**: [Ver Demo](https://dev-tree-isil.netlify.app/)
- **API Docs**: [Swagger](https://devtree-api-os9u.onrender.com/api-docs)

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** + **TypeScript** - Runtime y lenguaje
- **Express** - Framework web
- **MongoDB** + **Mongoose** - Base de datos
- **JWT** - Autenticación
- **Cloudinary** - Almacenamiento de imágenes
- **Swagger** - Documentación API

### Frontend
- **React 19** + **TypeScript** - UI Library
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **React Router** - Navegación
- **TanStack Query** - Gestión de estado servidor
- **React Hook Form** - Formularios
- **i18next** - Internacionalización
- **dnd-kit** - Drag and drop

---

## 📦 Instalación Local

### Pre-requisitos

- Node.js 20+
- MongoDB (local o MongoDB Atlas)
- Cuenta en Cloudinary (para imágenes)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/devtree.git
cd devtree
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crea el archivo \`.env\`:

```bash
cp .env.example .env
```

Edita \`.env\` con tus credenciales:

```env
MONGO_URI=mongodb+srv://...
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=tu-secret-aqui
CLOUDINARY_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

Inicia el servidor:

```bash
npm run dev
```

El backend estará en \`http://localhost:4000\`

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

Crea el archivo \`.env\`:

```bash
cp .env.example .env
```

Edita \`.env\`:

```env
VITE_API_URL=http://localhost:4000
```

Inicia la aplicación:

```bash
npm run dev
```

El frontend estará en \`http://localhost:5173\`


## 🔑 API Endpoints

### Autenticación
- \`POST /auth/register\` - Registrar usuario
- \`POST /auth/login\` - Iniciar sesión

### Usuario
- \`GET /user\` - Obtener usuario autenticado
- \`PATCH /user\` - Actualizar perfil
- \`POST /user/image\` - Subir imagen

### Analytics
- \`POST /analytics\` - Registrar evento
- \`GET /analytics/dashboard\` - Obtener estadísticas

### Público
- \`GET /:handle\` - Ver perfil público
- \`GET /search\` - Buscar perfiles

**Documentación completa**: \`http://localhost:4000/api-docs\`

---

## 📁 Estructura del Proyecto

```
devtree/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuraciones (DB, CORS, Swagger)
│   │   ├── controllers/    # Controladores
│   │   ├── handlers/       # Handlers de rutas
│   │   ├── middleware/     # Middlewares (auth, validation)
│   │   ├── models/         # Modelos de Mongoose
│   │   ├── router/         # Rutas
│   │   ├── utils/          # Utilidades
│   │   ├── server.ts       # Configuración Express
│   │   └── index.ts        # Entry point
│   ├── .env.example
│   ├── package.json
│   └── render.yaml         # Config para Render
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Llamadas a API
│   │   ├── components/     # Componentes React
│   │   ├── config/         # Configuraciones (axios)
│   │   ├── i18n/           # Traducciones
│   │   ├── router/         # React Router
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilidades
│   │   ├── views/          # Páginas
│   │   └── App.tsx
│   ├── .env.example
│   ├── package.json
│   ├── netlify.toml        # Config para Netlify
│
└── README.md
```

## 📝 Licencia

Este proyecto está bajo la Licencia ISC - ver el archivo [LICENSE](LICENSE) para más detalles.

