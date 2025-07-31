-- Script simplificado para configurar Supabase Storage
-- Ejecutar en SQL Editor de Supabase

-- 1. Crear el bucket si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-media', 'course-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Política para permitir a usuarios autenticados subir archivos
CREATE POLICY "Users can upload files to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Política para permitir a usuarios autenticados ver sus propios archivos
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'course-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Política para permitir a usuarios autenticados eliminar sus propios archivos
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Política para permitir acceso público a archivos (solo lectura)
CREATE POLICY "Public can view course media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'course-media');

-- Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%course-media%'; 