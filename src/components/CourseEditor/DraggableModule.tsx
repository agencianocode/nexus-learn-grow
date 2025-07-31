import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  Video,
  FileText,
  Clock
} from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { MediaSelector } from './MediaSelector';

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

interface DraggableModuleProps {
  module: Module;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateModule: (moduleId: string, field: string, value: string) => void;
  onDeleteModule: (moduleId: string) => void;
  onAddLesson: (moduleId: string) => void;
  onUpdateLesson: (moduleId: string, lessonId: string, field: string, value: string | number) => void;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
  onReorderLessons: (moduleId: string, lessonIds: string[]) => void;
}

export function DraggableModule({
  module,
  isExpanded,
  onToggleExpand,
  onUpdateModule,
  onDeleteModule,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onReorderLessons
}: DraggableModuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const totalDuration = module.lessons.reduce((acc, lesson) => acc + lesson.duration_minutes, 0);
  const hasVideo = module.lessons.some(lesson => lesson.video_url);
  const hasContent = module.lessons.some(lesson => lesson.content);

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={`mb-4 border-l-4 border-l-brand ${isDragging ? 'shadow-lg' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleExpand}
                  className="p-1 h-auto"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
                <Input
                  placeholder="Título del módulo"
                  value={module.title}
                  onChange={(e) => onUpdateModule(module.id, 'title', e.target.value)}
                  className="font-medium"
                />
              </div>
              
              {isExpanded && (
                <Textarea
                  placeholder="Descripción del módulo (opcional)"
                  value={module.description}
                  onChange={(e) => onUpdateModule(module.id, 'description', e.target.value)}
                  rows={2}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {hasVideo && <Video className="w-4 h-4" />}
                {hasContent && <FileText className="w-4 h-4" />}
                <Clock className="w-4 h-4" />
                <span>{totalDuration}m</span>
              </div>
              
              <Badge variant="secondary">
                {module.lessons.length} lecciones
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteModule(module.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Lecciones</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddLesson(module.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Lección
              </Button>
            </div>

            {module.lessons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay lecciones en este módulo</p>
                <p className="text-sm">Agrega tu primera lección para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {module.lessons.map((lesson) => (
                  <DraggableLesson
                    key={lesson.id}
                    lesson={lesson}
                    moduleId={module.id}
                    onUpdate={onUpdateLesson}
                    onDelete={onDeleteLesson}
                  />
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

interface DraggableLessonProps {
  lesson: Lesson;
  moduleId: string;
  onUpdate: (moduleId: string, lessonId: string, field: string, value: string | number) => void;
  onDelete: (moduleId: string, lessonId: string) => void;
}

function DraggableLesson({ lesson, moduleId, onUpdate, onDelete }: DraggableLessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={`${isDragging ? 'shadow-lg' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Título de la lección"
                  value={lesson.title}
                  onChange={(e) => onUpdate(moduleId, lesson.id, 'title', e.target.value)}
                  className="font-medium"
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Duración (min)"
                    value={lesson.duration_minutes}
                    onChange={(e) => onUpdate(moduleId, lesson.id, 'duration_minutes', Number(e.target.value))}
                    className="w-24"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(moduleId, lesson.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <MediaSelector
                value={lesson.video_url}
                onChange={(value) => onUpdate(moduleId, lesson.id, 'video_url', value)}
                type="video"
                label="Video de la lección"
                placeholder="URL del video o selecciona de la biblioteca"
              />
              
              <RichTextEditor
                value={lesson.content}
                onChange={(value) => onUpdate(moduleId, lesson.id, 'content', value)}
                placeholder="Contenido de la lección..."
                label="Contenido"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 