# Sistema de Recursos - EduCommunity

## 📋 **Resumen**

El **Sistema de Recursos** es una funcionalidad completa para gestionar archivos, enlaces y contenido multimedia asociado a las lecciones de los cursos. Proporciona una interfaz intuitiva para instructores y estudiantes, con capacidades avanzadas de búsqueda, categorización y análisis.

## 🎯 **Funcionalidades Principales**

### ✅ **Gestión de Archivos Adjuntos**
- Subida de archivos multimedia (PDF, Word, PowerPoint, videos, audio, imágenes)
- Integración con Supabase Storage
- Validación de tipos y tamaños de archivo
- Progreso de subida en tiempo real
- Vista previa de archivos

### ✅ **Categorización de Recursos**
- Categorías predefinidas (Documentos, Videos, Audio, Imágenes, Enlaces, etc.)
- Etiquetas personalizadas para búsqueda avanzada
- Organización por tipo de recurso
- Filtros dinámicos

### ✅ **Control de Acceso por Lección**
- Recursos públicos y privados
- Políticas RLS (Row-Level Security) en Supabase
- Acceso basado en inscripción al curso
- Permisos diferenciados para instructores y estudiantes

### ✅ **Búsqueda y Filtros**
- Búsqueda por texto en título, descripción y etiquetas
- Filtros por categoría, tipo de recurso, visibilidad
- Ordenamiento por relevancia, fecha, popularidad
- Vista de cuadrícula y lista

### ✅ **Estadísticas de Uso**
- Contadores de vistas y descargas
- Analytics detallados por período
- Usuarios más activos
- Recursos más populares
- Gráficos de actividad diaria

## 🏗️ **Arquitectura**

### **Base de Datos**

#### **Tabla: `lesson_resources`**
```sql
CREATE TABLE lesson_resources (
    id UUID PRIMARY KEY,
    lesson_id UUID REFERENCES lessons(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(100),
    resource_type VARCHAR(50) DEFAULT 'attachment',
    category VARCHAR(100),
    tags TEXT[],
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **Tabla: `resource_usage_stats`**
```sql
CREATE TABLE resource_usage_stats (
    id UUID PRIMARY KEY,
    resource_id UUID REFERENCES lesson_resources(id),
    user_id UUID REFERENCES auth.users(id),
    action_type VARCHAR(50) NOT NULL,
    action_timestamp TIMESTAMPTZ DEFAULT NOW(),
    session_duration INTEGER,
    device_info JSONB,
    ip_address INET
);
```

#### **Tabla: `resource_categories`**
```sql
CREATE TABLE resource_categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Componentes React**

#### **📁 ResourceManager**
- Componente principal que orquesta toda la funcionalidad
- Gestiona el estado global de recursos
- Maneja las acciones CRUD
- Integra estadísticas y analytics

#### **📋 ResourceList**
- Lista de recursos con filtros avanzados
- Búsqueda en tiempo real
- Vista de cuadrícula y lista
- Ordenamiento dinámico

#### **🃏 ResourceCard**
- Tarjeta individual para cada recurso
- Acciones de vista, descarga, edición, eliminación
- Estadísticas de uso
- Preview de archivos

#### **📤 ResourceUploader**
- Formulario de subida/edición de recursos
- Integración con MediaUploader
- Validación de tipos de archivo
- Gestión de etiquetas

#### **📊 ResourceStats**
- Analytics detallados
- Gráficos de actividad
- Métricas de uso
- Rankings de popularidad

### **Hooks Personalizados**

#### **🎣 useResources**
```typescript
const {
  resources,
  categories,
  loading,
  createResource,
  updateResource,
  deleteResource,
  searchResources,
  recordResourceUsage,
  getResourceStats,
  getResourceAnalytics
} = useResources();
```

## 🔧 **Configuración**

### **1. Migración de Base de Datos**

Ejecuta la migración en Supabase:

```sql
-- Ejecutar en SQL Editor de Supabase
-- Archivo: supabase/migrations/20250730020000-lesson-resources.sql
```

### **2. Políticas RLS**

Las políticas de seguridad están incluidas en la migración:

- **Usuarios autenticados** pueden ver recursos de lecciones en las que están inscritos
- **Instructores** pueden gestionar recursos de sus cursos
- **Estadísticas** solo son visibles para el usuario propietario
- **Categorías** son públicas para todos los usuarios autenticados

### **3. Integración con Storage**

El sistema utiliza el bucket `course-media` de Supabase Storage:

```typescript
// Configuración automática en useStorage hook
const bucketName = 'course-media';
```

## 🚀 **Uso**

### **Para Instructores**

1. **Agregar Recursos**
   ```typescript
   <ResourceManager 
     lessonId="lesson-123"
     lessonTitle="Introducción a React"
   />
   ```

2. **Gestionar Recursos Existentes**
   - Editar metadatos
   - Cambiar archivos
   - Actualizar categorías y etiquetas
   - Configurar visibilidad

3. **Ver Estadísticas**
   - Analytics detallados
   - Uso por estudiante
   - Recursos más populares

### **Para Estudiantes**

1. **Explorar Recursos**
   - Lista filtrable de recursos
   - Búsqueda por texto
   - Filtros por tipo y categoría

2. **Acceder a Contenido**
   - Vista previa de archivos
   - Descarga directa
   - Reproducción de multimedia

3. **Seguir Progreso**
   - Historial de uso
   - Recursos favoritos
   - Actividad reciente

## 📊 **Analytics y Métricas**

### **Métricas Principales**
- **Total de recursos** por lección
- **Vistas y descargas** por período
- **Usuarios únicos** activos
- **Tipos de recursos** más populares

### **Gráficos Disponibles**
- **Vistas diarias** - Actividad de visualización
- **Descargas diarias** - Actividad de descarga
- **Recursos populares** - Ranking por uso
- **Usuarios activos** - Engagement por usuario

### **Filtros de Tiempo**
- 7 días
- 30 días
- 90 días

## 🔍 **Búsqueda y Filtros**

### **Filtros Disponibles**
- **Texto libre** - Búsqueda en título, descripción, etiquetas
- **Categoría** - Filtrar por categoría específica
- **Tipo de recurso** - Documentos, videos, audio, imágenes, enlaces
- **Visibilidad** - Públicos o privados
- **Ordenamiento** - Relevancia, fecha, título, popularidad

### **Búsqueda Avanzada**
```typescript
const filters = {
  search_term: "react hooks",
  category: "Documentos",
  resource_type: "document",
  is_public: true,
  sortBy: "relevance",
  sortOrder: "desc"
};
```

## 🎨 **Interfaz de Usuario**

### **Diseño Responsivo**
- **Desktop** - Vista de cuadrícula con filtros avanzados
- **Tablet** - Layout adaptativo
- **Mobile** - Vista de lista optimizada

### **Estados de UI**
- **Loading** - Indicadores de carga
- **Empty** - Estados vacíos informativos
- **Error** - Manejo de errores con feedback
- **Success** - Confirmaciones de acciones

### **Accesibilidad**
- **Navegación por teclado** - Soporte completo
- **Screen readers** - Etiquetas ARIA
- **Contraste** - Cumple estándares WCAG
- **Responsive** - Adaptable a diferentes dispositivos

## 🔒 **Seguridad**

### **Políticas RLS**
```sql
-- Usuarios solo ven recursos de cursos inscritos
CREATE POLICY "Users can view lesson resources for enrolled courses"
ON lesson_resources FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM course_enrollments ce
    JOIN lessons l ON l.id = lesson_resources.lesson_id
    JOIN modules m ON m.id = l.module_id
    WHERE ce.user_id = auth.uid() 
    AND ce.course_id = m.course_id
    AND ce.status = 'enrolled'
  )
  OR is_public = true
);
```

### **Validación de Archivos**
- **Tipos permitidos** - Configurables por tipo de recurso
- **Tamaño máximo** - Límites configurables
- **Virus scanning** - Integración opcional
- **Compresión** - Optimización automática

## 📈 **Performance**

### **Optimizaciones**
- **Lazy loading** - Carga bajo demanda
- **Caching** - Cache de recursos frecuentes
- **Pagination** - Paginación para listas grandes
- **Debouncing** - Búsqueda optimizada

### **Métricas de Rendimiento**
- **Time to First Byte** < 200ms
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1

## 🧪 **Testing**

### **Página de Prueba**
Accede a `/resource-test` para probar todas las funcionalidades:

```typescript
// Ejemplo de uso
<ResourceTest />
```

### **Casos de Prueba**
- ✅ Subida de archivos
- ✅ Búsqueda y filtros
- ✅ Estadísticas
- ✅ Permisos de acceso
- ✅ Responsive design

## 🔄 **Integración con el Editor de Cursos**

El sistema se integra perfectamente con el **Editor de Cursos Avanzado**:

```typescript
// En DraggableLesson
<MediaSelector 
  value={lesson.video_url}
  onChange={(url) => updateLesson(lesson.id, { video_url: url })}
  type="video"
/>
```

## 📝 **Próximas Mejoras**

### **Fase 2 - Optimizaciones**
- [ ] Compresión automática de imágenes
- [ ] Optimización de videos
- [ ] CDN para mejor rendimiento
- [ ] Backup automático

### **Fase 3 - Funcionalidades Avanzadas**
- [ ] Comentarios en recursos
- [ ] Sistema de versiones
- [ ] Colaboración en tiempo real
- [ ] Integración con IA para etiquetado automático

### **Fase 4 - Analytics Avanzados**
- [ ] Heatmaps de uso
- [ ] Predicciones de popularidad
- [ ] Recomendaciones personalizadas
- [ ] Reportes automáticos

## 🎉 **Conclusión**

El **Sistema de Recursos** proporciona una solución completa y escalable para la gestión de contenido educativo. Con su arquitectura modular, interfaz intuitiva y capacidades analíticas avanzadas, es una herramienta esencial para cualquier plataforma de e-learning moderna.

---

**Desarrollado para EduCommunity** 🚀
*Plataforma de Comunidades y Cursos Online* 