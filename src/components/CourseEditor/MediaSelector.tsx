import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Video, 
  Image, 
  Music, 
  File, 
  X,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { MediaUploader } from './MediaUploader';
import { MediaLibrary } from './MediaLibrary';
import { StorageFile } from '@/lib/supabase-storage';

interface MediaSelectorProps {
  value: string;
  onChange: (url: string) => void;
  type?: 'video' | 'image' | 'audio';
  label?: string;
  placeholder?: string;
}

export function MediaSelector({ 
  value, 
  onChange, 
  type = 'video',
  label = 'URL del archivo',
  placeholder = 'https://...'
}: MediaSelectorProps) {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState('library');

  const handleFileSelect = (file: StorageFile) => {
    onChange(file.url);
    setShowMediaLibrary(false);
  };

  const handleFileUpload = (files: any[]) => {
    if (files.length > 0) {
      onChange(files[0].url);
      setShowMediaLibrary(false);
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'image': return 'Imagen';
      case 'video': return 'Video';
      case 'audio': return 'Audio';
      default: return 'Archivo';
    }
  };

  const getFilterType = () => {
    switch (type) {
      case 'image': return 'image';
      case 'video': return 'video';
      case 'audio': return 'audio';
      default: return 'all';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {getTypeIcon()}
        <label className="text-sm font-medium">{label}</label>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        
        <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Biblioteca
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Biblioteca de {getTypeLabel()}s</DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="library">Biblioteca</TabsTrigger>
                <TabsTrigger value="upload">Subir Nuevo</TabsTrigger>
              </TabsList>

              <TabsContent value="library" className="mt-6">
                <MediaLibrary
                  onFileSelect={handleFileSelect}
                  filterType={getFilterType()}
                  showUploadButton={false}
                />
              </TabsContent>

              <TabsContent value="upload" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Subir Nuevo {getTypeLabel()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MediaUploader 
                      onFileUpload={handleFileUpload}
                      acceptedTypes={[`${type}/*`]}
                      maxFiles={5}
                      maxSize={100}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Preview */}
      {value && (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Vista Previa:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange('')}
              className="h-6 px-2"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          {type === 'video' && (
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                src={value}
                controls
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          
          {type === 'image' && (
            <div className="border rounded-lg overflow-hidden">
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {type === 'audio' && (
            <div className="border rounded-lg p-4">
              <audio
                src={value}
                controls
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
} 