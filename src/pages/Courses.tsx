import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Star,
  BookOpen,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  duration_minutes: number;
  level: string;
  rating: number;
  enrollment_count: number;
  total_lessons: number;
  total_modules: number;
  is_published: boolean;
  creator_id: string;
  profiles?: {
    full_name: string;
  };
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_creator_id_fkey(full_name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Gratis' : `$${price}`;
  };

  const handleEnrollment = async (courseId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      // Check if already enrolled
      const { data: existing } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (existing) {
        navigate(`/course/${courseId}/learn`);
        return;
      }

      // Enroll user
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId
        });

      if (error) throw error;
      navigate(`/course/${courseId}/learn`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Catálogo de <span className="text-gradient">Cursos</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Aprende de los mejores creadores y expande tus conocimientos
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">Todos los niveles</option>
            <option value="Beginner">Principiante</option>
            <option value="Intermediate">Intermedio</option>
            <option value="Advanced">Avanzado</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-elegant transition-smooth">
            {/* Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-primary/10 to-primary-glow/10 flex items-center justify-center">
              {course.thumbnail_url ? (
                <img 
                  src={course.thumbnail_url} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="w-16 h-16 text-primary/40" />
              )}
            </div>

            <CardContent className="p-6">
              {/* Course Info */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                  {course.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  por {course.profiles?.full_name || 'Instructor'}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{course.level}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(course.duration_minutes || 0)}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {course.enrollment_count}
                </Badge>
                {course.rating > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {course.rating}
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                <span>{course.total_modules} módulos</span>
                <span>{course.total_lessons} lecciones</span>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(course.price || 0)}
                </span>
                <Button 
                  onClick={() => handleEnrollment(course.id)}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {course.price === 0 ? 'Comenzar' : 'Inscribirse'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No se encontraron cursos</h3>
          <p className="text-muted-foreground">
            Intenta ajustar tus filtros o revisa más tarde
          </p>
        </div>
      )}

      {/* Create Course CTA for authenticated users */}
      {user && (
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-primary-glow/5">
            <CardHeader>
              <CardTitle>¿Tienes conocimientos que compartir?</CardTitle>
              <p className="text-muted-foreground">
                Crea tu propio curso y monetiza tu experiencia
              </p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/course/create')}
                size="lg"
                className="mt-4"
              >
                Crear Curso
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}