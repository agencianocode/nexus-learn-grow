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
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  GripVertical,
  Save,
  Eye
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

  const addModule = () => {
    const newModule: Module = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      lessons: [],
      order_index: modules.length
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (moduleId: string, field: string, value: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, [field]: value }
        : module
    ));
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `temp-${Date.now()}`,
      title: '',
      content: '',
      video_url: '',
      duration_minutes: 0,
      order_index: 0
    };

    setModules(modules.map(module => 
      module.id === moduleId 
        ? { 
            ...module, 
            lessons: [...module.lessons, { ...newLesson, order_index: module.lessons.length }]
          }
        : module
    ));
  };

  const updateLesson = (moduleId: string, lessonId: string, field: string, value: string | number) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId 
                ? { ...lesson, [field]: value }
                : lesson
            )
          }
        : module
    ));
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? {
            ...module,
            lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
          }
        : module
    ));
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

    setSaving(true);

    try {
      // Calculate totals
      const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
      const totalDuration = modules.reduce((acc, module) => 
        acc + module.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.duration_minutes, 0), 0
      );

      // Create course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          creator_id: user.id,
          community_id: user.id, // For now, use user id as community id
          is_published: publish,
          total_modules: modules.length,
          total_lessons: totalLessons,
          duration_minutes: totalDuration
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título del Curso</label>
            <Input
              placeholder="Ej: Introducción a React y TypeScript"
              value={courseData.title}
              onChange={(e) => setCourseData({...courseData, title: e.target.value})}
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

      {/* Course Structure */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Estructura del Curso</CardTitle>
          <Button onClick={addModule} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Módulo
          </Button>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay módulos aún. Agrega tu primer módulo para comenzar.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {modules.map((module, moduleIndex) => (
                <Card key={module.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <GripVertical className="w-5 h-5 text-muted-foreground mt-1" />
                      <div className="flex-1 space-y-3">
                        <Input
                          placeholder="Título del módulo"
                          value={module.title}
                          onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                        />
                        <Textarea
                          placeholder="Descripción del módulo (opcional)"
                          value={module.description}
                          onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteModule(module.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Lecciones</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addLesson(module.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Lección
                      </Button>
                    </div>

                    {module.lessons.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay lecciones en este módulo
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="p-4 border border-border rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <Input
                                placeholder="Título de la lección"
                                value={lesson.title}
                                onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                              />
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="Duración (min)"
                                  value={lesson.duration_minutes}
                                  onChange={(e) => updateLesson(module.id, lesson.id, 'duration_minutes', Number(e.target.value))}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteLesson(module.id, lesson.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <Textarea
                              placeholder="Contenido de la lección..."
                              value={lesson.content}
                              onChange={(e) => updateLesson(module.id, lesson.id, 'content', e.target.value)}
                              rows={3}
                              className="mb-3"
                            />
                            <Input
                              placeholder="URL del video (opcional)"
                              value={lesson.video_url}
                              onChange={(e) => updateLesson(module.id, lesson.id, 'video_url', e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          variant="outline"
          onClick={() => saveCourse(false)}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : 'Guardar Borrador'}
        </Button>
        <Button
          onClick={() => saveCourse(true)}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          {saving ? 'Publicando...' : 'Publicar Curso'}
        </Button>
      </div>
    </div>
  );
}