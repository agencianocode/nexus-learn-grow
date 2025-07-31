import { supabase } from '@/integrations/supabase/client';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface StorageFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  created_at: string;
  updated_at: string;
}

export class SupabaseStorageService {
  private bucketName = 'course-media';

  /**
   * Sube un archivo a Supabase Storage
   */
  async uploadFile(
    file: File,
    path: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<StorageFile> {
    try {
      // Verificar que el bucket existe
      await this.ensureBucketExists();

      // Subir archivo
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Error al subir archivo: ${error.message}`);
      }

      // Simular progreso para archivos grandes
      if (onProgress && file.size > 1024 * 1024) { // Solo para archivos > 1MB
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          onProgress({
            loaded: (progress / 100) * file.size,
            total: file.size,
            percentage: progress
          });
        }, 100);
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(path);

      return {
        id: data.path,
        name: file.name,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error en uploadFile:', error);
      throw error;
    }
  }

  /**
   * Elimina un archivo de Supabase Storage
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([path]);

      if (error) {
        throw new Error(`Error al eliminar archivo: ${error.message}`);
      }
    } catch (error) {
      console.error('Error en deleteFile:', error);
      throw error;
    }
  }

  /**
   * Lista archivos en un directorio
   */
  async listFiles(folder: string = ''): Promise<StorageFile[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(folder);

      if (error) {
        throw new Error(`Error al listar archivos: ${error.message}`);
      }

      return data.map(file => ({
        id: file.id,
        name: file.name,
        url: this.getPublicUrl(`${folder}/${file.name}`),
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || '',
        created_at: file.created_at,
        updated_at: file.updated_at
      }));
    } catch (error) {
      console.error('Error en listFiles:', error);
      throw error;
    }
  }

  /**
   * Obtiene la URL pública de un archivo
   */
  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  /**
   * Asegura que el bucket existe
   */
  private async ensureBucketExists(): Promise<void> {
    try {
      // Intentar listar archivos para verificar que el bucket existe
      await supabase.storage
        .from(this.bucketName)
        .list('', { limit: 1 });
    } catch (error) {
      // Si el bucket no existe, lo creamos
      console.log('Bucket no encontrado, creando...');
      // Nota: La creación de buckets requiere permisos de administrador
      // En producción, esto debería hacerse desde el dashboard de Supabase
      throw new Error('Bucket no encontrado. Por favor, crea el bucket "course-media" en Supabase Storage.');
    }
  }

  /**
   * Genera un nombre único para el archivo
   */
  generateUniquePath(file: File, userId: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomId}.${extension}`;
    
    return `${userId}/${fileName}`;
  }

  /**
   * Valida el tipo de archivo
   */
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.replace('/*', '');
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });
  }

  /**
   * Valida el tamaño del archivo
   */
  validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
}

// Instancia singleton
export const storageService = new SupabaseStorageService(); 