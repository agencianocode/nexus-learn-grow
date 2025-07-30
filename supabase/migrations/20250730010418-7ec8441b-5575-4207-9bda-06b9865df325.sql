-- Create modules table
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT, -- HTML/Markdown content
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create lesson resources table
CREATE TABLE public.lesson_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL, -- 'pdf', 'link', 'document', etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create course enrollments table
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Create lesson progress table
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  watch_time_minutes INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Add new columns to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Beginner',
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS total_lessons INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_modules INTEGER DEFAULT 0;

-- Enable RLS on all new tables
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for modules
CREATE POLICY "Anyone can view modules of published courses" ON public.modules
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = modules.course_id 
    AND courses.is_published = true
  )
);

CREATE POLICY "Course creators can manage their modules" ON public.modules
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = modules.course_id 
    AND courses.creator_id = auth.uid()
  )
);

-- RLS Policies for lessons
CREATE POLICY "Anyone can view lessons of published courses" ON public.lessons
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.modules m ON m.course_id = c.id
    WHERE m.id = lessons.module_id 
    AND c.is_published = true
  )
);

CREATE POLICY "Course creators can manage their lessons" ON public.lessons
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.modules m ON m.course_id = c.id
    WHERE m.id = lessons.module_id 
    AND c.creator_id = auth.uid()
  )
);

-- RLS Policies for lesson resources
CREATE POLICY "Anyone can view resources of published lessons" ON public.lesson_resources
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.modules m ON m.course_id = c.id
    JOIN public.lessons l ON l.module_id = m.id
    WHERE l.id = lesson_resources.lesson_id 
    AND c.is_published = true
  )
);

CREATE POLICY "Course creators can manage their lesson resources" ON public.lesson_resources
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.modules m ON m.course_id = c.id
    JOIN public.lessons l ON l.module_id = m.id
    WHERE l.id = lesson_resources.lesson_id 
    AND c.creator_id = auth.uid()
  )
);

-- RLS Policies for course enrollments
CREATE POLICY "Users can view their own enrollments" ON public.course_enrollments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves in courses" ON public.course_enrollments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollment progress" ON public.course_enrollments
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for lesson progress
CREATE POLICY "Users can view their own lesson progress" ON public.lesson_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can track their own lesson progress" ON public.lesson_progress
FOR ALL USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();