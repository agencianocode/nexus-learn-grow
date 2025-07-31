-- Políticas de seguridad para Supabase Storage
-- Ejecutar en el SQL Editor de Supabase

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

-- 4. Política para permitir a usuarios autenticados actualizar sus propios archivos
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'course-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Política para permitir a usuarios autenticados eliminar sus propios archivos
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Política para permitir acceso público a archivos (solo lectura)
CREATE POLICY "Public can view course media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'course-media');

-- 7. Función para obtener archivos de un usuario
CREATE OR REPLACE FUNCTION get_user_files(user_id UUID)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  url TEXT,
  size BIGINT,
  type TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.name as id,
    o.name as name,
    storage.url('course-media', o.name) as url,
    o.metadata->>'size' as size,
    o.metadata->>'mimetype' as type,
    o.created_at,
    o.updated_at
  FROM storage.objects o
  WHERE o.bucket_id = 'course-media'
    AND (storage.foldername(o.name))[1] = user_id::text
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Función para obtener estadísticas de archivos de un usuario
CREATE OR REPLACE FUNCTION get_user_storage_stats(user_id UUID)
RETURNS TABLE (
  total_files BIGINT,
  total_size BIGINT,
  file_types JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_files,
    COALESCE(SUM((metadata->>'size')::BIGINT), 0) as total_size,
    jsonb_object_agg(
      COALESCE(metadata->>'mimetype', 'unknown'),
      COUNT(*)
    ) as file_types
  FROM storage.objects
  WHERE bucket_id = 'course-media'
    AND (storage.foldername(name))[1] = user_id::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Trigger para limpiar archivos huérfanos cuando se elimina un usuario
CREATE OR REPLACE FUNCTION cleanup_user_files()
RETURNS TRIGGER AS $$
BEGIN
  -- Eliminar archivos del usuario eliminado
  DELETE FROM storage.objects
  WHERE bucket_id = 'course-media'
    AND (storage.foldername(name))[1] = OLD.id::text;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger si no existe
DROP TRIGGER IF EXISTS on_user_delete ON auth.users;
CREATE TRIGGER on_user_delete
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_user_files();

-- 10. Función para validar tipos de archivo permitidos
CREATE OR REPLACE FUNCTION validate_file_type(file_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN file_type IN (
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/ogg',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
END;
$$ LANGUAGE plpgsql;

-- 11. Política adicional para validar tipos de archivo
CREATE POLICY "Validate file types on upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-media' AND
  validate_file_type(metadata->>'mimetype')
);

-- Comentarios sobre el uso:
-- 
-- 1. Los archivos se almacenan en la estructura: {user_id}/{timestamp}-{random_id}.{extension}
-- 2. Cada usuario solo puede acceder a sus propios archivos
-- 3. Los archivos son públicos para lectura (necesario para mostrar en cursos)
-- 4. Se incluyen funciones helper para obtener estadísticas y archivos
-- 5. Se incluye limpieza automática cuando se elimina un usuario
-- 6. Se valida el tipo de archivo en el servidor
--
-- Para usar en la aplicación:
-- - get_user_files(user_id) - Obtener archivos del usuario
-- - get_user_storage_stats(user_id) - Obtener estadísticas de almacenamiento 