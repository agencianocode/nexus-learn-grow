import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { storageService, UploadProgress, StorageFile } from '@/lib/supabase-storage';
import { 
  Upload, 
  File, 
  Video, 
  Image, 
  Music, 
  X, 
  CheckCircle,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  url?: string;
  preview?: string;
  uploadProgress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  path?: string; // Ruta en Supabase Storage
}

interface MediaUploaderProps {
  onFileUpload: (files: MediaFile[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // en MB
}

export function MediaUploader({ 
  onFileUpload, 
  acceptedTypes = ['image/*', 'video/*', 'audio/*'],
  maxFiles = 10,
  maxSize = 100 // 100MB
}: MediaUploaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para subir archivos",
        variant: "destructive"
      });
      return;
    }

    const newFiles: MediaFile[] = acceptedFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: getFileType(file.type),
      size: file.size,
      uploadProgress: 0,
      status: 'uploading'
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    // Subir archivos a Supabase Storage
    for (const [index, file] of acceptedFiles.entries()) {
      try {
        // Validar tipo de archivo
        if (!storageService.validateFileType(file, acceptedTypes)) {
          throw new Error(`Tipo de archivo no permitido: ${file.type}`);
        }

        // Validar tamaño
        if (!storageService.validateFileSize(file, maxSize)) {
          throw new Error(`Archivo demasiado grande. Máximo ${maxSize}MB`);
        }

        // Generar ruta única
        const path = storageService.generateUniquePath(file, user.id);

        // Subir archivo
        const storageFile = await storageService.uploadFile(
          file, 
          path,
          (progress) => {
            setFiles(prev => 
              prev.map(f => 
                f.id === newFiles[index].id 
                  ? { ...f, uploadProgress: progress.percentage }
                  : f
              )
            );
          }
        );

        // Actualizar estado con éxito
        setFiles(prev => 
          prev.map(f => 
            f.id === newFiles[index].id 
              ? { 
                  ...f, 
                  status: 'success',
                  url: storageFile.url,
                  path: storageFile.id,
                  uploadProgress: 100
                }
              : f
          )
        );

        toast({
          title: "¡Éxito!",
          description: `${file.name} subido correctamente`,
        });

      } catch (error) {
        console.error('Error subiendo archivo:', error);
        
        // Actualizar estado con error
        setFiles(prev => 
          prev.map(f => 
            f.id === newFiles[index].id 
              ? { 
                  ...f, 
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Error desconocido'
                }
              : f
          )
        );

        toast({
          title: "Error",
          description: `Error al subir ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          variant: "destructive"
        });
      }
    }

    setIsUploading(false);
    
    // Notificar archivos exitosos
    const successfulFiles = files.filter(f => f.status === 'success');
    if (successfulFiles.length > 0) {
      onFileUpload(successfulFiles);
    }
  }, [user, acceptedTypes, maxSize, onFileUpload, toast]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    maxSize: maxSize * 1024 * 1024, // Convertir a bytes
    onDropRejected: (rejectedFiles) => {
      console.log('Archivos rechazados:', rejectedFiles);
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          toast({
            title: "Archivo rechazado",
            description: `${file.name}: ${error.message}`,
            variant: "destructive"
          });
        });
      });
    }
  });

  const removeFile = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    
    if (file?.path && file.status === 'success') {
      try {
        await storageService.deleteFile(file.path);
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
    }

    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileType = (mimeType: string): 'image' | 'video' | 'audio' | 'document' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Subir Archivos Multimedia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
              ${isDragActive 
                ? 'border-brand bg-brand-muted' 
                : 'border-border hover:border-brand hover:bg-muted'
              }
              ${isDragReject ? 'border-destructive bg-destructive/10' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            
            {isDragActive ? (
              <p className="text-lg font-medium text-brand">
                Suelta los archivos aquí...
              </p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-muted-foreground">
                  Tipos soportados: Imágenes, Videos, Audio
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Máximo {maxFiles} archivos, {maxSize}MB por archivo
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Archivos ({files.length})</span>
              {isUploading && (
                <Badge variant="secondary">
                  Subiendo...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.status === 'uploading' && (
                      <div className="w-24">
                        <Progress value={file.uploadProgress} className="h-2" />
                      </div>
                    )}
                    
                    {file.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    
                    {file.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 