import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useResources } from '@/hooks/useResources';
import { ResourceManager } from '@/components/Resources/ResourceManager';
import { 
  FileText, 
  Video, 
  Headphones, 
  Image, 
  Link, 
  Download,
  Eye,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

export default function ResourceTest() {
  const { user } = useAuth();
  const { 
    resources, 
    categories, 
    loading, 
    getResourceStatsSummary,
    getResourceAnalytics 
  } = useResources();

  // ID de lección de prueba (puedes cambiar esto)
  const testLessonId = 'test-lesson-123';

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Acceso Requerido</h3>
                <p className="text-muted-foreground">
                  Necesitas iniciar sesión para probar el sistema de recursos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Sistema de Recursos - Prueba</h1>
        <p className="text-muted-foreground">
          Prueba todas las funcionalidades del sistema de recursos para lecciones
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline">
            <FileText className="w-4 h-4 mr-1" />
            Gestión de archivos
          </Badge>
          <Badge variant="outline">
            <Video className="w-4 h-4 mr-1" />
            Categorización
          </Badge>
          <Badge variant="outline">
            <Eye className="w-4 h-4 mr-1" />
            Control de acceso
          </Badge>
          <Badge variant="outline">
            <TrendingUp className="w-4 h-4 mr-1" />
            Estadísticas
          </Badge>
        </div>
      </div>

      {/* Información del usuario */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuario</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Autenticado
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categorías</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recursos</p>
                <p className="text-2xl font-bold">{resources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipos</p>
                <p className="text-2xl font-bold">
                  {new Set(resources.map(r => r.resource_type)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <p className="text-2xl font-bold">
                  {loading ? '...' : 'Listo'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestor de Recursos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Gestor de Recursos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceManager 
            lessonId={testLessonId}
            lessonTitle="Lección de Prueba"
            onResourceAdded={(resource) => {
              console.log('Recurso agregado:', resource);
            }}
            onResourceUpdated={(resource) => {
              console.log('Recurso actualizado:', resource);
            }}
            onResourceDeleted={(resourceId) => {
              console.log('Recurso eliminado:', resourceId);
            }}
          />
        </CardContent>
      </Card>

      {/* Información de desarrollo */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Desarrollo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Funcionalidades Implementadas:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Gestión de archivos adjuntos</li>
                <li>✅ Categorización de recursos</li>
                <li>✅ Control de acceso por lección</li>
                <li>✅ Búsqueda y filtros avanzados</li>
                <li>✅ Estadísticas de uso</li>
                <li>✅ Subida de archivos multimedia</li>
                <li>✅ Integración con Supabase Storage</li>
                <li>✅ Analytics detallados</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Componentes Creados:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>📁 ResourceManager - Gestor principal</li>
                <li>📋 ResourceList - Lista con filtros</li>
                <li>🃏 ResourceCard - Tarjeta individual</li>
                <li>📤 ResourceUploader - Subida de archivos</li>
                <li>📊 ResourceStats - Estadísticas</li>
                <li>🎣 useResources - Hook personalizado</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Base de Datos:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>🗄️ lesson_resources - Tabla principal</li>
                <li>📈 resource_usage_stats - Estadísticas</li>
                <li>🏷️ resource_categories - Categorías</li>
                <li>🔍 Funciones de búsqueda SQL</li>
                <li>🔒 Políticas RLS configuradas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 