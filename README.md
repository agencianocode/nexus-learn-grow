# 🎓 EduCommunity - Plataforma de Aprendizaje NoCode + IA

## 📋 Descripción

EduCommunity es una plataforma educativa moderna que combina **NoCode** e **Inteligencia Artificial** para crear una experiencia de aprendizaje única. Desarrollada con React, TypeScript, Tailwind CSS y Supabase.

## ✨ Características Principales

### 🎨 **Sistema de Diseño Híbrido**
- **Colores neutros** para Home y páginas generales
- **Colores vibrantes** para Dashboard y Cursos
- **Colores contextuales** para Community
- **Responsive design** mobile-first

### 🏗️ **Arquitectura**
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (Auth + Database + Storage)
- **Estado**: React Hooks + Context API

### 📱 **Páginas Implementadas**
- ✅ **Home** - Landing page con diseño neutro
- ✅ **Dashboard** - Panel principal con cursos y progreso
- ✅ **Community** - Feed de comunidad con posts
- ✅ **CourseLearn** - Reproductor de video y lecciones
- ✅ **Auth** - Sistema de autenticación

## 🚀 **Configuración Rápida**

### **Prerrequisitos**
```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

### **Instalación**
```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/nexus-learn-grow.git
cd nexus-learn-grow

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

### **Variables de Entorno**
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

## 🎨 **Sistema de Diseño**

### **Temas Contextuales**
```tsx
// Home - Colores neutros
<div className="home-theme min-h-screen">
  <div className="card-home p-6">
    <button className="btn-home px-4 py-2">Acción</button>
  </div>
</div>

// Dashboard - Colores vibrantes
<div className="dashboard-theme min-h-screen">
  <div className="card-dashboard p-6">
    <button className="btn-dashboard px-4 py-2">Acción</button>
  </div>
</div>

// Community - Colores neutros con acentos
<div className="community-theme min-h-screen">
  <div className="card-community p-6">
    <button className="btn-community px-4 py-2">Acción</button>
  </div>
</div>
```

### **Clases Utilitarias**
- `.gradient-vibrant` - Gradiente vibrante
- `.gradient-neutral` - Gradiente neutro
- `.text-gradient-brand` - Texto con gradiente de marca
- `.shadow-elegant` - Sombra elegante
- `.transition-smooth` - Transición suave

## 📁 **Estructura del Proyecto**

```
nexus-learn-grow/
├── src/
│   ├── components/
│   │   ├── dashboard/          # Componentes del dashboard
│   │   ├── ui/                 # Componentes de UI base
│   │   └── Resources/          # Gestión de recursos
│   ├── hooks/                  # Custom hooks
│   ├── pages/                  # Páginas de la aplicación
│   ├── lib/                    # Utilidades y servicios
│   └── types/                  # Definiciones de tipos
├── supabase/                   # Configuración de Supabase
├── public/                     # Archivos estáticos
└── docs/                       # Documentación
```

## 🔄 **Sincronización con Lovable**

### **Flujo de Desarrollo**
1. **Desarrollo en Cursor.ai**
2. **Push a GitHub**
3. **Auto-deploy en Lovable**
4. **Test y feedback**
5. **Pull cambios a Cursor.ai**

### **Comandos de Sincronización**
```bash
# Desde Cursor.ai → Lovable
git add .
git commit -m "Update: [descripción]"
git push origin main

# Desde Lovable → Cursor.ai
git pull origin main
```

## 🛠️ **Scripts Disponibles**

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build

# Linting
npm run lint         # ESLint
npm run lint:fix     # ESLint con auto-fix

# TypeScript
npm run type-check   # Verificación de tipos
```

## 🎯 **Próximos Pasos**

### **Backend (Prioridad Alta)**
- [ ] Sistema de autenticación completo
- [ ] API para cursos y usuarios
- [ ] Sistema de archivos para videos
- [ ] Base de datos optimizada

### **Frontend (Prioridad Media)**
- [ ] Sistema de notificaciones
- [ ] Chat en tiempo real
- [ ] Panel de administración
- [ ] Sistema de pagos

### **DevOps (Prioridad Baja)**
- [ ] CI/CD pipeline
- [ ] Testing automatizado
- [ ] Monitoreo y analytics
- [ ] Optimización de performance

## 🤝 **Contribución**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 **Contacto**

- **Desarrollador**: [Tu Nombre]
- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [@tu-usuario]

---

**EduCommunity** - Transformando la educación con NoCode e IA 🚀