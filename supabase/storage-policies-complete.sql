-- Políticas de Storage para EduCommunity
-- Ejecutar en SQL Editor de Supabase

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

-- Políticas para bucket 'resources'
CREATE POLICY "Users can upload resources" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'resources' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view resources" ON storage.objects
FOR SELECT USING (
  bucket_id = 'resources'
);

CREATE POLICY "Users can update own resources" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'resources' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete own resources" ON storage.objects
FOR DELETE USING (
  bucket_id = 'resources' AND 
  auth.uid() IS NOT NULL
); 