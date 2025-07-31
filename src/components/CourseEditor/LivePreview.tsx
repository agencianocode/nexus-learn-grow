import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  EyeOff, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order_index: number;
}

interface LivePreviewProps {
  modules: Module[];
  currentLesson?: Lesson;
  onLessonSelect?: (lesson: Lesson) => void;
}

export function LivePreview({ modules, currentLesson, onLessonSelect }: LivePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'w-80';
      case 'tablet': return 'w-96';
      default: return 'w-full';
    }
  };

  const getPreviewIcon = () => {
    switch (previewMode) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  if (!showPreview) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowPreview(true)}
          className="btn-brand shadow-lg"
        >
          <Eye className="w-4 h-4 mr-2" />
          Mostrar Vista Previa
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-background rounded-lg shadow-2xl max-h-[90vh] overflow-hidden ${getPreviewWidth()}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <h3 className="font-semibold">Vista Previa en Tiempo Real</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device Toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
                className="h-8 px-2"
              >
                <Monitor className="w-3 h-3" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
                className="h-8 px-2"
              >
                <Tablet className="w-3 h-3" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
                className="h-8 px-2"
              >
                <Smartphone className="w-3 h-3" />
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(false)}
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 border-r bg-muted/20 overflow-y-auto">
            <div className="p-4">
              <h4 className="font-medium mb-4">Estructura del Curso</h4>
              
              <div className="space-y-2">
                {modules.map((module) => (
                  <div key={module.id} className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        Módulo {module.order_index + 1}
                      </Badge>
                      {module.title || 'Sin título'}
                    </div>
                    
                    {module.lessons.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => onLessonSelect?.(lesson)}
                            className={`
                              w-full text-left p-2 rounded text-sm transition-colors
                              ${currentLesson?.id === lesson.id 
                                ? 'bg-brand text-brand-foreground' 
                                : 'hover:bg-muted'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2">
                              {lesson.video_url && <Play className="w-3 h-3" />}
                              <span className="truncate">
                                {lesson.title || 'Sin título'}
                              </span>
                            </div>
                            {lesson.duration_minutes > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {lesson.duration_minutes} min
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-y-auto">
            {currentLesson ? (
              <div className="p-6">
                {/* Lesson Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {currentLesson.title || 'Sin título'}
                  </h2>
                  {currentLesson.duration_minutes > 0 && (
                    <Badge variant="secondary" className="mb-4">
                      {currentLesson.duration_minutes} minutos
                    </Badge>
                  )}
                </div>

                {/* Video Player */}
                {currentLesson.video_url && (
                  <div className="mb-6">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <ReactPlayer
                        url={currentLesson.video_url}
                        width="100%"
                        height="auto"
                        playing={isPlaying}
                        muted={isMuted}
                        controls={false}
                        style={{ aspectRatio: '16/9' }}
                      />
                      
                      {/* Custom Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePlayPause}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMuteToggle}
                            className="text-white hover:bg-white/20"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleFullscreenToggle}
                            className="text-white hover:bg-white/20 ml-auto"
                          >
                            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                {currentLesson.content && (
                  <div className="prose prose-sm max-w-none">
                    <div 
                      className="markdown-content"
                      dangerouslySetInnerHTML={{ 
                        __html: currentLesson.content 
                          .replace(/\n/g, '<br>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                          .replace(/^- (.*$)/gim, '<li>$1</li>')
                          .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
                      }}
                    />
                  </div>
                )}

                {!currentLesson.content && !currentLesson.video_url && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Esta lección no tiene contenido aún</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Selecciona una lección para ver la vista previa</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 