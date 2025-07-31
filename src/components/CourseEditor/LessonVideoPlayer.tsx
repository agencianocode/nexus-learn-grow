import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Video, 
  Edit3, 
  Eye,
  X
} from 'lucide-react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

interface LessonVideoPlayerProps {
  videoUrl: string;
  lessonTitle: string;
  onVideoUrlChange: (url: string) => void;
  onClose?: () => void;
}

export default function LessonVideoPlayer({
  videoUrl,
  lessonTitle,
  onVideoUrlChange,
  onClose
}: LessonVideoPlayerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(videoUrl);

  const handleSave = () => {
    onVideoUrlChange(tempUrl);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUrl(videoUrl);
    setIsEditing(false);
  };

  if (!videoUrl) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5" />
            <span>Video de la Lección</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-url">URL del Video</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="video-url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1"
                />
                <Button onClick={handleSave} disabled={!tempUrl.trim()}>
                  Agregar
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• Soporta YouTube, Vimeo, y archivos de video</p>
              <p>• El video se mostrará en la lección</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5" />
            <span>Video de la Lección</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} disabled={!tempUrl.trim()}>
                  Guardar
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button size="sm" variant="outline" onClick={() => onVideoUrlChange('')}>
                  <X className="w-4 h-4 mr-1" />
                  Quitar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-video-url">URL del Video</Label>
              <Input
                id="edit-video-url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-2"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                <Play className="w-3 h-3 mr-1" />
                Video Activo
              </Badge>
              <span className="text-sm text-muted-foreground">
                {videoUrl.length > 50 ? `${videoUrl.substring(0, 50)}...` : videoUrl}
              </span>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <VideoPlayer
                url={videoUrl}
                title={lessonTitle}
                onProgress={(progress) => {
                  console.log(`Progreso del video: ${progress}%`);
                }}
                onComplete={() => {
                  console.log('Video completado');
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 