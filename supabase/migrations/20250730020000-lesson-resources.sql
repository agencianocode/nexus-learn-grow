-- Sistema de Recursos para Lecciones
-- Migración: 20250730020000-lesson-resources.sql

-- Tabla de recursos de lecciones
CREATE TABLE IF NOT EXISTS lesson_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(100),
    resource_type VARCHAR(50) NOT NULL DEFAULT 'attachment', -- attachment, video, audio, document, link
    category VARCHAR(100),
    tags TEXT[], -- Array de tags para búsqueda
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Índices para optimizar búsquedas
    CONSTRAINT fk_lesson_resources_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_lesson_resources_lesson_id ON lesson_resources(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_type ON lesson_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_category ON lesson_resources(category);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_tags ON lesson_resources USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_created_at ON lesson_resources(created_at);

-- Tabla de estadísticas de uso de recursos
CREATE TABLE IF NOT EXISTS resource_usage_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_id UUID NOT NULL REFERENCES lesson_resources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- view, download, play
    action_timestamp TIMESTAMPTZ DEFAULT NOW(),
    session_duration INTEGER, -- en segundos para videos/audio
    device_info JSONB,
    ip_address INET,
    
    UNIQUE(resource_id, user_id, action_type, DATE(action_timestamp))
);

-- Índices para estadísticas
CREATE INDEX IF NOT EXISTS idx_resource_usage_resource_id ON resource_usage_stats(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_usage_user_id ON resource_usage_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_usage_action_type ON resource_usage_stats(action_type);
CREATE INDEX IF NOT EXISTS idx_resource_usage_timestamp ON resource_usage_stats(action_timestamp);

-- Tabla de categorías de recursos
CREATE TABLE IF NOT EXISTS resource_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Color en formato hex
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar categorías por defecto
INSERT INTO resource_categories (name, description, color, icon) VALUES
('Documentos', 'PDFs, Word, PowerPoint, etc.', '#EF4444', 'file-text'),
('Videos', 'Videos educativos y tutoriales', '#10B981', 'video'),
('Audio', 'Podcasts y audios explicativos', '#F59E0B', 'headphones'),
('Imágenes', 'Infografías, diagramas, fotos', '#8B5CF6', 'image'),
('Enlaces', 'Recursos externos y referencias', '#06B6D4', 'link'),
('Ejercicios', 'Actividades y prácticas', '#84CC16', 'book-open'),
('Plantillas', 'Archivos descargables reutilizables', '#F97316', 'download'),
('Código', 'Scripts y ejemplos de código', '#6366F1', 'code');

-- Función para actualizar estadísticas automáticamente
CREATE OR REPLACE FUNCTION update_resource_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar contadores en lesson_resources
    IF NEW.action_type = 'view' THEN
        UPDATE lesson_resources 
        SET view_count = view_count + 1
        WHERE id = NEW.resource_id;
    ELSIF NEW.action_type = 'download' THEN
        UPDATE lesson_resources 
        SET download_count = download_count + 1
        WHERE id = NEW.resource_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estadísticas
CREATE TRIGGER trigger_update_resource_stats
    AFTER INSERT ON resource_usage_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_resource_stats();

-- Función para obtener estadísticas de recursos
CREATE OR REPLACE FUNCTION get_resource_stats(resource_id UUID)
RETURNS TABLE (
    total_views BIGINT,
    total_downloads BIGINT,
    unique_users BIGINT,
    avg_session_duration NUMERIC,
    recent_activity JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(CASE WHEN rus.action_type = 'view' THEN 1 END) as total_views,
        COUNT(CASE WHEN rus.action_type = 'download' THEN 1 END) as total_downloads,
        COUNT(DISTINCT rus.user_id) as unique_users,
        AVG(rus.session_duration) as avg_session_duration,
        jsonb_agg(
            jsonb_build_object(
                'action_type', rus.action_type,
                'timestamp', rus.action_timestamp,
                'user_id', rus.user_id
            ) ORDER BY rus.action_timestamp DESC LIMIT 10
        ) as recent_activity
    FROM resource_usage_stats rus
    WHERE rus.resource_id = get_resource_stats.resource_id;
END;
$$ LANGUAGE plpgsql;

-- Función para buscar recursos
CREATE OR REPLACE FUNCTION search_resources(
    search_term TEXT,
    lesson_id UUID DEFAULT NULL,
    resource_type VARCHAR(50) DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    tags TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    lesson_id UUID,
    title VARCHAR(255),
    description TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(100),
    resource_type VARCHAR(50),
    category VARCHAR(100),
    tags TEXT[],
    is_public BOOLEAN,
    download_count INTEGER,
    view_count INTEGER,
    order_index INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    relevance_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lr.*,
        CASE 
            WHEN search_term IS NOT NULL AND (
                lr.title ILIKE '%' || search_term || '%' OR
                lr.description ILIKE '%' || search_term || '%' OR
                lr.tags && string_to_array(search_term, ' ')
            ) THEN 1.0
            ELSE 0.5
        END as relevance_score
    FROM lesson_resources lr
    WHERE (lesson_id IS NULL OR lr.lesson_id = search_resources.lesson_id)
        AND (resource_type IS NULL OR lr.resource_type = search_resources.resource_type)
        AND (category IS NULL OR lr.category = search_resources.category)
        AND (tags IS NULL OR lr.tags && search_resources.tags)
        AND (
            search_term IS NULL OR
            lr.title ILIKE '%' || search_term || '%' OR
            lr.description ILIKE '%' || search_term || '%' OR
            lr.tags && string_to_array(search_term, ' ')
        )
    ORDER BY relevance_score DESC, lr.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Políticas RLS para lesson_resources
ALTER TABLE lesson_resources ENABLE ROW LEVEL SECURITY;

-- Usuarios autenticados pueden ver recursos de lecciones en las que están inscritos
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

-- Instructores pueden gestionar recursos de sus cursos
CREATE POLICY "Instructors can manage lesson resources"
ON lesson_resources FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM courses c
        JOIN modules m ON m.course_id = c.id
        JOIN lessons l ON l.module_id = m.id
        WHERE c.instructor_id = auth.uid()
        AND l.id = lesson_resources.lesson_id
    )
);

-- Políticas RLS para resource_usage_stats
ALTER TABLE resource_usage_stats ENABLE ROW LEVEL SECURITY;

-- Usuarios solo pueden ver sus propias estadísticas
CREATE POLICY "Users can view own usage stats"
ON resource_usage_stats FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Usuarios pueden insertar sus propias estadísticas
CREATE POLICY "Users can insert own usage stats"
ON resource_usage_stats FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Políticas RLS para resource_categories
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver categorías activas
CREATE POLICY "Anyone can view active categories"
ON resource_categories FOR SELECT
TO public
USING (is_active = true);

-- Administradores pueden gestionar categorías
CREATE POLICY "Admins can manage categories"
ON resource_categories FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- Comentarios sobre el uso
COMMENT ON TABLE lesson_resources IS 'Recursos adjuntos a lecciones (archivos, enlaces, etc.)';
COMMENT ON TABLE resource_usage_stats IS 'Estadísticas de uso de recursos por usuario';
COMMENT ON TABLE resource_categories IS 'Categorías para organizar recursos';
COMMENT ON FUNCTION search_resources IS 'Función para buscar recursos con filtros múltiples';
COMMENT ON FUNCTION get_resource_stats IS 'Función para obtener estadísticas de un recurso'; 