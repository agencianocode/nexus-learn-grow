# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/49d408a1-2ffc-4f4b-ad9c-c7138a40746a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/49d408a1-2ffc-4f4b-ad9c-c7138a40746a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/49d408a1-2ffc-4f4b-ad9c-c7138a40746a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)


# 🚀 EduCommunity - Plataforma de Comunidades y Cursos Online

## 📖 Descripción del Proyecto

EduCommunity es una plataforma moderna que combina **comunidades online** con **cursos y formaciones**, diseñada para competir y superar a Skool. Permite a creadores de contenido, educadores y empresas crear sus propias comunidades de aprendizaje con cursos integrados, eventos y herramientas de networking avanzadas.

### 🎯 **Problema que Resolvemos**
- Las plataformas actuales (como Skool) tienen limitaciones en personalización y monetización
- Falta de herramientas avanzadas para el aprendizaje online
- Networking básico entre miembros de comunidades
- Analytics limitados para creadores de contenido

### 💡 **Nuestra Solución**
- **Branding personalizable** completo por comunidad
- **Sistema de cursos avanzado** con video player inteligente
- **Networking con IA** para conectar miembros relevantes
- **Múltiples modelos de monetización**
- **Analytics profundos** para creadores
- **Gamificación avanzada** con XP, badges y leaderboards

---

## 🏗️ **Arquitectura y Stack Tecnológico**

### **Frontend**
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS
- **Animaciones**: Framer Motion
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod

### **Backend**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (videos, imágenes, documentos)
- **Real-time**: Supabase Realtime
- **APIs**: Next.js API Routes

### **Servicios Externos**
- **Payments**: Stripe
- **Video**: Vimeo Pro API o custom solution
- **Email**: Resend
- **AI**: OpenAI API (recommendations, matching)
- **Analytics**: Mixpanel o Posthog

### **Deploy & DevOps**
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics
- **CI/CD**: GitHub Actions

---

## 🎨 **Funcionalidades Principales**

### **1. Gestión de Comunidades**
```typescript
interface Community {
  id: string;
  name: string;
  description: string;
  slug: string;
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    theme: 'light' | 'dark' | 'custom';
    customCSS?: string;
  };
  subscription: {
    price: number;
    interval: 'monthly' | 'yearly';
    features: string[];
    trialDays?: number;
  };
  settings: {
    isPrivate: boolean;
    requiresApproval: boolean;
    allowGuestPosts: boolean;
    enableCourses: boolean;
    enableEvents: boolean;
  };
  stats: {
    totalMembers: number;
    onlineMembers: number;
    coursesCount: number;
    eventsCount: number;
  };
}
```

### **2. Sistema de Cursos**
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  modules: Module[];
  enrolledCount: number;
  rating: number;
  reviews: Review[];
  status: 'draft' | 'published';
  requirements: string[];
  learningObjectives: string[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
  duration: number;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  videoDuration?: number;
  resources: Resource[];
  quiz?: Quiz;
  order: number;
  isCompleted?: boolean;
  notes?: string[];
  bookmarks?: number[];
}
```

### **3. Sistema de Eventos**
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  type: 'webinar' | 'workshop' | 'meeting' | 'live_class' | 'community_call';
  startDate: Date;
  endDate: Date;
  timezone: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  maxAttendees?: number;
  currentAttendees: number;
  meetingLink?: string;
  location?: string;
  price: number;
  tags: string[];
  attendees: EventAttendee[];
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
}
```

### **4. Feed Social**
```typescript
interface Post {
  id: string;
  content: string;
  author: User;
  type: 'text' | 'image' | 'video' | 'poll' | 'link';
  attachments?: Attachment[];
  poll?: Poll;
  reactions: Reaction[];
  comments: Comment[];
  isPinned: boolean;
  createdAt: Date;
}
```

### **5. Sistema de Gamificación**
```typescript
interface UserProgress {
  userId: string;
  level: number;
  xp: number;
  badges: Badge[];
  achievements: Achievement[];
  streaks: {
    current: number;
    longest: number;
    lastActivity: Date;
  };
  leaderboardPosition: number;
}
```

---

## 📁 **Estructura del Proyecto**

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Dashboard protegido
│   ├── community/         # Páginas de comunidad
│   ├── courses/           # Sistema de cursos
│   ├── events/            # Calendario y eventos
│   └── api/               # API Routes
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes básicos (shadcn/ui)
│   ├── forms/            # Formularios
│   ├── layouts/          # Layouts de página
│   └── community/        # Componentes específicos
├── lib/                  # Utilidades y configuración
│   ├── supabase/         # Cliente de Supabase
│   ├── stripe/           # Configuración de Stripe
│   ├── validations/      # Schemas de Zod
│   └── utils/            # Funciones utilitarias
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
├── types/                # Tipos de TypeScript
└── styles/               # Estilos globales
```

---

## 🎯 **Diferenciadores vs Competencia**

| Característica | Skool | Mighty Networks | Discord | **EduCommunity** |
|----------------|-------|-----------------|---------|------------------|
| **Branding Personalizable** | ❌ | ⚠️ Limitado | ❌ | ✅ **Completo** |
| **Video Player Avanzado** | ❌ | ❌ | ❌ | ✅ **Con IA** |
| **Networking Inteligente** | ❌ | ❌ | ❌ | ✅ **Con IA** |
| **Múltiples Monetización** | ⚠️ | ⚠️ | ❌ | ✅ **Flexible** |
| **Analytics Profundos** | ❌ | ⚠️ | ❌ | ✅ **Completos** |
| **Mobile Experience** | ⚠️ | ✅ | ✅ | ✅ **Nativa** |
| **Certificaciones** | ❌ | ❌ | ❌ | ✅ **Automáticas** |

---

## 📊 **Modelo de Negocio**

### **Revenue Streams**
1. **SaaS Subscriptions** (B2B):
   - Free: 1 comunidad, 50 miembros
   - Pro ($49/mes): 3 comunidades, 500 miembros
   - Business ($149/mes): Ilimitado + analytics
   - Enterprise ($399/mes): White-label + soporte

2. **Transaction Fees** (B2C):
   - 5% en cursos pagos
   - 3% en eventos pagos
   - 2% en membresías premium

3. **Marketplace** (B2B2C):
   - Comisión por venta de cursos
   - Featured placement
   - Certificaciones premium

---

## 🚀 **Roadmap de Desarrollo**

### **✅ Fase 1 - MVP (Completada en Lovable.dev)**
- [x] Landing page con auth
- [x] Dashboard básico
- [x] Creación de comunidades
- [x] Feed social básico

### **🔄 Fase 2 - Core Features (En Desarrollo)**
- [ ] Sistema de cursos completo
- [ ] Calendario de eventos
- [ ] Video player básico
- [ ] Sistema de pagos (Stripe)
- [ ] Notificaciones in-app

### **🎯 Fase 3 - Advanced Features (Próximo)**
- [ ] Video player avanzado con notas
- [ ] AI recommendations
- [ ] Live streaming
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard

### **🚀 Fase 4 - Scale (Futuro)**
- [ ] White-label solutions
- [ ] Marketplace de creadores
- [ ] Integraciones avanzadas
- [ ] AI chatbots personalizados

---

## 👥 **Usuarios Objetivo**

### **Creadores de Contenido** (B2C)
- Influencers educativos
- Expertos en industrias específicas
- Coaches y consultores
- Artistas y creativos

### **Empresas** (B2B)
- Startups tech
- Consultoras
- Agencias de marketing
- Instituciones educativas

### **Estudiantes/Miembros** (B2C)
- Profesionales en crecimiento
- Emprendedores
- Estudiantes universitarios
- Entusiastas del aprendizaje

---

## 🔧 **Setup de Desarrollo**

### **Requisitos**
- Node.js 18+
- npm/yarn/pnpm
- Cuenta en Supabase
- Cuenta en Stripe (modo test)

### **Variables de Entorno**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### **Comandos Principales**
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run type-check   # Verificar tipos
npm run lint         # Linter
npm run db:migrate   # Migraciones de DB
```

---

## 📝 **Convenciones de Código**

### **Naming Conventions**
- **Componentes**: PascalCase (`CommunityCard.tsx`)
- **Hooks**: camelCase con prefijo use (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase con sufijo Type (`UserType.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### **Estructura de Componentes**
```typescript
// Template para componentes
interface ComponentProps {
  // Props aquí
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  // Estado local
  // Funciones
  // Effects
  
  return (
    // JSX
  );
}
```

### **Database Naming**
- **Tablas**: snake_case plural (`communities`, `course_enrollments`)
- **Columnas**: snake_case (`created_at`, `user_id`)
- **Índices**: `idx_table_column`
- **Foreign Keys**: `fk_table_referenced_table`

---

## 🤝 **Contribución**

### **Flujo de Desarrollo**
1. Crear branch desde `main`: `feature/nueva-funcionalidad`
2. Desarrollar con commits semánticos
3. Crear PR con descripción detallada
4. Code review y merge

### **Commits Semánticos**
- `feat:` Nueva funcionalidad
- `fix:` Bug fix
- `docs:` Documentación
- `style:` Formato/styling
- `refactor:` Refactoring
- `test:` Tests
- `chore:` Tareas de mantenimiento

---

## 📈 **Métricas Clave**

### **Product Metrics**
- Monthly Active Users (MAU)
- Course Completion Rate
- Community Engagement Rate
- Revenue per User (ARPU)
- Churn Rate

### **Technical Metrics**
- Page Load Speed (<2s)
- API Response Time (<500ms)
- Uptime (99.9%)
- Core Web Vitals scores

---

## 🔮 **Visión Futura**

EduCommunity aspira a convertirse en la **plataforma líder** para comunidades de aprendizaje online, combinando:

- **IA Personalizada**: Recommendations, matching y content curation
- **Realidad Virtual**: Espacios virtuales para eventos y clases
- **Blockchain**: Certificaciones verificables y NFTs
- **Global Scale**: Soporte multiidioma y multi-timezone
- **Enterprise**: Soluciones white-label para corporaciones

---

**🎯 El objetivo es crear la plataforma más completa y avanzada para comunidades educativas, superando a Skool en todos los aspectos técnicos y de experiencia de usuario.**