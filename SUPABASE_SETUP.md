# 🚀 Configuración Completa de Supabase

## 📋 **Paso 1: Crear Variables de Entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://kcoqztwcdqjtvypgbbdo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjb3F6dHdjZHFqdHZ5cGdiYmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTUwODcsImV4cCI6MjA2OTM5MTA4N30.DdpcybN4YwfpZHPW5yd81x7MS0Ip2dbpyouD4i2Xrsw

# Stripe Configuration (para futuras integraciones)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# Email Configuration (para futuras integraciones)
VITE_RESEND_API_KEY=your_resend_key_here

# Analytics (para futuras integraciones)
VITE_MIXPANEL_TOKEN=your_mixpanel_token_here
VITE_POSTHOG_KEY=your_posthog_key_here

# AI Integration (para futuras integraciones)
VITE_OPENAI_API_KEY=your_openai_key_here

# Video Platform (para futuras integraciones)
VITE_VIMEO_CLIENT_ID=your_vimeo_client_id_here
VITE_VIMEO_CLIENT_SECRET=your_vimeo_client_secret_here
```

## 📋 **Paso 2: Aplicar Migraciones en Supabase**

### 2.1 Ir al Dashboard de Supabase
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: `kcoqztwcdqjtvypgbbdo`
3. Ve a **SQL Editor**

### 2.2 Ejecutar Migraciones en Orden

#### **Migración 1: Estructura Base**
```sql
-- Copia y pega el contenido de: supabase/migrations/20250729190830-9be1bb26-db91-4d61-9836-a3f8854a921a.sql
```

#### **Migración 2: Módulos y Lecciones**
```sql
-- Copia y pega el contenido de: supabase/migrations/20250729190851-0bfc5d04-d1d6-4e9e-b5fa-229d041a3179.sql
```

#### **Migración 3: Enrollments**
```sql
-- Copia y pega el contenido de: supabase/migrations/20250729190917-d214242d-cbaf-42df-b316-07253657a475.sql
```

#### **Migración 4: Comentarios y Likes**
```sql
-- Copia y pega el contenido de: supabase/migrations/20250730010418-7ec8441b-5575-4207-9bda-06b9865df325.sql
```

#### **Migración 5: Sistema de Recursos**
```sql
-- Copia y pega el contenido de: supabase/migrations/20250730020000-lesson-resources.sql
```

## 📋 **Paso 3: Configurar Storage Policies**

### 3.1 Políticas de Storage Básicas
```sql
-- Políticas para bucket 'course-media'
CREATE POLICY "Users can upload course media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-media' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view course media" ON storage.objects
FOR SELECT USING (
  bucket_id = 'course-media'
);

CREATE POLICY "Users can update own course media" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'course-media' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete own course media" ON storage.objects
FOR DELETE USING (
  bucket_id = 'course-media' AND 
  auth.uid() IS NOT NULL
);

-- Políticas para bucket 'avatars'
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view avatars" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars'
);

CREATE POLICY "Users can update own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid() IS NOT NULL
);
```

### 3.2 Crear Buckets de Storage
1. Ve a **Storage** en el dashboard de Supabase
2. Crea los siguientes buckets:
   - `course-media` (público)
   - `avatars` (público)
   - `resources` (público)

## 📋 **Paso 4: Configurar Autenticación**

### 4.1 Configurar Auth Settings
1. Ve a **Authentication > Settings**
2. Configura:
   - **Site URL**: `http://localhost:8080`
   - **Redirect URLs**: 
     - `http://localhost:8080/auth`
     - `http://localhost:8080/dashboard`
   - **Enable email confirmations**: Desactivado (para desarrollo)

### 4.2 Configurar Providers (Opcional)
1. **Google OAuth**: Para desarrollo rápido
2. **GitHub OAuth**: Para desarrolladores

## 📋 **Paso 5: Verificar Configuración**

### 5.1 Probar Conexión
1. Reinicia el servidor de desarrollo: `npm run dev`
2. Ve a `http://localhost:8080/auth`
3. Intenta registrarte con un email

### 5.2 Verificar Tablas
En el **SQL Editor**, ejecuta:
```sql
-- Verificar que las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### 5.3 Verificar Storage
1. Ve a **Storage** en el dashboard
2. Verifica que los buckets existen
3. Intenta subir un archivo de prueba

## 📋 **Paso 6: Datos de Prueba (Opcional)**

### 6.1 Insertar Datos de Prueba
```sql
-- Insertar categorías de recursos por defecto
INSERT INTO resource_categories (name, description, color, icon) VALUES
('Documentos', 'PDFs, Word, PowerPoint, etc.', '#EF4444', 'file-text'),
('Videos', 'Videos educativos y tutoriales', '#10B981', 'video'),
('Audio', 'Podcasts y audios explicativos', '#F59E0B', 'headphones'),
('Imágenes', 'Infografías, diagramas, fotos', '#8B5CF6', 'image'),
('Enlaces', 'Recursos externos y referencias', '#06B6D4', 'link'),
('Ejercicios', 'Actividades y prácticas', '#84CC16', 'book-open'),
('Plantillas', 'Archivos descargables reutilizables', '#F97316', 'download'),
('Código', 'Scripts y ejemplos de código', '#6366F1', 'code');
```

## ✅ **Verificación Final**

### ✅ Checklist de Configuración:
- [ ] Variables de entorno creadas
- [ ] Migraciones aplicadas sin errores
- [ ] Storage policies configuradas
- [ ] Buckets de storage creados
- [ ] Autenticación configurada
- [ ] Registro de usuarios funciona
- [ ] Subida de archivos funciona
- [ ] Base de datos accesible

### 🚨 **Solución de Problemas Comunes:**

#### Error: "new row violates row-level security policy"
- Verifica que las políticas RLS estén aplicadas
- Asegúrate de que el usuario esté autenticado

#### Error: "bucket not found"
- Verifica que los buckets existan en Storage
- Confirma que las políticas de storage estén aplicadas

#### Error: "relation does not exist"
- Verifica que las migraciones se ejecutaron correctamente
- Revisa el orden de las migraciones

## 🎉 **¡Configuración Completada!**

Una vez completados todos los pasos, tu aplicación EduCommunity estará completamente configurada con:

- ✅ Autenticación de usuarios
- ✅ Base de datos estructurada
- ✅ Storage para archivos
- ✅ Sistema de recursos
- ✅ Políticas de seguridad
- ✅ Datos de prueba

**¡Ahora puedes probar todas las funcionalidades!** 