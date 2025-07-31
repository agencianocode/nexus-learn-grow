import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Volume2, 
  Settings,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import SimpleVideoPlayer from '@/components/VideoPlayer/SimpleVideoPlayer';

export default function VideoPlayerTest() {
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [videoTitle, setVideoTitle] = useState('Video de Prueba');
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    console.log('🎉 ¡Video completado!');
  };

  const testVideos = [
    { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Rick Roll' },
    { url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', title: 'Me at the zoo' },
    { url: 'https://www.youtube.com/watch?v=9bZkp7q19f0', title: 'PSY - GANGNAM STYLE' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', title: 'Big Buck Bunny (MP4)' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', title: 'Elephants Dream (MP4)' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Video Player - Prueba</h1>
        <p className="text-muted-foreground">
          Prueba el reproductor de video con todas sus funcionalidades
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline">
            <Play className="w-4 h-4 mr-1" />
            Reproducción
          </Badge>
          <Badge variant="outline">
            <Volume2 className="w-4 h-4 mr-1" />
            Controles
          </Badge>
          <Badge variant="outline">
            <Clock className="w-4 h-4 mr-1" />
            Marcadores
          </Badge>
          <Badge variant="outline">
            <Settings className="w-4 h-4 mr-1" />
            Velocidad
          </Badge>
        </div>
      </div>

      {/* Configuración */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="video-url">URL del Video</Label>
              <Input
                id="video-url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div>
              <Label htmlFor="video-title">Título del Video</Label>
              <Input
                id="video-title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Título del video"
              />
            </div>
          </div>

          {/* Videos de Prueba */}
          <div>
            <Label className="text-sm font-medium">Videos de Prueba</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {testVideos.map((video, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setVideoUrl(video.url);
                    setVideoTitle(video.title);
                  }}
                >
                  {video.title}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

             {/* Video Player Simple */}
       <SimpleVideoPlayer
         url={videoUrl}
         title={`${videoTitle} (Simple)`}
       />

       {/* Video Player Completo */}
       <VideoPlayer
         url={videoUrl}
         title={`${videoTitle} (Completo)`}
         onProgress={handleProgress}
         onComplete={handleComplete}
         initialProgress={0}
       />

      {/* Estado del Video */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progreso del Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progreso Actual</span>
                <Badge variant="secondary">{Math.round(progress)}%</Badge>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center space-x-2">
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium">Video Completado</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-600">En Progreso</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funcionalidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-green-600" />
                <span className="text-sm">Reproducción/Pausa</span>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Control de Volumen</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Marcadores de Tiempo</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-orange-600" />
                <span className="text-sm">Velocidad de Reproducción</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información Técnica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Controles</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Play/Pause</li>
                <li>• Saltar ±10 segundos</li>
                <li>• Control de volumen</li>
                <li>• Pantalla completa</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Marcadores</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Introducción (0:30)</li>
                <li>• Desarrollo (2:00)</li>
                <li>• Ejemplos (5:00)</li>
                <li>• Conclusión (7:30)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Velocidades</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 0.5x (Lento)</li>
                <li>• 0.75x</li>
                <li>• 1x (Normal)</li>
                <li>• 1.25x</li>
                <li>• 1.5x</li>
                <li>• 2x (Rápido)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 