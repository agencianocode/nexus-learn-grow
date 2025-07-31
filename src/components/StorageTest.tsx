import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useStorage } from '@/hooks/useStorage';
import { MediaUploader } from './CourseEditor/MediaUploader';
import { MediaLibrary } from './CourseEditor/MediaLibrary';
import { 
  Upload, 
  HardDrive, 
  File, 
  Video, 
  Image, 
  Music,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export function StorageTest() {
  const { user } = useAuth();
  const { files, loading, uploading, loadFiles, deleteFile, formatFileSize } = useStorage();
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');

  const handleFileUpload = (uploadedFiles: any[]) => {
    console.log('Archivos subidos:', uploadedFiles);
    // Recargar la lista de archivos
    loadFiles();
  };

  const handleFileSelect = (file: any) => {
    console.log('Archivo seleccionado:', file);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-medium mb-2">Autenticación Requerida</h3>
            <p className="text-muted-foreground">
              Debes iniciar sesión para probar la funcionalidad de almacenamiento
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🧪 Prueba de Supabase Storage</h1>
        <p className="text-muted-foreground">
          Prueba la integración completa con Supabase Storage
        </p>
      </div>

      {/* Estado del Usuario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Estado del Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-medium">Usuario Autenticado</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ID: {user.id}
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <File className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Archivos Totales</span>
              </div>
              <p className="text-2xl font-bold">{files.length}</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Estado</span>
              </div>
              <div className="flex items-center gap-2">
                {loading && <Badge variant="secondary">Cargando...</Badge>}
                {uploading && <Badge variant="secondary">Subiendo...</Badge>}
                {!loading && !uploading && <Badge variant="default">Listo</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Prueba */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades de Prueba</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'upload' ? 'default' : 'outline'}
              onClick={() => setActiveTab('upload')}
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir Archivos
            </Button>
            <Button
              variant={activeTab === 'library' ? 'default' : 'outline'}
              onClick={() => setActiveTab('library')}
            >
              <HardDrive className="w-4 h-4 mr-2" />
              Biblioteca
            </Button>
          </div>

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">📋 Instrucciones de Prueba:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Arrastra archivos de imagen, video o audio al área de subida</li>
                  <li>• Verifica que se muestre el progreso de subida</li>
                  <li>• Confirma que aparezcan notificaciones de éxito/error</li>
                  <li>• Cambia a "Biblioteca" para ver los archivos subidos</li>
                </ul>
              </div>
              
              <MediaUploader
                onFileUpload={handleFileUpload}
                acceptedTypes={['image/*', 'video/*', 'audio/*']}
                maxFiles={5}
                maxSize={50} // 50MB para pruebas
              />
            </div>
          )}

          {activeTab === 'library' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadFiles}
                    disabled={loading}
                  >
                    Actualizar Lista
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {files.length} archivos encontrados
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando archivos...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-8">
                  <File className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h4 className="font-medium mb-2">No hay archivos</h4>
                  <p className="text-sm text-muted-foreground">
                    Sube archivos desde la pestaña "Subir Archivos"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file) => (
                    <Card key={file.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {file.type.startsWith('image/') && <Image className="w-4 h-4" />}
                            {file.type.startsWith('video/') && <Video className="w-4 h-4" />}
                            {file.type.startsWith('audio/') && <Music className="w-4 h-4" />}
                            <span className="text-sm font-medium truncate">
                              {file.name}
                            </span>
                          </div>
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
                            <HardDrive className="w-3 h-3" />
                            <span>{formatFileSize(file.size)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <File className="w-3 h-3" />
                            <span>{file.type}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(file.url, '_blank')}
                            className="flex-1"
                          >
                            Ver
                          </Button>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteFile(file.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs de Debug */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Logs de Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg text-sm font-mono">
            <div>Usuario ID: {user.id}</div>
            <div>Archivos cargados: {files.length}</div>
            <div>Estado de carga: {loading ? 'Cargando' : 'Completado'}</div>
            <div>Estado de subida: {uploading ? 'Subiendo' : 'Inactivo'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 