# 🎨 Sistema de Diseño Híbrido - EduCommunity

## 📋 Descripción General

EduCommunity utiliza un **sistema de colores híbrido** que adapta la paleta de colores según el contexto de cada página, optimizando la experiencia del usuario y la legibilidad.

## 🎯 Filosofía del Sistema

### **Enfoque Contextual**
- **Home y páginas generales**: Colores neutros para una primera impresión profesional
- **Dashboard y Cursos**: Colores vibrantes para mantener energía durante el aprendizaje
- **Comunidad**: Colores neutros con acentos para lectura prolongada

### **Beneficios**
- ✅ **Menos fatiga visual** en sesiones largas
- ✅ **Identidad de marca consistente**
- ✅ **Mejor accesibilidad** y contraste
- ✅ **Experiencia contextual** optimizada

## 🎨 Paletas de Colores

### **1. Colores Neutros (Home, páginas generales)**
```css
--neutral-50: 0 0% 98%   /* Fondo principal */
--neutral-100: 0 0% 96%  /* Fondo secundario */
--neutral-200: 0 0% 90%  /* Bordes */
--neutral-300: 0 0% 83%  /* Texto secundario */
--neutral-400: 0 0% 64%  /* Placeholders */
--neutral-500: 0 0% 45%  /* Texto principal */
--neutral-600: 0 0% 32%  /* Texto fuerte */
--neutral-700: 0 0% 25%  /* Texto muy fuerte */
--neutral-800: 0 0% 15%  /* Fondo oscuro */
--neutral-900: 0 0% 9%   /* Fondo muy oscuro */
--neutral-950: 0 0% 4%   /* Negro puro */
```

### **2. Colores Vibrantes (Dashboard, Cursos)**
```css
--vibrant-50: 220 100% 98%   /* Fondo muy claro */
--vibrant-100: 220 100% 95%  /* Fondo claro */
--vibrant-200: 220 100% 90%  /* Bordes claros */
--vibrant-300: 220 100% 80%  /* Acentos suaves */
--vibrant-400: 220 100% 70%  /* Acentos medios */
--vibrant-500: 220 100% 60%  /* Color principal */
--vibrant-600: 220 100% 50%  /* Color secundario */
--vibrant-700: 220 100% 40%  /* Color oscuro */
--vibrant-800: 220 100% 30%  /* Color muy oscuro */
--vibrant-900: 220 100% 20%  /* Color más oscuro */
```

### **3. Colores de Marca**
```css
--brand-primary: 220 100% 50%    /* Azul principal */
--brand-secondary: 262 83% 58%   /* Púrpura secundario */
--brand-accent: 220 100% 60%     /* Acento azul */
--brand-muted: 220 100% 95%      /* Azul suave */
```

## 🏗️ Contextos Específicos

### **Dashboard Theme**
```css
--dashboard-bg: 220 14% 9%       /* Fondo principal */
--dashboard-card: 220 14% 14%    /* Fondo de tarjetas */
--dashboard-border: 220 14% 20%  /* Bordes */
--dashboard-accent: 220 100% 60% /* Acentos */
```

### **Community Theme**
```css
--community-bg: 0 0% 9%          /* Fondo principal */
--community-card: 0 0% 14%       /* Fondo de tarjetas */
--community-border: 0 0% 20%     /* Bordes */
--community-accent: 220 100% 50% /* Acentos */
```

### **Course Theme**
```css
--course-bg: 220 14% 9%          /* Fondo principal */
--course-card: 220 14% 14%       /* Fondo de tarjetas */
--course-border: 220 14% 20%     /* Bordes */
--course-accent: 220 100% 60%    /* Acentos */
```

## 🎨 Clases Utilitarias

### **Gradientes**
```css
.gradient-vibrant    /* Gradiente vibrante */
.gradient-neutral    /* Gradiente neutro */
.gradient-brand      /* Gradiente de marca */
```

### **Temas Contextuales**
```css
.dashboard-theme      /* Tema del dashboard */
.community-theme      /* Tema de comunidad */
.course-theme         /* Tema de cursos */
.home-theme           /* Tema de home */
```

### **Cards Contextuales**
```css
.card-dashboard       /* Tarjeta del dashboard */
.card-community       /* Tarjeta de comunidad */
.card-course          /* Tarjeta de curso */
.card-home            /* Tarjeta de home */
```

### **Botones Contextuales**
```css
.btn-dashboard        /* Botón del dashboard */
.btn-community        /* Botón de comunidad */
.btn-course           /* Botón de curso */
.btn-home             /* Botón de home */
```

### **Texto con Gradiente**
```css
.text-gradient-vibrant  /* Texto con gradiente vibrante */
.text-gradient-neutral  /* Texto con gradiente neutro */
.text-gradient-brand    /* Texto con gradiente de marca */
```

## 🎭 Estados y Feedback

### **Estados**
```css
--success: 142 76% 36%   /* Verde éxito */
--warning: 38 92% 50%    /* Amarillo advertencia */
--error: 0 84% 60%       /* Rojo error */
--info: 220 100% 50%     /* Azul información */
```

### **Efectos y Animaciones**
```css
.shadow-elegant        /* Sombra elegante */
.shadow-glow           /* Sombra con brillo */
.shadow-brand          /* Sombra de marca */
.transition-smooth     /* Transición suave */
```

## 📱 Responsive Design

### **Breakpoints**
- **Mobile First**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: 1440px+

### **Tipografía**
```css
font-family: 'Inter', sans-serif;
font-feature-settings: "rlig" 1, "calt" 1;
```

## 🎯 Guías de Uso

### **Cuándo usar cada tema:**

1. **Home Theme** (`home-theme`)
   - Páginas de landing
   - Páginas de marketing
   - Formularios de contacto
   - Páginas de información

2. **Dashboard Theme** (`dashboard-theme`)
   - Dashboard principal
   - Páginas de administración
   - Paneles de control
   - Áreas de trabajo

3. **Community Theme** (`community-theme`)
   - Foros de discusión
   - Feeds de contenido
   - Páginas de comunidad
   - Áreas de lectura

4. **Course Theme** (`course-theme`)
   - Páginas de cursos
   - Reproductores de video
   - Contenido educativo
   - Áreas de aprendizaje

### **Ejemplos de Implementación**

```tsx
// Página Home
<div className="home-theme min-h-screen">
  <div className="card-home p-6">
    <button className="btn-home px-4 py-2">
      Acción
    </button>
  </div>
</div>

// Página Dashboard
<div className="dashboard-theme min-h-screen">
  <div className="card-dashboard p-6">
    <button className="btn-dashboard px-4 py-2">
      Acción
    </button>
  </div>
</div>

// Página Community
<div className="community-theme min-h-screen">
  <div className="card-community p-6">
    <button className="btn-community px-4 py-2">
      Acción
    </button>
  </div>
</div>
```

## 🔧 Configuración

### **Tailwind Config**
```javascript
// tailwind.config.ts
colors: {
  neutral: {
    50: "hsl(var(--neutral-50))",
    // ... más colores
  },
  vibrant: {
    50: "hsl(var(--vibrant-50))",
    // ... más colores
  },
  // ... más configuraciones
}
```

### **CSS Variables**
```css
/* src/index.css */
:root {
  --neutral-50: 0 0% 98%;
  --vibrant-500: 220 100% 60%;
  /* ... más variables */
}
```

## 🚀 Próximos Pasos

1. **Implementar modo oscuro/claro**
2. **Añadir más variantes de componentes**
3. **Crear sistema de iconografía**
4. **Desarrollar componentes de formulario**
5. **Implementar animaciones avanzadas**

---

*Este sistema de diseño está en constante evolución. Las actualizaciones se documentarán aquí.* 