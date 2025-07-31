import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SimpleVideoPlayerProps {
  url: string;
  title?: string;
}

export default function SimpleVideoPlayer({ url, title = "Video" }: SimpleVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: any) => {
    console.error('Error en video:', error);
    setError(`Error: ${error?.message || 'Error desconocido'}`);
  };

  const handleReady = () => {
    console.log('Video listo para reproducir');
    setError(null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <ReactPlayer
              url={url}
              playing={playing}
              width="100%"
              height="100%"
              onError={handleError}
              onReady={handleReady}
              controls={true}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Button onClick={() => setPlaying(!playing)}>
              {playing ? 'Pausar' : 'Reproducir'}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              URL: {url}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 