import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Save, 
  Eye, 
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  BarChart3,
  Upload,
  Monitor
} from 'lucide-react';
import { DraggableModule } from './DraggableModule';
import { MediaUploader } from './MediaUploader';
import { LivePreview } from './LivePreview';

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

interface AdvancedCourseEditorProps {
  modules: Module[];
  onModulesChange: (modules: Module[]) => void;
  onSave: (publish: boolean) => Promise<void>;
  saving: boolean;
  courseStats: {
    totalModules: number;
    totalLessons: number;
    totalDuration: number;
    hasVideo: boolean;
    hasContent: boolean;
  };
}

export function AdvancedCourseEditor({
  modules,
  onModulesChange,
  onSave,
  saving,
  courseStats
}: AdvancedCourseEditorProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | undefined>();
  const [activeTab, setActiveTab] = useState('structure');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const addModule = () => {
    const newModule: Module = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      lessons: [],
      order_index: modules.length
    };
    onModulesChange([...modules, newModule]);
    setExpandedModules(prev => new Set([...prev, newModule.id]));
  };

  const updateModule = (moduleId: string, field: string, value: string) => {
    onModulesChange(modules.map(module => 
      module.id === moduleId 
        ? { ...module, [field]: value }
        : module
    ));
  };

  const deleteModule = (moduleId: string) => {
    onModulesChange(modules.filter(module => module.id !== moduleId));
    setExpandedModules(prev => {
      const newExpanded = new Set(prev);
      newExpanded.delete(moduleId);
      return newExpanded;
    });
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

    onModulesChange(modules.map(module => 
      module.id === moduleId 
        ? { 
            ...module, 
            lessons: [...module.lessons, { ...newLesson, order_index: module.lessons.length }]
          }
        : module
    ));
  };

  const updateLesson = (moduleId: string, lessonId: string, field: string, value: string | number) => {
    onModulesChange(modules.map(module => 
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
    onModulesChange(modules.map(module => 
      module.id === moduleId 
        ? {
            ...module,
            lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
          }
        : module
    ));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = modules.findIndex(module => module.id === active.id);
      const newIndex = modules.findIndex(module => module.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onModulesChange(arrayMove(modules, oldIndex, newIndex));
      }
    }
  };

  const handleFileUpload = (files: any[]) => {
    console.log('Archivos subidos:', files);
    // Aquí se integraría con Supabase Storage
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Course Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Estadísticas del Curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand">{courseStats.totalModules}</div>
                <div className="text-sm text-muted-foreground">Módulos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand">{courseStats.totalLessons}</div>
                <div className="text-sm text-muted-foreground">Lecciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand">{courseStats.totalDuration}m</div>
                <div className="text-sm text-muted-foreground">Duración</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand">
                  {courseStats.hasVideo && courseStats.hasContent ? 'Completo' : 'Básico'}
                </div>
                <div className="text-sm text-muted-foreground">Tipo</div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              {courseStats.hasVideo && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Videos
                </Badge>
              )}
              {courseStats.hasContent && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Contenido
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Editor Tabs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Editor de Curso</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  Vista Previa
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="structure">Estructura</TabsTrigger>
                <TabsTrigger value="media">Multimedia</TabsTrigger>
                <TabsTrigger value="preview">Vista Previa</TabsTrigger>
              </TabsList>

              <TabsContent value="structure" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Estructura del Curso</h4>
                  <Button onClick={addModule} variant="outline" className="btn-brand">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Módulo
                  </Button>
                </div>

                {modules.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Comienza a estructurar tu curso</h3>
                    <p className="text-sm mb-4">
                      Agrega módulos y lecciones para crear una experiencia de aprendizaje completa
                    </p>
                    <Button onClick={addModule} className="btn-brand">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primer Módulo
                    </Button>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={modules.map(module => module.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4">
                        {modules.map((module) => (
                          <DraggableModule
                            key={module.id}
                            module={module}
                            isExpanded={expandedModules.has(module.id)}
                            onToggleExpand={() => toggleModuleExpansion(module.id)}
                            onUpdateModule={updateModule}
                            onDeleteModule={deleteModule}
                            onAddLesson={addLesson}
                            onUpdateLesson={updateLesson}
                            onDeleteLesson={deleteLesson}
                            onReorderLessons={() => {}} // TODO: Implement lesson reordering
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </TabsContent>

              <TabsContent value="media" className="mt-6">
                <MediaUploader onFileUpload={handleFileUpload} />
              </TabsContent>

              <TabsContent value="preview" className="mt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Vista Previa del Curso</h3>
                  <p className="text-sm mb-4">
                    Ve cómo se verá tu curso desde la perspectiva del estudiante
                  </p>
                  <Button 
                    onClick={() => setShowPreview(true)} 
                    className="btn-brand"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Abrir Vista Previa
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => onSave(false)}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Borrador'}
          </Button>
          <Button
            onClick={() => onSave(true)}
            disabled={saving}
            className="flex items-center gap-2 btn-brand"
          >
            <Eye className="w-4 h-4" />
            {saving ? 'Publicando...' : 'Publicar Curso'}
          </Button>
        </div>
      </div>

      {/* Live Preview Modal */}
      {showPreview && (
        <LivePreview
          modules={modules}
          currentLesson={currentLesson}
          onLessonSelect={handleLessonSelect}
        />
      )}
    </>
  );
} 