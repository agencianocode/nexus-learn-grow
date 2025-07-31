import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { storageService, StorageFile } from '@/lib/supabase-storage';
import { 
  Search, 
  Video, 
  Image, 
  Music, 
  File, 
  Download,
  Trash2,
  Calendar,
  HardDrive
} from 'lucide-react';

interface MediaLibraryProps {
  onFileSelect: (file: StorageFile) => void;
  filterType?: 'image' | 'video' | 'audio' | 'all';
  showUploadButton?: boolean;
  onUploadClick?: () => void;
}

export function MediaLibrary({ 
  onFileSelect, 
  filterType = 'all',
  showUploadButton = true,
  onUploadClick 
}: MediaLibraryProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const userFiles = await storageService.listFiles(user?.id || '');
      setFiles(userFiles);
    } catch (error) {
      console.error('Error cargando archivos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los archivos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: StorageFile) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleFileDelete = async (file: StorageFile) => {
    try {
      await storageService.deleteFile(file.id);
      setFiles(prev => prev.filter(f => f.id !== file.id));
      toast({
        title: "Archivo eliminado",
        description: `${file.name} eliminado correctamente`,
      });
    } catch (error) {
      console.error('Error eliminando archivo:', error);
      toast({
        title: "Error",
        description: `Error al eliminar ${file.name}`,
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredFiles = files.filter(file => {
    // Filtrar por tipo
    if (filterType !== 'all') {
      if (filterType === 'image' && !file.type.startsWith('image/')) return false;
      if (filterType === 'video' && !file.type.startsWith('video/')) return false;
      if (filterType === 'audio' && !file.type.startsWith('audio/')) return false;
    }

    // Filtrar por búsqueda
    if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando archivos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          <h3 className="font-semibold">Biblioteca de Archivos</h3>
          <Badge variant="secondary">{files.length} archivos</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadFiles}
          >
            Actualizar
          </Button>
          
          {showUploadButton && onUploadClick && (
            <Button
              size="sm"
              onClick={onUploadClick}
              className="btn-brand"
            >
              Subir Archivo
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar archivos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <File className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h4 className="font-medium mb-2">No hay archivos</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm 
                ? 'No se encontraron archivos con ese nombre'
                : 'Sube tu primer archivo para comenzar'
              }
            </p>
            {showUploadButton && onUploadClick && (
              <Button onClick={onUploadClick} className="btn-brand">
                Subir Archivo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              className={`
                cursor-pointer transition-all hover:shadow-md
                ${selectedFile?.id === file.id ? 'ring-2 ring-brand' : ''}
              `}
              onClick={() => handleFileSelect(file)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.type)}
                    <span className="text-sm font-medium truncate">
                      {file.name}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileDelete(file);
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                {/* Preview */}
                {file.type.startsWith('image/') && (
                  <div className="mb-3">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {file.type.startsWith('video/') && (
                  <div className="mb-3">
                    <video
                      src={file.url}
                      className="w-full h-24 object-cover rounded border"
                      muted
                    />
                  </div>
                )}

                {/* File Info */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(file.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(file.url, '_blank');
                    }}
                    className="flex-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Descargar
                  </Button>
                  
                  {selectedFile?.id === file.id && (
                    <Badge variant="secondary" className="flex-1">
                      Seleccionado
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 