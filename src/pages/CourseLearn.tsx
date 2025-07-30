import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft,
  Check,
  BookOpen,
  Clock,
  FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  total_lessons: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
  is_completed?: boolean;
}

interface LessonProgress {
  id: string;
  lesson_id: string;
  is_completed: boolean;
  watch_time_minutes: number;
}

export default function CourseLearn() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    if (courseId && user) {
      fetchCourseData();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course info
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title, description, total_lessons')
        .eq('id', courseId)
        .eq('is_published', true)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Check enrollment
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user!.id)
        .eq('course_id', courseId)
        .single();

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        throw enrollmentError;
      }

      if (!enrollmentData) {
        navigate(`/courses`);
        return;
      }

      setEnrollment(enrollmentData);

      // Fetch modules and lessons
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          description,
          order_index,
          lessons (
            id,
            title,
            content,
            video_url,
            duration_minutes,
            order_index
          )
        `)
        .eq('course_id', courseId)
        .order('order_index');

      if (modulesError) throw modulesError;

      // Fetch lesson progress
      const allLessons = modulesData?.flatMap(m => m.lessons) || [];
      const lessonIds = allLessons.map(l => l.id);

      const { data: progressData, error: progressError } = await supabase
        .from('lesson_progress')
        .select('id, lesson_id, is_completed, watch_time_minutes')
        .eq('user_id', user!.id)
        .in('lesson_id', lessonIds);

      if (progressError) throw progressError;

      setLessonProgress(progressData || []);

      // Map progress to lessons
      const modulesWithProgress = modulesData?.map(module => ({
        ...module,
        lessons: module.lessons
          .map(lesson => ({
            ...lesson,
            is_completed: progressData?.find(p => p.lesson_id === lesson.id)?.is_completed || false
          }))
          .sort((a, b) => a.order_index - b.order_index)
      })).sort((a, b) => a.order_index - b.order_index) || [];

      setModules(modulesWithProgress);

      // Set first incomplete lesson as current, or first lesson
      const firstIncompleteLesson = modulesWithProgress
        .flatMap(m => m.lessons)
        .find(l => !l.is_completed);

      setCurrentLesson(
        firstIncompleteLesson || 
        (modulesWithProgress[0]?.lessons[0] || null)
      );

    } catch (error) {
      console.error('Error fetching course data:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el curso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markLessonAsCompleted = async (lessonId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          is_completed: true,
          watch_time_minutes: currentLesson?.duration_minutes || 0
        });

      if (error) throw error;

      // Update local state
      setLessonProgress(prev => {
        const existing = prev.find(p => p.lesson_id === lessonId);
        if (existing) {
          return prev.map(p => 
            p.lesson_id === lessonId 
              ? { ...p, is_completed: true }
              : p
          );
        } else {
          return [...prev, {
            id: `temp-${Date.now()}`,
            lesson_id: lessonId,
            is_completed: true,
            watch_time_minutes: currentLesson?.duration_minutes || 0
          }];
        }
      });

      // Update modules state
      setModules(prev => prev.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson =>
          lesson.id === lessonId 
            ? { ...lesson, is_completed: true }
            : lesson
        )
      })));

      toast({
        title: "¡Lección completada!",
        description: "Has marcado esta lección como completada"
      });

    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      toast({
        title: "Error",
        description: "No se pudo marcar la lección como completada",
        variant: "destructive"
      });
    }
  };

  const getNextLesson = () => {
    const allLessons = modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  };

  const getPreviousLesson = () => {
    const allLessons = modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  };

  const calculateProgress = () => {
    const totalLessons = modules.flatMap(m => m.lessons).length;
    const completedLessons = lessonProgress.filter(p => p.is_completed).length;
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="h-64 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Curso no encontrado</h2>
        <Button onClick={() => navigate('/courses')}>
          Volver a Cursos
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Cursos
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <Progress value={calculateProgress()} className="w-48" />
              <span className="text-sm text-muted-foreground">
                {Math.round(calculateProgress())}% completado
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Video Player */}
          {currentLesson.video_url && (
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={currentLesson.video_url}
                    title={currentLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lesson Content */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                <div className="flex items-center gap-2">
                  {currentLesson.duration_minutes > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {currentLesson.duration_minutes}m
                    </Badge>
                  )}
                  {currentLesson.is_completed && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Completada
                    </Badge>
                  )}
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                {currentLesson.content ? (
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: currentLesson.content.replace(/\n/g, '<br>') 
                    }} 
                  />
                ) : (
                  <p className="text-muted-foreground">
                    No hay contenido de texto para esta lección.
                  </p>
                )}
              </div>

              {/* Lesson Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                  {getPreviousLesson() && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentLesson(getPreviousLesson()!)}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                  )}
                  {getNextLesson() && (
                    <Button
                      onClick={() => setCurrentLesson(getNextLesson()!)}
                      className="flex items-center gap-2"
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {!currentLesson.is_completed && (
                  <Button
                    variant="default"
                    onClick={() => markLessonAsCompleted(currentLesson.id)}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Marcar como Completada
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Progress */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Progreso del Curso</h3>
              <Progress value={calculateProgress()} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {lessonProgress.filter(p => p.is_completed).length} de {modules.flatMap(m => m.lessons).length} lecciones
              </p>
            </CardContent>
          </Card>

          {/* Course Curriculum */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Contenido del Curso
              </h3>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id}>
                    <h4 className="font-medium text-sm mb-2">{module.title}</h4>
                    <div className="space-y-1">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`w-full text-left p-2 rounded text-sm transition-colors ${
                            currentLesson?.id === lesson.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {lesson.is_completed ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <div className="w-3 h-3 border border-border rounded-full" />
                            )}
                            <span className="flex-1 truncate">{lesson.title}</span>
                            {lesson.duration_minutes > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {lesson.duration_minutes}m
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}