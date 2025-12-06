# DevTree - Documentación de Proyecto

> **Memoria de contexto para desarrollo con Claude Code**
> Última actualización: 2025-12-02

---

## 📋 Descripción del Proyecto

**DevTree** es un clon de LinkTree enfocado en desarrolladores. Permite a los usuarios crear una página personalizada con enlaces a sus redes sociales y perfiles profesionales (GitHub, LinkedIn, Twitter, etc.).

### Características Principales
- 🔐 Autenticación con JWT
- 👤 Gestión de perfil (handle, descripción, imagen)
- 🔗 Gestión de enlaces a redes sociales (8 plataformas)
- 🎨 Preview en tiempo real del perfil
- 🖱️ Drag & drop para reordenar enlaces
- 📱 Diseño responsive

---

## 🏗️ Arquitectura del Sistema

### Tipo de Arquitectura
**Component-Based Architecture** con **Layered Design Pattern**

```
┌─────────────────────────────────────────────────────────┐
│                    UI LAYER (Views)                     │
│         LoginView │ RegisterView │ LinkTreeView         │
│                    ProfileView                          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              COMPONENT LAYER (Reusable)                 │
│   DevTree │ DevTreeInput │ DevTreeLink │ NavigationTabs │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│           STATE MANAGEMENT LAYER (React Query)          │
│    Queries │ Mutations │ Cache │ Optimistic Updates     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              API SERVICE LAYER (DevTreeApi)             │
│       getUser │ updateProfile │ uploadImage             │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│           HTTP CLIENT LAYER (Axios + Config)            │
│     Interceptors │ Auth Headers │ Base URL              │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
              🌐 Backend API
```

### Capas del Sistema

| Capa | Ubicación | Responsabilidad |
|------|-----------|-----------------|
| **UI Layer** | `src/views/` | Páginas/rutas, renderizado principal |
| **Component Layer** | `src/components/` | Componentes reutilizables, lógica de UI |
| **Layout Layer** | `src/layouts/` | Wrappers de autenticación y app |
| **State Layer** | React Query | Gestión de estado del servidor, cache |
| **Service Layer** | `src/api/DevTreeApi.ts` | Abstracción de llamadas API |
| **HTTP Layer** | `src/config/axios.ts` | Cliente HTTP, interceptores |
| **Utils Layer** | `src/utils/` | Funciones auxiliares puras |
| **Types Layer** | `src/types/` | Contratos TypeScript |
| **Data Layer** | `src/data/` | Datos estáticos, configuración |

---

## 🛠️ Stack Tecnológico

### Core
- **React**: ^19.1.1
- **TypeScript**: Latest
- **Vite**: Bundler y dev server
- **React Router**: ^7.9.4

### Estado y Data Fetching
- **TanStack Query (React Query)**: ^5.90.10
- **Axios**: ^1.13.1

### Forms
- **React Hook Form**: ^7.65.0

### UI y Estilos
- **TailwindCSS**: ^3.4.18
- **Headless UI**: ^2.2.9 (componentes accesibles)
- **Heroicons**: ^2.2.0

### Funcionalidades Especiales
- **@dnd-kit**: ^6.3.1 (drag & drop)
- **Sonner**: ^2.0.7 (toast notifications)

---

## 📁 Estructura de Carpetas

```
frontend/
├── public/
│   ├── bg.svg
│   ├── logo.svg
│   └── social/               # Iconos de redes sociales
│       ├── icon_facebook.svg
│       ├── icon_github.svg
│       ├── icon_instagram.svg
│       ├── icon_linkedin.svg
│       ├── icon_tiktok.svg
│       ├── icon_twitch.svg
│       ├── icon_x.svg
│       └── icon_youtube.svg
│
├── src/
│   ├── api/
│   │   └── DevTreeApi.ts         # Servicios API (getUser, updateProfile, uploadImage)
│   │
│   ├── components/
│   │   ├── DevTree.tsx           # Layout principal con preview sidebar
│   │   ├── DevTreeInput.tsx      # Input individual de red social
│   │   ├── DevTreeLink.tsx       # Link sortable en preview
│   │   ├── ErrorMessage.tsx      # Componente de error reutilizable
│   │   └── NavigationTabs.tsx    # Navegación responsive
│   │
│   ├── config/
│   │   └── axios.ts              # Configuración de axios + interceptores
│   │
│   ├── data/
│   │   └── social.ts             # Array de redes sociales disponibles
│   │
│   ├── layouts/
│   │   ├── AppLayout.tsx         # Layout protegido (requiere auth)
│   │   └── AuthLayout.tsx        # Layout para login/register
│   │
│   ├── types/
│   │   └── index.ts              # Tipos TypeScript del dominio
│   │
│   ├── utils/
│   │   └── index.ts              # classNames(), isValidUrl()
│   │
│   ├── views/
│   │   ├── LinkTreeView.tsx      # Gestión de enlaces sociales
│   │   ├── LoginView.tsx         # Login
│   │   ├── ProfileView.tsx       # Edición de perfil
│   │   └── RegisterView.tsx      # Registro
│   │
│   ├── index.css                 # Tailwind imports
│   ├── main.tsx                  # Entry point
│   └── router.tsx                # Configuración de rutas
│
├── .env.local                    # Variables de entorno
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🔌 API Services

### Configuración Base

```typescript
// src/config/axios.ts
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL  // http://localhost:4000
})

// Interceptor: Inyecta JWT automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('AUTH_TOKEN')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
```

### Endpoints Disponibles

| Función | Method | Endpoint | Descripción |
|---------|--------|----------|-------------|
| `getUser()` | GET | `/user` | Obtiene datos del usuario autenticado |
| `updateProfile(form)` | PATCH | `/user` | Actualiza handle y description |
| `uploadImage(file)` | POST | `/user/image` | Sube imagen de perfil a Cloudinary |

### Patrón de Manejo de Errores

```typescript
try {
    const {data} = await api.method(endpoint, payload)
    return data
} catch (error) {
    if(isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
    }
}
```

---

## 📊 Tipos y Contratos

### Tipos Principales

```typescript
// src/types/index.ts

export type User = {
    handle: string
    name: string
    email: string
    _id: string
    description: string
    image: string
    links: string  // JSON stringified array of SocialNetwork
}

export type SocialNetwork = {
    id: number          // 0 = disabled, 1+ = enabled con orden
    name: string
    url: string
    enabled: boolean
}

export type DevTreeLink = Pick<SocialNetwork, 'name' | 'url' | 'enabled'>

export type RegisterForm = Pick<User, 'handle' | 'email' | 'name'> & {
    password: string
    password_confirmation: string
}

export type LoginForm = Pick<User, 'email'> & {
    password: string
}

export type ProfileForm = Pick<User, 'handle' | 'description'>
```

### Transformación de Datos

**Backend → Frontend:**
```typescript
// user.links viene como string
const links: SocialNetwork[] = JSON.parse(user.links)
```

**Frontend → Backend:**
```typescript
// Convertir array a string antes de enviar
const payload = {
    ...user,
    links: JSON.stringify(linksArray)
}
```

---

## 🎨 Patrones y Convenciones

### State Management Patterns

#### 1. Server State (React Query)
```typescript
// Query para fetch
const {data, isLoading, isError} = useQuery({
    queryFn: getUser,
    queryKey: ['user'],
    retry: 1,
    refetchOnWindowFocus: false
})

// Mutation para updates
const mutation = useMutation({
    mutationFn: updateProfile,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
        toast.success(data)
        queryClient.invalidateQueries({queryKey: ['user']})
    }
})
```

#### 2. Form State (React Hook Form)
```typescript
const {register, handleSubmit, formState: {errors}} = useForm<FormType>()

<input
    {...register('email', {
        required: "Email es obligatorio",
        pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Email no válido"
        }
    })}
/>
```

#### 3. Optimistic Updates
```typescript
const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (imageUrl) => {
        // Actualiza cache inmediatamente
        queryClient.setQueryData(['user'], (prevData: User) => ({
            ...prevData,
            image: imageUrl
        }))
    }
})
```

### Validación Client-Side

```typescript
// React Hook Form
register('field', {
    required: "Campo obligatorio",
    minLength: {value: 8, message: "Mínimo 8 caracteres"},
    pattern: {value: /regex/, message: "Formato inválido"}
})

// Custom validators
import {isValidUrl} from '@/utils'

if (!isValidUrl(url)) {
    toast.error("URL no válida")
    return
}
```

### Naming Conventions

- **Componentes**: PascalCase (`DevTreeInput.tsx`)
- **Funciones**: camelCase (`handleSubmit`)
- **Tipos**: PascalCase (`SocialNetwork`)
- **Constantes**: UPPER_SNAKE_CASE (`AUTH_TOKEN`)
- **Archivos de tipos**: lowercase (`index.ts`)

---

## 🔄 Flujos Críticos

### 1. Autenticación (Login)

```
Usuario ingresa credenciales
    ↓
React Hook Form valida
    ↓
Submit → POST /auth/login
    ↓
Backend valida y retorna JWT token
    ↓
Token guardado en localStorage ('AUTH_TOKEN')
    ↓
Redirección a /admin
    ↓
AppLayout hace GET /user con token
    ↓
Usuario autenticado
```

### 2. Actualización de Perfil

```
Usuario edita handle/description
    ↓
Form captura cambios (React Hook Form)
    ↓
Submit → Mutation ejecutada
    ↓
QueryClient obtiene user actual del cache
    ↓
Merge user + formData
    ↓
PATCH /user con datos actualizados
    ↓
onSuccess: invalidateQueries(['user'])
    ↓
Refetch automático → UI actualizada
```

### 3. Upload de Imagen (Optimistic)

```
Usuario selecciona archivo
    ↓
uploadImageMutation.mutate(file)
    ↓
[OPTIMISTIC] setQueryData(['user']) → UI actualiza INMEDIATAMENTE
    ↓
[BACKGROUND] POST /user/image → Cloudinary
    ↓
Response con URL real
    ↓
Cache actualizado con URL confirmada
```

### 4. Gestión de Enlaces

```
Usuario tipea URL
    ↓
handleUrlChange:
  - Update local state
  - Update query cache
    ↓
Usuario toggle enable
    ↓
handleEnableLink:
  - Validar URL con isValidUrl()
  - Calcular IDs secuenciales (1, 2, 3...)
  - Update state + cache
    ↓
Usuario click "Guardar"
    ↓
PATCH /user con user completo
    ↓
Backend guarda en DB
```

### 5. Drag & Drop de Enlaces

```
Usuario arrastra link
    ↓
onDragEnd event
    ↓
arrayMove(links, oldIndex, newIndex)
    ↓
setQueryData(['user']) con nuevo orden
    ↓
Preview actualizado inmediatamente
```

---

## 🐛 Bugs Conocidos

### 🔴 Críticos (Requieren Fix Inmediato)

1. **`DevTreeApi.ts:27` - Token sobrescrito incorrectamente**
   ```typescript
   // ❌ ACTUAL (BUG)
   localStorage.setItem('AUTH_TOKEN', data)

   // ✅ FIX: Eliminar esta línea completamente
   // updateProfile no debería tocar el token
   ```

2. **`LoginView.tsx:23` - Guarda respuesta completa como token**
   ```typescript
   // ❌ ACTUAL (BUG)
   localStorage.setItem('AUTH_TOKEN', data)

   // ✅ FIX
   localStorage.setItem('AUTH_TOKEN', data.token)
   ```

3. **`DevTree.tsx` - Botón logout sin implementación**
   ```typescript
   // ❌ ACTUAL (BUG)
   <button onClick={}>Cerrar sesión</button>

   // ✅ FIX
   <button onClick={() => {
       localStorage.removeItem('AUTH_TOKEN')
       navigate('/auth/login')
   }}>
       Cerrar sesión
   </button>
   ```

### 🟡 Mejoras Recomendadas

1. **Estado duplicado en LinkTreeView**: Local state + query cache
   - Usar cache como única fuente de verdad

2. **Función duplicada**: `classNames()` en `utils/index.ts` y `NavigationTabs.tsx`
   - Eliminar duplicado, importar desde utils

3. **JSON.parse repetido**: Se ejecuta múltiples veces sin memoización
   - Usar `useMemo()` para parsear `user.links`

4. **Sin Error Boundary**: App puede crashear sin recovery
   - Agregar `ErrorBoundary` component

5. **Loading states incompletos**: ProfileView no muestra loading
   - Mostrar spinner cuando `isPending === true`

---

## 🧭 Rutas

```typescript
// Rutas Públicas (AuthLayout)
/auth/login          → LoginView
/auth/register       → RegisterView

// Rutas Protegidas (AppLayout + requiere auth)
/admin               → LinkTreeView (index)
/admin/profile       → ProfileView
```

### Protección de Rutas

La protección se maneja en `AppLayout.tsx`:

```typescript
const {data, isLoading, isError} = useQuery({
    queryFn: getUser,
    queryKey: ['user']
})

if (isError) return <Navigate to='/auth/login'/>
```

Si el query falla (401 Unauthorized), redirige automáticamente al login.

---

## 🎯 Componentes Principales

### Views (Páginas)

| Componente | Ruta | Descripción |
|------------|------|-------------|
| `LoginView` | `/auth/login` | Formulario de login con validación |
| `RegisterView` | `/auth/register` | Registro de nuevos usuarios |
| `LinkTreeView` | `/admin` | Gestión de enlaces a redes sociales |
| `ProfileView` | `/admin/profile` | Edición de perfil y upload de imagen |

### Layouts

| Componente | Propósito |
|------------|-----------|
| `AuthLayout` | Wrapper para rutas de autenticación (login/register) |
| `AppLayout` | Wrapper protegido, fetch de user data, redirect si no auth |

### Componentes Reutilizables

| Componente | Props | Descripción |
|------------|-------|-------------|
| `DevTree` | `data: User` | Layout principal con navbar, tabs, preview sidebar |
| `DevTreeInput` | `item, handleUrlChange, handleEnableLink` | Input individual de red social con toggle |
| `DevTreeLink` | `link: SocialNetwork` | Link sortable para preview (drag & drop) |
| `NavigationTabs` | - | Navegación entre Links y Perfil (responsive) |
| `ErrorMessage` | `children: ReactNode` | Mensaje de error estilizado |

---

## 💾 Almacenamiento Local

### LocalStorage Keys

```typescript
'AUTH_TOKEN'  // JWT token para autenticación
```

### Acceso al Token

```typescript
// Lectura
const token = localStorage.getItem('AUTH_TOKEN')

// Escritura (solo en login)
localStorage.setItem('AUTH_TOKEN', token)

// Eliminación (logout)
localStorage.removeItem('AUTH_TOKEN')
```

---

## 🔧 Utils y Helpers

### `classNames(...classes: string[])`
Concatena clases CSS condicionalmente.

```typescript
classNames(
    'base-class',
    isActive && 'active-class',
    !isDisabled && 'enabled-class'
)
// → "base-class active-class enabled-class"
```

### `isValidUrl(url: string): boolean`
Valida formato de URL.

```typescript
isValidUrl('https://github.com/user')  // true
isValidUrl('not-a-url')                // false
```

---

## 📦 Data Estáticos

### Redes Sociales Disponibles

Definidas en `src/data/social.ts`:

```typescript
export const social: DevTreeLink[] = [
    {name: 'facebook', url: '', enabled: false},
    {name: 'github', url: '', enabled: false},
    {name: 'instagram', url: '', enabled: false},
    {name: 'x', url: '', enabled: false},
    {name: 'youtube', url: '', enabled: false},
    {name: 'tiktok', url: '', enabled: false},
    {name: 'twitch', url: '', enabled: false},
    {name: 'linkedin', url: '', enabled: false},
]
```

Los iconos están en `public/social/icon_{name}.svg`.

---

## 🌐 Variables de Entorno

### `.env.local`

```bash
VITE_API_URL = http://localhost:4000
```

### Acceso en Código

```typescript
import.meta.env.VITE_API_URL
```

---

## 🚀 Comandos de Desarrollo

### Instalación

```bash
cd frontend
npm install
```

### Desarrollo

```bash
npm run dev
# Servidor: http://localhost:5173
# Primera ruta: /auth/login
```

### Build de Producción

```bash
npm run build
# Output: dist/
```

### Preview de Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📝 Guía de Desarrollo

### Al Crear Nuevos Componentes

1. **Ubicación correcta**:
   - `src/views/` → Páginas/rutas
   - `src/components/` → Reutilizables
   - `src/layouts/` → Wrappers de rutas

2. **TypeScript siempre**:
   ```typescript
   interface Props {
       data: User
       onSubmit: (data: FormData) => void
   }

   export default function Component({data, onSubmit}: Props) {
       // ...
   }
   ```

3. **Importar tipos desde `@/types`**:
   ```typescript
   import type {User, SocialNetwork} from '@/types'
   ```

### Al Agregar Nuevas API Calls

1. **Definir en `DevTreeApi.ts`**:
   ```typescript
   export async function newEndpoint(payload: PayloadType) {
       try {
           const {data} = await api.post('/endpoint', payload)
           return data
       } catch (error) {
           if(isAxiosError(error) && error.response) {
               throw new Error(error.response.data.error)
           }
       }
   }
   ```

2. **Crear mutation/query en componente**:
   ```typescript
   const mutation = useMutation({
       mutationFn: newEndpoint,
       onError: (error) => toast.error(error.message),
       onSuccess: (data) => {
           toast.success('Éxito')
           queryClient.invalidateQueries(['relevant-key'])
       }
   })
   ```

### Al Trabajar con Forms

1. **Usar React Hook Form**:
   ```typescript
   const {register, handleSubmit, formState: {errors}} = useForm<FormType>()
   ```

2. **Validación inline**:
   ```typescript
   <input
       {...register('field', {
           required: "Campo obligatorio",
           minLength: {value: 3, message: "Mínimo 3 caracteres"}
       })}
   />
   {errors.field && <ErrorMessage>{errors.field.message}</ErrorMessage>}
   ```

3. **Submit handler**:
   ```typescript
   const onSubmit = handleSubmit((data) => {
       mutation.mutate(data)
   })
   ```

### Al Modificar Estado del Usuario

**SIEMPRE usar React Query para sincronización**:

```typescript
// ❌ NO hacer
const [user, setUser] = useState()

// ✅ SÍ hacer
const {data: user} = useQuery(['user'], getUser)

// Actualizar con setQueryData
queryClient.setQueryData(['user'], (prev: User) => ({
    ...prev,
    newField: newValue
}))

// O invalidar para refetch
queryClient.invalidateQueries(['user'])
```

---

## 🧪 Testing (TODO)

> **Nota**: El proyecto actualmente NO tiene tests. Se recomienda agregar:

```bash
# Instalar dependencias
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Estructura propuesta
src/
├── api/__tests__/
│   └── DevTreeApi.test.ts
├── components/__tests__/
│   ├── DevTreeInput.test.tsx
│   └── DevTreeLink.test.tsx
└── utils/__tests__/
    └── index.test.ts
```

---

## 📚 Recursos y Referencias

### Documentación de Dependencias Clave

- [React Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Headless UI](https://headlessui.com/)
- [dnd-kit](https://dndkit.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Patrones Implementados

- **Container/Presentational Pattern**
- **Compound Components** (DevTree + DevTreeInput)
- **Custom Hooks Pattern** (useQuery, useMutation)
- **Optimistic Updates**
- **Error Boundaries** (pendiente)

---

## 🎓 Decisiones Arquitectónicas

### ¿Por qué React Query en lugar de Redux?

- ✅ Simplifica estado del servidor
- ✅ Cache automático
- ✅ Revalidación y sincronización
- ✅ Optimistic updates built-in
- ✅ Menos boilerplate

### ¿Por qué React Hook Form?

- ✅ Performance (uncontrolled components)
- ✅ Validación integrada
- ✅ TypeScript support excelente
- ✅ Menos re-renders

### ¿Por qué Tailwind CSS?

- ✅ Utilidades atomic CSS
- ✅ Tree-shaking automático
- ✅ No CSS conflicts
- ✅ Responsive design simple

---

## 🔮 Roadmap y TODOs

### Prioritarios (Bugs)
- [ ] Fix auth token bug en `DevTreeApi.ts:27`
- [ ] Fix login token storage en `LoginView.tsx:23`
- [ ] Implementar logout handler en `DevTree.tsx`

### Mejoras Corto Plazo
- [ ] Agregar Error Boundary component
- [ ] Extraer custom hooks (useUserLinks, useAuth)
- [ ] Centralizar constantes (STORAGE_KEYS, API_ENDPOINTS)
- [ ] Agregar loading states completos
- [ ] Eliminar código duplicado (classNames)

### Mejoras Largo Plazo
- [ ] Testing suite (Vitest + Testing Library)
- [ ] Internacionalización (i18n)
- [ ] Storybook para componentes
- [ ] CI/CD pipeline
- [ ] Monitoring y error tracking (Sentry)
- [ ] Performance optimization (lazy loading, code splitting)

---

**Última revisión**: 2025-12-02
**Versión del proyecto**: 1.0.0
**Mantenido por**: DevTree Team
