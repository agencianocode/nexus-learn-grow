import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Download, 
  Users, 
  Calendar,
  Loader2
} from 'lucide-react';
import { useResources } from '@/hooks/useResources';
import { ResourceAnalytics } from '@/types/resources';

interface ResourceStatsProps {
  lessonId: string;
}

export function ResourceStats({ lessonId }: ResourceStatsProps) {
  const { getResourceAnalytics } = useResources();
  const [analytics, setAnalytics] = useState<ResourceAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadAnalytics();
  }, [lessonId, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getResourceAnalytics(lessonId, parseInt(timeRange));
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-ES');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando estadísticas...</span>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
          <p className="text-muted-foreground text-center">
            Las estadísticas aparecerán cuando los estudiantes comiencen a usar los recursos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Estadísticas de Recursos</h3>
          <p className="text-muted-foreground">
            Análisis del uso de recursos en los últimos días
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 días</SelectItem>
            <SelectItem value="30">30 días</SelectItem>
            <SelectItem value="90">90 días</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Vistas</p>
                <p className="text-2xl font-bold">
                  {formatNumber(analytics.daily_views.reduce((sum, day) => sum + day.views, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Descargas</p>
                <p className="text-2xl font-bold">
                  {formatNumber(analytics.daily_downloads.reduce((sum, day) => sum + day.downloads, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usuarios Únicos</p>
                <p className="text-2xl font-bold">
                  {formatNumber(analytics.user_engagement.length)}
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
                <p className="text-sm font-medium text-muted-foreground">Recursos Activos</p>
                <p className="text-2xl font-bold">
                  {formatNumber(analytics.top_resources.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vistas diarias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Vistas Diarias</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.daily_views.length > 0 ? (
              <div className="space-y-3">
                {analytics.daily_views.slice(-7).map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {formatDate(day.date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, (day.views / Math.max(...analytics.daily_views.map(d => d.views))) * 100)}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {day.views}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay datos de vistas disponibles
              </div>
            )}
          </CardContent>
        </Card>

        {/* Descargas diarias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Descargas Diarias</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.daily_downloads.length > 0 ? (
              <div className="space-y-3">
                {analytics.daily_downloads.slice(-7).map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {formatDate(day.date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, (day.downloads / Math.max(...analytics.daily_downloads.map(d => d.downloads))) * 100)}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {day.downloads}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay datos de descargas disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recursos más populares */}
      {analytics.top_resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recursos Más Populares</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.top_resources.slice(0, 5).map((resource, index) => (
                <div key={resource.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {resource.resource_type} • {resource.category || 'Sin categoría'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-green-600" />
                      <span>{resource.view_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4 text-blue-600" />
                      <span>{resource.download_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usuarios más activos */}
      {analytics.user_engagement.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Usuarios Más Activos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.user_engagement.slice(0, 10).map((user, index) => (
                <div key={user.user_id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">Usuario {user.user_id.slice(0, 8)}...</p>
                      <p className="text-sm text-muted-foreground">
                        {user.activity_count} actividades
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (user.activity_count / Math.max(...analytics.user_engagement.map(u => u.activity_count))) * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {user.activity_count}
                    </span>
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