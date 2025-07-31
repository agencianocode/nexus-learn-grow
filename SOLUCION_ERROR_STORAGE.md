# 🔧 Solución del Error: "new row violates row-level security policy"

## 🚨 Problema Identificado

El error que estás viendo:
```
Error al subir Acerca.png: Error al subir archivo: new row violates row-level security policy
```

**Significa que las políticas de seguridad de Supabase Storage no están configuradas.**

## ✅ Solución Paso a Paso

### Paso 1: Ir al Dashboard de Supabase

1. Abre tu dashboard de Supabase
2. Ve a tu proyecto
3. Navega a **SQL Editor** en el menú lateral

### Paso 2: Crear el Bucket

Ejecuta este SQL para crear el bucket:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-media', 'course-media', true)
ON CONFLICT (id) DO NOTHING;
```

### Paso 3: Aplicar Políticas de Seguridad

Copia y pega **TODO** este script en el SQL Editor:

```sql
-- Política para permitir a usuarios autenticados subir archivos
CREATE POLICY "Users can upload files to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política para permitir a usuarios autenticados ver sus propios archivos
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'course-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política para permitir a usuarios autenticados eliminar sus propios archivos
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política para permitir acceso público a archivos (solo lectura)
CREATE POLICY "Public can view course media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'course-media');
```

### Paso 4: Verificar que Funcionó

Ejecuta esta consulta para verificar que las políticas se crearon:

```sql
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%course-media%';
```

Deberías ver 4 políticas listadas.

### Paso 5: Probar de Nuevo

1. Ve a: `http://localhost:8085/storage-test`
2. Inicia sesión con tu cuenta de Supabase
3. Intenta subir un archivo
4. ¡Ya no debería aparecer el error!

## 🔍 Verificación Adicional

### Verificar el Bucket

```sql
SELECT * FROM storage.buckets WHERE id = 'course-media';
```

### Verificar Políticas

```sql
SELECT * FROM storage.policies WHERE bucket_id = 'course-media';
```

## 🚨 Si el Error Persiste

### Opción 1: Usar el Script Completo

Si el script simple no funciona, usa el archivo completo:
`supabase/storage-policies.sql`

### Opción 2: Verificar Variables de Entorno

Asegúrate de que tu `.env.local` tenga:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### Opción 3: Verificar Autenticación

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Application" → "Local Storage"
3. Verifica que tengas un token de Supabase

## 📞 Soporte

Si después de seguir estos pasos el error persiste:

1. Verifica que ejecutaste **TODAS** las políticas
2. Confirma que el bucket `course-media` existe
3. Verifica que estás autenticado en la aplicación
4. Revisa la consola del navegador para más detalles

---

**¡Con estas políticas aplicadas, la subida de archivos debería funcionar perfectamente!** 🎉 