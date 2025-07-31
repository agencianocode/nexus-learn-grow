import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AdvancedCourseEditor } from '@/components/CourseEditor/AdvancedCourseEditor';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  GripVertical,
  Save,
  Eye,
  BookOpen,
  Clock,
  Video,
  FileText
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order_index: number;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
}

export default function CreateCourse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: 0,
    level: 'Beginner',
    thumbnail_url: ''
  });

  const [modules, setModules] = useState<Module[]>([]);
  const [saving, setSaving] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  // Calculate course stats
  const courseStats = {
    totalModules: modules.length,
    totalLessons: modules.reduce((acc, module) => acc + module.lessons.length, 0),
    totalDuration: modules.reduce((acc, module) => 
      acc + module.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.duration_minutes, 0), 0
    ),
    hasVideo: modules.some(module => module.lessons.some(lesson => lesson.video_url)),
    hasContent: modules.some(module => module.lessons.some(lesson => lesson.content))
  };

  const saveCourse = async (publish: boolean = false) => {
    if (!courseData.title.trim()) {
      toast({
        title: "Error",
        description: "El título del curso es requerido",
        variant: "destructive"
      });
      return;
    }

    if (modules.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos un módulo al curso",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      // Create course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          creator_id: user.id,
          community_id: user.id, // For now, use user id as community id
          is_published: publish,
          total_modules: courseStats.totalModules,
          total_lessons: courseStats.totalLessons,
          duration_minutes: courseStats.totalDuration
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Create modules and lessons
      for (const [moduleIndex, module] of modules.entries()) {
        if (!module.title.trim()) continue;

        const { data: createdModule, error: moduleError } = await supabase
          .from('modules')
          .insert({
            course_id: course.id,
            title: module.title,
            description: module.description,
            order_index: moduleIndex
          })
          .select()
          .single();

        if (moduleError) throw moduleError;

        // Create lessons for this module
        for (const [lessonIndex, lesson] of module.lessons.entries()) {
          if (!lesson.title.trim()) continue;

          const { error: lessonError } = await supabase
            .from('lessons')
            .insert({
              module_id: createdModule.id,
              title: lesson.title,
              content: lesson.content,
              video_url: lesson.video_url,
              duration_minutes: lesson.duration_minutes,
              order_index: lessonIndex
            });

          if (lessonError) throw lessonError;
        }
      }

      toast({
        title: "¡Éxito!",
        description: publish 
          ? "Curso creado y publicado exitosamente" 
          : "Curso guardado como borrador"
      });

      navigate('/dashboard');

    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar el curso",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">Crear Nuevo Curso</h1>
      </div>

      {/* Course Basic Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Información Básica del Curso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título del Curso</label>
            <Input
              placeholder="Ej: Introducción a React y TypeScript"
              value={courseData.title}
              onChange={(e) => setCourseData({...courseData, title: e.target.value})}
              className="text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <Textarea
              placeholder="Describe qué aprenderán los estudiantes en este curso..."
              value={courseData.description}
              onChange={(e) => setCourseData({...courseData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Precio (USD)</label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={courseData.price}
                onChange={(e) => setCourseData({...courseData, price: Number(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nivel</label>
              <select
                value={courseData.level}
                onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="Beginner">Principiante</option>
                <option value="Intermediate">Intermedio</option>
                <option value="Advanced">Avanzado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Imagen (URL)</label>
              <Input
                placeholder="https://..."
                value={courseData.thumbnail_url}
                onChange={(e) => setCourseData({...courseData, thumbnail_url: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Course Editor */}
      <AdvancedCourseEditor
        modules={modules}
        onModulesChange={setModules}
        onSave={saveCourse}
        saving={saving}
        courseStats={courseStats}
      />
    </div>
  );
}