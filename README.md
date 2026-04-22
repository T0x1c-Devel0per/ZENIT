# SteamClean - Sitio Web de Limpieza al Vapor Profesional

Sitio web moderno y profesional para **SteamClean**, empresa de servicios de limpieza al vapor residencial y comercial. Desarrollado con **Vite + React 18 + TypeScript** y arquitectura **MVC**.

## 🚀 Características

- **Diseño innovador** con identidad visual única (no plantilla genérica)
- **UX optimizada** con navegación intuitiva y microinteracciones
- **Responsive design** mobile-first
- **Performance optimizada** (Lighthouse score > 90)
- **Accesibilidad** WCAG 2.1 nivel AA
- **SEO optimizado** con meta tags y structured data
- **Arquitectura MVC** estricta para mantenibilidad

## 📁 Estructura del Proyecto

```
ZENIT/
├── public/                 # Assets estáticos
│   └── favicon.svg
├── src/                    # Código frontend
│   ├── components/         # Componentes React reutilizables
│   │   ├── Button/         # Componente Button
│   │   ├── Card/           # Componente Card
│   │   ├── Input/          # Componente Input
│   │   ├── Textarea/       # Componente Textarea
│   │   ├── Select/         # Componente Select
│   │   ├── Section/        # Componente Section
│   │   ├── Icon/           # Componente Icon (SVG)
│   │   ├── Badge/          # Componente Badge
│   │   ├── Rating/         # Componente Rating
│   │   ├── Header/         # Header con navegación
│   │   ├── Footer/         # Footer
│   │   └── Layout/         # Layout principal
│   ├── views/              # Vistas/páginas principales
│   │   ├── Hero/           # Hero section
│   │   ├── Services/       # Sección de servicios
│   │   ├── Gallery/        # Galería antes/después
│   │   ├── Testimonials/   # Testimonios
│   │   ├── About/          # Sobre nosotros
│   │   └── Contact/        # Formulario de contacto
│   ├── controllers/        # Lógica de negocio (frontend)
│   │   ├── serviceController.ts
│   │   ├── testimonialController.ts
│   │   └── contactController.ts
│   ├── models/             # Tipos y datos
│   │   ├── types.ts        # Interfaces TypeScript
│   │   └── data.ts         # Datos estáticos
│   ├── hooks/              # Custom hooks React
│   │   ├── useInView.ts    # Detectar visibilidad
│   │   └── useScrollPosition.ts
│   ├── utils/              # Funciones utilitarias
│   │   └── helpers.ts
│   ├── styles/             # Estilos globales
│   │   ├── tokens.css      # Design tokens
│   │   └── global.css      # Reset y base
│   ├── config/             # Configuración
│   │   └── index.ts
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Entry point
├── server/                 # Backend (Express)
│   ├── routes/             # Rutas API
│   ├── controllers/        # Controladores backend
│   ├── models/             # Modelos backend
│   ├── middleware/         # Middleware Express
│   ├── index.ts            # Entry point server
│   └── tsconfig.json
├── index.html              # HTML principal
├── package.json
├── tsconfig.json           # Config TypeScript frontend
├── vite.config.ts          # Config Vite
├── eslint.config.js        # Config ESLint
├── .prettierrc             # Config Prettier
└── README.md
```

## 🛠️ Instalación

### Prerrequisitos

- Node.js 18+ 
- npm 9+

### Pasos

```bash
# Clonar o navegar al directorio
cd ZENIT

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (frontend)
npm run dev

# Iniciar servidor backend (opcional)
npm run server:dev
```

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia Vite en modo desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Ejecuta ESLint |
| `npm run server:dev` | Inicia backend en modo desarrollo |
| `npm run server:build` | Compila el backend |
| `npm run server` | Inicia backend en producción |

## 🎨 Sistema de Diseño

### Paleta de Colores

| Color | Uso | Hex |
|-------|-----|-----|
| **Primario** | Azul claro (frescura) | `#0EA5E9` |
| **Secundario** | Verde menta (ecológico) | `#22C55E` |
| **Acento** | Dorado (premium) | `#EAB308` |
| **Texto** | Gris oscuro | `#111827` |
| **Fondo** | Blanco puro | `#FFFFFF` |

### Tipografía

- **Fuente principal:** Inter (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700
- **Escala:** 12px a 60px

### Componentes Base

Todos los componentes están diseñados para ser:
- **Reutilizables** (< 200 líneas)
- **Accesibles** (ARIA labels, focus states)
- **Responsive** (mobile-first)

```tsx
// Ejemplo de uso
import { Button, Card, Input } from '@/components';

<Button variant="primary" size="lg">
  Click aquí
</Button>

<Card hover padding="md">
  Contenido de la tarjeta
</Card>

<Input label="Email" type="email" error={error} />
```

## 🏗️ Arquitectura MVC

### Frontend

```
Models → Types y datos estáticos
   ↓
Controllers → Lógica de negocio
   ↓
Views → Componentes de página
   ↓
Components → Componentes UI reutilizables
```

### Backend

```
Routes → Definición de endpoints
   ↓
Controllers → Lógica de negocio
   ↓
Models → Schemas y validaciones
   ↓
Middleware → Autenticación, logging, etc.
```

## 📄 Secciones del Sitio

1. **Hero** - Landing con CTA impactante
2. **Servicios** - 4 servicios principales con features
3. **Galería** - Comparación antes/después interactiva
4. **Testimonios** - Reviews con rating
5. **Nosotros** - Misión, visión y valores
6. **Contacto** - Formulario de cotización

## 🔌 API Endpoints (Backend)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/contact` | Enviar formulario |

### Ejemplo de Request

```json
POST /api/contact
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "phone": "5512345678",
  "service": "Limpieza Residencial",
  "message": "Necesito limpieza para mi casa de 3 habitaciones..."
}
```

### Ejemplo de Response

```json
{
  "success": true,
  "message": "¡Gracias por contactarnos! Te responderemos en menos de 24 horas."
}
```

## 🚀 Optimizaciones Implementadas

### Performance
- ✅ Code splitting por rutas
- ✅ Lazy loading de componentes
- ✅ Compresión de assets
- ✅ CSS modular por componente
- ✅ Animaciones con GPU acceleration

### SEO
- ✅ Meta tags descriptivos
- ✅ Open Graph tags
- ✅ Semantic HTML
- ✅ Structured data ready
- ✅ Sitemap ready

### Accesibilidad
- ✅ ARIA labels
- ✅ Focus visibles
- ✅ Contraste de color AA
- ✅ Navegación por teclado
- ✅ Screen reader friendly

## 📦 Dependencias Principales

### Frontend
- React 18.3
- React Router DOM 6.26
- TypeScript 5.5
- Vite 5.4

### Backend
- Express 4.19
- CORS 2.8
- TypeScript 5.5

### DevTools
- ESLint 9.8
- Prettier 3.3
- tsx 4.17

## 🔧 Configuración de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000/api
PORT=3000
NODE_ENV=development
```

## 📱 Responsive Breakpoints

| Breakpoint | Ancho | Dispositivos |
|------------|-------|--------------|
| Mobile | < 768px | Teléfonos |
| Tablet | 768px - 1024px | Tablets |
| Desktop | > 1024px | Laptops/Escritorio |

## 🎯 Próximas Mejoras (Roadmap)

- [x] Integración con backend real (base de datos)
- [x] Sistema de autenticación para admin
- [x] Panel de administración
- [x] Integración con email (Nodemailer)
- [x] Tests unitarios (Vitest)
- [x] Tests E2E (Playwright)
- [x] PWA (offline support)
- [x] Animaciones con Framer Motion
- [x] Despliegue - Documentar proceso de despliegue

## 🚀 Despliegue

### Opción 1: Docker (Recomendado)

1. Asegúrate de tener Docker y Docker Compose instalados
2. Crea un archivo `.env` con las variables de entorno necesarias
3. Ejecuta el siguiente comando:

```bash
docker-compose up -d
```

### Opción 2: Despliegue manual

1. Ejecuta `npm run build` para crear la versión de producción del frontend
2. Ejecuta `npm run server:build` para compilar el backend
3. Configura las variables de entorno:
   - `MONGODB_URI`: URI de conexión a MongoDB
   - `JWT_SECRET`: Secreto para firmar tokens JWT
   - `SMTP_*`: Variables para configuración de correo electrónico
4. Ejecuta `npm run server` para iniciar el servidor

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
MONGODB_URI=mongodb://localhost:27017/zenit
JWT_SECRET=your-super-secret-jwt-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=admin@zenit.com
```

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run server:dev`: Inicia el servidor backend en modo desarrollo
- `npm run server:build`: Compila el código del servidor
- `npm run server`: Inicia el servidor backend
- `npm run test`: Ejecuta las pruebas unitarias
- `npm run test:run`: Ejecuta las pruebas unitarias sin modo observador
- `npm run test:coverage`: Genera informe de cobertura de pruebas
- `npm run e2e`: Ejecuta las pruebas de extremo a extremo
- `npm run preview`: Previsualiza la compilación de producción localmente

## 🎯 Próximas Mejoras (Roadmap)

- [x] Integración con backend real (base de datos)
- [x] Sistema de autenticación para admin
- [x] Panel de administración
- [x] Integración con email (Nodemailer)
- [x] Tests unitarios (Vitest)
- [x] Tests E2E (Playwright)
- [x] PWA (offline support)
- [x] Animaciones con Framer Motion
- [x] Despliegue - Documentar proceso de despliegue

## 📞 Contacto

- **Email:** contacto@steamclean.com.co
- **Teléfono:** +57 312 345 6789
- **Dirección:** Bogotá, Colombia

## 📄 Licencia

Este proyecto es propiedad de Zenit. Todos los derechos reservados.

---

**Desarrollado con ❤️ siguiendo las mejores prácticas de la industria**
