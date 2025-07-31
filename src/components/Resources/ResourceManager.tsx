import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Download,
  Eye,
  FileText,
  Video,
  Headphones,
  Image,
  Link,
  Code,
  Loader2
} from 'lucide-react';
import { LessonResource, ResourceStatsSummary } from '@/types/resources';
import { useResources } from '@/hooks/useResources';
import { useToast } from '@/hooks/use-toast';
import { ResourceList } from './ResourceList';
import { ResourceUploader } from './ResourceUploader';
import { ResourceStats } from './ResourceStats';

interface ResourceManagerProps {
  lessonId: string;
  lessonTitle?: string;
  onResourceAdded?: (resource: LessonResource) => void;
  onResourceUpdated?: (resource: LessonResource) => void;
  onResourceDeleted?: (resourceId: string) => void;
}

export function ResourceManager({ 
  lessonId, 
  lessonTitle = 'Lección',
  onResourceAdded,
  onResourceUpdated,
  onResourceDeleted
}: ResourceManagerProps) {
  const { 
    resources, 
    loading, 
    uploading,
    error,
    getLessonResources,
    createResource,
    updateResource,
    deleteResource,
    getResourceStatsSummary
  } = useResources();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('resources');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<LessonResource | null>(null);
  const [statsSummary, setStatsSummary] = useState<ResourceStatsSummary | null>(null);

  // Cargar recursos al montar el componente
  useEffect(() => {
    loadResources();
  }, [lessonId]);

  // Cargar estadísticas
  useEffect(() => {
    loadStats();
  }, [lessonId, resources]);

  const loadResources = async () => {
    await getLessonResources(lessonId);
  };

  const loadStats = async () => {
    const stats = await getResourceStatsSummary(lessonId);
    setStatsSummary(stats);
  };

  const handleResourceAction = async (action: string, resource: LessonResource) => {
    switch (action) {
      case 'add':
        setShowUploadDialog(true);
        break;
      case 'view':
        if (resource.file_url) {
          window.open(resource.file_url, '_blank');
        }
        break;
      case 'download':
        if (resource.file_url) {
          const link = document.createElement('a');
          link.href = resource.file_url;
          link.download = resource.file_name || resource.title;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        break;
      case 'edit':
        setEditingResource(resource);
        setShowUploadDialog(true);
        break;
      case 'delete':
        if (confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
          const success = await deleteResource(resource.id);
          if (success) {
            onResourceDeleted?.(resource.id);
            toast({
              title: "Éxito",
              description: "Recurso eliminado correctamente"
            });
          }
        }
        break;
    }
  };

  const handleResourceUploaded = async (resourceData: any) => {
    try {
      const newResource = await createResource({
        lesson_id: lessonId,
        title: resourceData.title,
        description: resourceData.description,
        file_url: resourceData.file_url,
        file_name: resourceData.file_name,
        file_size: resourceData.file_size,
        file_type: resourceData.file_type,
        resource_type: resourceData.resource_type,
        category: resourceData.category,
        tags: resourceData.tags,
        is_public: resourceData.is_public || false
      });

      if (newResource) {
        onResourceAdded?.(newResource);
        setShowUploadDialog(false);
        toast({
          title: "Éxito",
          description: "Recurso agregado correctamente"
        });
      }
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el recurso",
        variant: "destructive"
      });
    }
  };

  const handleResourceUpdated = async (resourceData: any) => {
    if (!editingResource) return;

    try {
      const updatedResource = await updateResource(editingResource.id, {
        title: resourceData.title,
        description: resourceData.description,
        file_url: resourceData.file_url,
        file_name: resourceData.file_name,
        file_size: resourceData.file_size,
        file_type: resourceData.file_type,
        resource_type: resourceData.resource_type,
        category: resourceData.category,
        tags: resourceData.tags,
        is_public: resourceData.is_public
      });

      if (updatedResource) {
        onResourceUpdated?.(updatedResource);
        setEditingResource(null);
        setShowUploadDialog(false);
        toast({
          title: "Éxito",
          description: "Recurso actualizado correctamente"
        });
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el recurso",
        variant: "destructive"
      });
    }
  };

  const getResourceTypeStats = () => {
    const stats: Record<string, number> = {};
    resources.forEach(resource => {
      stats[resource.resource_type] = (stats[resource.resource_type] || 0) + 1;
    });
    return stats;
  };

  const getResourceTypeIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Headphones className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'link':
        return <Link className="w-4 h-4" />;
      case 'attachment':
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  const getResourceTypeLabel = (resourceType: string) => {
    switch (resourceType) {
      case 'document':
        return 'Documentos';
      case 'video':
        return 'Videos';
      case 'audio':
        return 'Audio';
      case 'image':
        return 'Imágenes';
      case 'link':
        return 'Enlaces';
      case 'attachment':
      default:
        return 'Archivos';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando recursos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recursos de {lessonTitle}</h2>
          <p className="text-muted-foreground">
            Gestiona los archivos y enlaces asociados a esta lección
          </p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Recurso
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      {statsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{statsSummary.total_resources}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vistas</p>
                  <p className="text-2xl font-bold">{statsSummary.total_views}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Descargas</p>
                  <p className="text-2xl font-bold">{statsSummary.total_downloads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipos</p>
                  <p className="text-2xl font-bold">{new Set(resources.map(r => r.resource_type)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">Recursos</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          <ResourceList
            resources={resources}
            loading={loading}
            onResourceAction={handleResourceAction}
            showFilters={true}
            showPagination={true}
          />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <ResourceStats lessonId={lessonId} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Análisis de Recursos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Distribución por tipo */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Distribución por Tipo</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(getResourceTypeStats()).map(([type, count]) => (
                      <div key={type} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                        {getResourceTypeIcon(type)}
                        <div>
                          <p className="font-medium">{getResourceTypeLabel(type)}</p>
                          <p className="text-sm text-muted-foreground">{count} recursos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recursos populares */}
                {statsSummary?.popular_resources && statsSummary.popular_resources.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recursos Más Populares</h3>
                    <div className="space-y-2">
                      {statsSummary.popular_resources.slice(0, 5).map((resource, index) => (
                        <div key={resource.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {resource.view_count + resource.download_count} interacciones
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{resource.view_count} vistas</span>
                            <span>{resource.download_count} descargas</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para subir/editar recursos */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingResource ? 'Editar Recurso' : 'Agregar Nuevo Recurso'}
            </DialogTitle>
          </DialogHeader>
          <ResourceUploader
            lessonId={lessonId}
            editingResource={editingResource}
            onUploadComplete={editingResource ? handleResourceUpdated : handleResourceUploaded}
            onCancel={() => {
              setShowUploadDialog(false);
              setEditingResource(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Mostrar errores */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 