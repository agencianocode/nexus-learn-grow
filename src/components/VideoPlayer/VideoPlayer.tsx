import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  RotateCw,
  Maximize,
  Minimize,
  Clock,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  url: string;
  title?: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  initialProgress?: number;
  className?: string;
}

interface TimeMarker {
  id: string;
  time: number;
  label: string;
  description?: string;
}

export default function VideoPlayer({
  url,
  title = "Video",
  onProgress,
  onComplete,
  initialProgress = 0,
  className
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Marcadores de tiempo de ejemplo
  const timeMarkers: TimeMarker[] = [
    { id: '1', time: 30, label: 'Introducción', description: 'Conceptos básicos' },
    { id: '2', time: 120, label: 'Desarrollo', description: 'Contenido principal' },
    { id: '3', time: 300, label: 'Ejemplos', description: 'Casos prácticos' },
    { id: '4', time: 450, label: 'Conclusión', description: 'Resumen final' }
  ];

  // Velocidades de reproducción disponibles
  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Formatear tiempo en MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Manejar cuando el video está listo
  const handleReady = () => {
    console.log('Video listo para reproducir');
    setIsReady(true);
  };

  // Manejar progreso del video
  const handleProgress = (state: { played: number; loaded: number }) => {
    setPlayed(state.played);
    setCurrentTime(state.played * duration);
    
    // Llamar callback de progreso
    if (onProgress) {
      onProgress(state.played * 100);
    }

    // Verificar si el video terminó
    if (state.played >= 0.99 && onComplete) {
      onComplete();
    }
  };

  // Manejar duración del video
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  // Manejar búsqueda en el video
  const handleSeek = (value: number[]) => {
    const newTime = value[0] / 100;
    setPlayed(newTime);
    setCurrentTime(newTime * duration);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
    }
  };

  // Manejar cambio de volumen
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  // Saltar a marcador de tiempo
  const jumpToMarker = (marker: TimeMarker) => {
    const newTime = marker.time / duration;
    setPlayed(newTime);
    setCurrentTime(marker.time);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
    }
  };

  // Saltar hacia adelante/atrás
  const skipTime = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    const newPlayed = newTime / duration;
    setPlayed(newPlayed);
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newPlayed);
    }
  };

  // Alternar pantalla completa
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!fullscreen) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Manejar play/pause de forma segura
  const handlePlayPause = () => {
    if (isReady) {
      setPlaying(!playing);
    }
  };

  // Efecto para manejar pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardContent className="p-0">
        <div 
          ref={containerRef}
          className="relative bg-black rounded-t-lg overflow-hidden"
        >
          {/* Video Player */}
          <div className="relative aspect-video">
            <ReactPlayer
              ref={playerRef}
              url={url}
              playing={playing}
              volume={volume}
              muted={muted}
              playbackRate={playbackRate}
              width="100%"
              height="100%"
              onReady={handleReady}
              onProgress={handleProgress}
              onDuration={handleDuration}
              controls={false}
              light={false}
              pip={false}
              config={{
                youtube: {
                  playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    rel: 0
                  }
                }
              }}
            />
          </div>

          {/* Controles del Video */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Barra de Progreso */}
            <div className="mb-4">
              <Slider
                value={[played * 100]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-white text-sm mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controles Principales */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayPause}
                  disabled={!isReady}
                  className="text-white hover:bg-white/20"
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(-10)}
                  disabled={!isReady}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(10)}
                  disabled={!isReady}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMuted(!muted)}
                    disabled={!isReady}
                    className="text-white hover:bg-white/20"
                  >
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[muted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    className="w-20"
                    disabled={!isReady}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  disabled={!isReady}
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  disabled={!isReady}
                  className="text-white hover:bg-white/20"
                >
                  {fullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Configuraciones de Velocidad */}
            {showSettings && (
              <div className="mt-4 p-3 bg-black/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <RotateCw className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Velocidad de Reproducción</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {playbackRates.map((rate) => (
                    <Button
                      key={rate}
                      variant={playbackRate === rate ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPlaybackRate(rate)}
                      disabled={!isReady}
                      className="text-xs"
                    >
                      {rate}x
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información del Video */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          
          {/* Estado del Video */}
          <div className="mb-4">
            <Badge variant={isReady ? "default" : "secondary"}>
              {isReady ? "Video Listo" : "Cargando Video..."}
            </Badge>
          </div>
          
          {/* Marcadores de Tiempo */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Marcadores de Tiempo</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {timeMarkers.map((marker) => (
                <Button
                  key={marker.id}
                  variant="outline"
                  size="sm"
                  onClick={() => jumpToMarker(marker)}
                  disabled={!isReady}
                  className="text-xs"
                >
                  <Badge variant="secondary" className="mr-1">
                    {formatTime(marker.time)}
                  </Badge>
                  {marker.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Progreso del Video */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progreso del Video</span>
              <span>{Math.round(played * 100)}%</span>
            </div>
            <Progress value={played * 100} className="w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 