import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { storageService, StorageFile, UploadProgress } from '@/lib/supabase-storage';

export interface UseStorageReturn {
  // Estado
  files: StorageFile[];
  loading: boolean;
  uploading: boolean;
  
  // Acciones
  uploadFile: (file: File, onProgress?: (progress: UploadProgress) => void) => Promise<StorageFile | null>;
  uploadFiles: (files: File[], onProgress?: (progress: UploadProgress) => void) => Promise<StorageFile[]>;
  deleteFile: (fileId: string) => Promise<boolean>;
  loadFiles: () => Promise<void>;
  getFileUrl: (path: string) => string;
  
  // Utilidades
  validateFile: (file: File, maxSizeMB?: number, allowedTypes?: string[]) => boolean;
  formatFileSize: (bytes: number) => string;
  getFileType: (mimeType: string) => 'image' | 'video' | 'audio' | 'document';
}

export function useStorage(): UseStorageReturn {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadFiles = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userFiles = await storageService.listFiles(user.id);
      setFiles(userFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los archivos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const uploadFile = useCallback(async (
    file: File, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<StorageFile | null> => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para subir archivos",
        variant: "destructive"
      });
      return null;
    }

    try {
      setUploading(true);

      // Validar archivo
      if (!validateFile(file)) {
        return null;
      }

      // Generar ruta única
      const path = storageService.generateUniquePath(file, user.id);

      // Subir archivo
      const storageFile = await storageService.uploadFile(file, path, onProgress);

      // Actualizar lista de archivos
      setFiles(prev => [storageFile, ...prev]);

      toast({
        title: "¡Éxito!",
        description: `${file.name} subido correctamente`,
      });

      return storageFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: `Error al subir ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  }, [user, toast]);

  const uploadFiles = useCallback(async (
    files: File[],
    onProgress?: (progress: UploadProgress) => void
  ): Promise<StorageFile[]> => {
    const uploadedFiles: StorageFile[] = [];

    for (const file of files) {
      const result = await uploadFile(file, onProgress);
      if (result) {
        uploadedFiles.push(result);
      }
    }

    return uploadedFiles;
  }, [uploadFile]);

  const deleteFile = useCallback(async (fileId: string): Promise<boolean> => {
    try {
      await storageService.deleteFile(fileId);
      
      // Actualizar lista de archivos
      setFiles(prev => prev.filter(f => f.id !== fileId));

      toast({
        title: "Archivo eliminado",
        description: "Archivo eliminado correctamente",
      });

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el archivo",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const getFileUrl = useCallback((path: string): string => {
    return storageService.getPublicUrl(path);
  }, []);

  const validateFile = useCallback((
    file: File, 
    maxSizeMB: number = 100, 
    allowedTypes: string[] = ['image/*', 'video/*', 'audio/*']
  ): boolean => {
    // Validar tipo
    if (!storageService.validateFileType(file, allowedTypes)) {
      toast({
        title: "Tipo de archivo no permitido",
        description: `El tipo ${file.type} no está permitido`,
        variant: "destructive"
      });
      return false;
    }

    // Validar tamaño
    if (!storageService.validateFileSize(file, maxSizeMB)) {
      toast({
        title: "Archivo demasiado grande",
        description: `El archivo excede el límite de ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  }, [toast]);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const getFileType = useCallback((mimeType: string): 'image' | 'video' | 'audio' | 'document' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  }, []);

  return {
    // Estado
    files,
    loading,
    uploading,
    
    // Acciones
    uploadFile,
    uploadFiles,
    deleteFile,
    loadFiles,
    getFileUrl,
    
    // Utilidades
    validateFile,
    formatFileSize,
    getFileType,
  };
} 