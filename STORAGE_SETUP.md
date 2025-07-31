# 🗄️ Configuración de Supabase Storage

## 📋 Pasos para Configurar

### 1. Crear Bucket en Supabase

1. Ve a tu dashboard de Supabase
2. Navega a **Storage** en el menú lateral
3. Haz clic en **"Create a new bucket"**
4. Configura el bucket:
   - **Name**: `course-media`
   - **Public bucket**: ✅ Marcar como público
   - **File size limit**: 100MB (o el límite que prefieras)
   - **Allowed MIME types**: Dejar vacío para permitir todos

### 2. Aplicar Políticas de Seguridad (IMPORTANTE)

**⚠️ Este paso es CRÍTICO para que funcione la subida de archivos**

1. Ve a **SQL Editor** en tu dashboard de Supabase
2. Copia y pega todo el contenido del archivo `supabase/storage-policies.sql`
3. Ejecuta el script completo
4. Verifica que no haya errores en la ejecución

**Si no aplicas estas políticas, verás el error: "new row violates row-level security policy"**

### 3. Verificar Variables de Entorno

Asegúrate de que tu archivo `.env.local` contenga:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

## 🧪 Probar la Integración

### 1. Acceder a la Página de Prueba

1. Inicia el servidor de desarrollo: `npm run dev`
2. Ve a: `http://localhost:8085/storage-test` (puerto actualizado)
3. Inicia sesión con tu cuenta de Supabase

### 2. Probar Funcionalidades

#### ✅ Subida de Archivos
- Arrastra archivos de imagen, video o audio
- Verifica el progreso de subida
- Confirma las notificaciones de éxito

#### ✅ Biblioteca de Archivos
- Cambia a la pestaña "Biblioteca"
- Verifica que aparezcan los archivos subidos
- Prueba la vista previa de imágenes y videos

#### ✅ Eliminación de Archivos
- Haz clic en "Eliminar" en cualquier archivo
- Confirma que se elimine de la lista

### 3. Verificar en Supabase Dashboard

1. Ve a **Storage** → **course-media**
2. Verifica que los archivos se almacenen en la estructura: `{user_id}/{timestamp}-{random_id}.{extension}`
3. Confirma que las URLs públicas funcionen

## 🔧 Solución de Problemas

### Error: "new row violates row-level security policy"
**Solución**: Aplicar las políticas de seguridad del archivo `supabase/storage-policies.sql`

```sql
-- Ejecutar en SQL Editor de Supabase
-- Copiar todo el contenido de supabase/storage-policies.sql
```

### Error: "Bucket not found"
```bash
# Verificar que el bucket existe
# En SQL Editor de Supabase:
SELECT * FROM storage.buckets WHERE id = 'course-media';
```

### Error: "Policy not found"
```bash
# Verificar políticas
# En SQL Editor de Supabase:
SELECT * FROM storage.policies WHERE bucket_id = 'course-media';
```

### Error: "Unauthorized"
- Verificar que el usuario esté autenticado
- Confirmar que las variables de entorno sean correctas
- Verificar que las políticas de seguridad estén aplicadas

### Error: "File too large"
- Aumentar el límite de tamaño en el bucket
- Verificar la validación en el código

## 📊 Estructura de Archivos

```
course-media/
├── {user_id}/
│   ├── {timestamp}-{random_id}.jpg
│   ├── {timestamp}-{random_id}.mp4
│   └── {timestamp}-{random_id}.pdf
```

## 🔒 Políticas de Seguridad

### Usuarios Autenticados
- ✅ Pueden subir archivos a su carpeta personal
- ✅ Pueden ver sus propios archivos
- ✅ Pueden eliminar sus propios archivos
- ✅ Pueden actualizar sus propios archivos

### Acceso Público
- ✅ Cualquiera puede ver archivos (necesario para cursos)
- ❌ No pueden subir, eliminar o modificar

### Validación
- ✅ Tipos de archivo permitidos
- ✅ Tamaño máximo configurable
- ✅ Nombres únicos generados automáticamente

## 🚀 Próximos Pasos

1. **Optimización de Videos**: Implementar compresión automática
2. **CDN**: Integrar Cloudflare para mejor rendimiento
3. **Compresión de Imágenes**: Redimensionamiento automático
4. **Backup**: Estrategia de respaldo de archivos
5. **Analytics**: Métricas de uso de almacenamiento

## 📞 Soporte

Si encuentras problemas:

1. Verifica la consola del navegador para errores
2. Revisa los logs de Supabase
3. Confirma que todas las políticas estén aplicadas
4. Verifica la conectividad con Supabase

---

**¡La integración está lista para usar!** 🎉 