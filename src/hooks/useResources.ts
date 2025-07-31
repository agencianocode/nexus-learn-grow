import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { 
  LessonResource, 
  ResourceCategory, 
  ResourceStats, 
  CreateResourceData, 
  UpdateResourceData,
  ResourceSearchFilters,
  ResourceSearchResult,
  ResourceStatsSummary,
  ResourceAnalytics
} from '@/types/resources';
import { supabase } from '@/integrations/supabase/client';

export interface UseResourcesReturn {
  // Estado
  resources: LessonResource[];
  categories: ResourceCategory[];
  loading: boolean;
  uploading: boolean;
  error: string | null;

  // Acciones básicas
  getLessonResources: (lessonId: string) => Promise<LessonResource[]>;
  getResource: (resourceId: string) => Promise<LessonResource | null>;
  createResource: (resourceData: CreateResourceData) => Promise<LessonResource | null>;
  updateResource: (resourceId: string, updateData: UpdateResourceData) => Promise<LessonResource | null>;
  deleteResource: (resourceId: string) => Promise<boolean>;
  
  // Búsqueda y filtros
  searchResources: (filters: ResourceSearchFilters) => Promise<ResourceSearchResult[]>;
  getResourceCategories: () => Promise<ResourceCategory[]>;
  
  // Estadísticas
  recordResourceUsage: (resourceId: string, actionType: 'view' | 'download' | 'play', sessionDuration?: number) => Promise<void>;
  getResourceStats: (resourceId: string) => Promise<ResourceStats | null>;
  getResourceStatsSummary: (lessonId?: string) => Promise<ResourceStatsSummary | null>;
  getResourceAnalytics: (lessonId?: string, days?: number) => Promise<ResourceAnalytics | null>;
  
  // Utilidades
  reorderResources: (resourceIds: string[]) => Promise<void>;
  clearError: () => void;
}

export function useResources(): UseResourcesReturn {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<LessonResource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Obtener recursos de una lección
  const getLessonResources = useCallback(async (lessonId: string): Promise<LessonResource[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lesson_resources')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const lessonResources = data || [];
      setResources(lessonResources);
      return lessonResources;
    } catch (error) {
      console.error('Error getting lesson resources:', error);
      setError('Error al cargar los recursos');
      toast({
        title: "Error",
        description: "No se pudieron cargar los recursos",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Obtener un recurso por ID
  const getResource = useCallback(async (resourceId: string): Promise<LessonResource | null> => {
    try {
      const { data, error } = await supabase
        .from('lesson_resources')
        .select('*')
        .eq('id', resourceId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting resource:', error);
      setError('Error al obtener el recurso');
      return null;
    }
  }, []);

  // Crear un nuevo recurso
  const createResource = useCallback(async (resourceData: CreateResourceData): Promise<LessonResource | null> => {
    try {
      setUploading(true);
      const { data, error } = await supabase
        .from('lesson_resources')
        .insert({
          lesson_id: resourceData.lesson_id,
          title: resourceData.title,
          description: resourceData.description,
          file_url: resourceData.file_url,
          file_name: resourceData.file_name,
          file_size: resourceData.file_size,
          file_type: resourceData.file_type,
          resource_type: resourceData.resource_type,
          category: resourceData.category,
          tags: resourceData.tags,
          is_public: resourceData.is_public || false,
          order_index: resourceData.order_index || 0
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Recurso creado correctamente"
      });

      // Actualizar la lista local
      setResources(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error creating resource:', error);
      setError('Error al crear el recurso');
      toast({
        title: "Error",
        description: "No se pudo crear el recurso",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  }, [toast]);

  // Actualizar un recurso
  const updateResource = useCallback(async (resourceId: string, updateData: UpdateResourceData): Promise<LessonResource | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lesson_resources')
        .update({ 
          ...updateData, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', resourceId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Recurso actualizado correctamente"
      });

      // Actualizar la lista local
      setResources(prev => prev.map(r => r.id === resourceId ? data : r));
      return data;
    } catch (error) {
      console.error('Error updating resource:', error);
      setError('Error al actualizar el recurso');
      toast({
        title: "Error",
        description: "No se pudo actualizar el recurso",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Eliminar un recurso
  const deleteResource = useCallback(async (resourceId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('lesson_resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Recurso eliminado correctamente"
      });

      // Actualizar la lista local
      setResources(prev => prev.filter(r => r.id !== resourceId));
      return true;
    } catch (error) {
      console.error('Error deleting resource:', error);
      setError('Error al eliminar el recurso');
      toast({
        title: "Error",
        description: "No se pudo eliminar el recurso",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Buscar recursos
  const searchResources = useCallback(async (filters: ResourceSearchFilters): Promise<ResourceSearchResult[]> => {
    try {
      setLoading(true);
      
      // Construir query base
      let query = supabase
        .from('lesson_resources')
        .select('*');

      // Aplicar filtros
      if (filters.lesson_id) {
        query = query.eq('lesson_id', filters.lesson_id);
      }
      if (filters.resource_type) {
        query = query.eq('resource_type', filters.resource_type);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filtrar por término de búsqueda si existe
      let results = data || [];
      if (filters.search_term) {
        const searchTerm = filters.search_term.toLowerCase();
        results = results.filter(resource => 
          resource.title.toLowerCase().includes(searchTerm) ||
          resource.description?.toLowerCase().includes(searchTerm) ||
          resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Calcular puntuación de relevancia
      const searchResults: ResourceSearchResult[] = results.map(resource => ({
        ...resource,
        relevance_score: filters.search_term ? 
          (resource.title.toLowerCase().includes(filters.search_term.toLowerCase()) ? 1.0 : 0.5) : 0.5
      }));

      return searchResults.sort((a, b) => b.relevance_score - a.relevance_score);
    } catch (error) {
      console.error('Error searching resources:', error);
      setError('Error al buscar recursos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener categorías
  const getResourceCategories = useCallback(async (): Promise<ResourceCategory[]> => {
    try {
      const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      const categoriesData = data || [];
      setCategories(categoriesData);
      return categoriesData;
    } catch (error) {
      console.error('Error getting resource categories:', error);
      // Usar categorías por defecto si hay error
      const defaultCategories: ResourceCategory[] = [
        { id: '1', name: 'Documentos', description: 'PDFs, Word, PowerPoint, etc.', color: '#EF4444', icon: 'file-text', is_active: true, created_at: new Date().toISOString() },
        { id: '2', name: 'Videos', description: 'Videos educativos y tutoriales', color: '#10B981', icon: 'video', is_active: true, created_at: new Date().toISOString() },
        { id: '3', name: 'Audio', description: 'Podcasts y audios explicativos', color: '#F59E0B', icon: 'headphones', is_active: true, created_at: new Date().toISOString() },
        { id: '4', name: 'Imágenes', description: 'Infografías, diagramas, fotos', color: '#8B5CF6', icon: 'image', is_active: true, created_at: new Date().toISOString() },
        { id: '5', name: 'Enlaces', description: 'Recursos externos y referencias', color: '#06B6D4', icon: 'link', is_active: true, created_at: new Date().toISOString() },
        { id: '6', name: 'Ejercicios', description: 'Actividades y prácticas', color: '#84CC16', icon: 'book-open', is_active: true, created_at: new Date().toISOString() },
        { id: '7', name: 'Plantillas', description: 'Archivos descargables reutilizables', color: '#F97316', icon: 'download', is_active: true, created_at: new Date().toISOString() },
        { id: '8', name: 'Código', description: 'Scripts y ejemplos de código', color: '#6366F1', icon: 'code', is_active: true, created_at: new Date().toISOString() }
      ];
      setCategories(defaultCategories);
      return defaultCategories;
    }
  }, []);

  // Registrar uso de recurso
  const recordResourceUsage = useCallback(async (
    resourceId: string, 
    actionType: 'view' | 'download' | 'play',
    sessionDuration?: number
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('resource_usage_stats')
        .insert({
          resource_id: resourceId,
          user_id: user?.id,
          action_type: actionType,
          session_duration: sessionDuration,
          device_info: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording resource usage:', error);
      // No lanzar error para no interrumpir la experiencia del usuario
    }
  }, [user]);

  // Obtener estadísticas de un recurso
  const getResourceStats = useCallback(async (resourceId: string): Promise<ResourceStats | null> => {
    try {
      const { data, error } = await supabase
        .from('resource_usage_stats')
        .select('*')
        .eq('resource_id', resourceId);

      if (error) throw error;

      const stats = data || [];
      const totalViews = stats.filter(s => s.action_type === 'view').length;
      const totalDownloads = stats.filter(s => s.action_type === 'download').length;
      const uniqueUsers = new Set(stats.map(s => s.user_id)).size;
      const avgSessionDuration = stats
        .filter(s => s.session_duration)
        .reduce((sum, s) => sum + (s.session_duration || 0), 0) / 
        stats.filter(s => s.session_duration).length || 0;

      return {
        total_views: totalViews,
        total_downloads: totalDownloads,
        unique_users: uniqueUsers,
        avg_session_duration: avgSessionDuration,
        recent_activity: stats.slice(0, 10).map(s => ({
          action_type: s.action_type,
          timestamp: s.action_timestamp,
          user_id: s.user_id
        }))
      };
    } catch (error) {
      console.error('Error getting resource stats:', error);
      return null;
    }
  }, []);

  // Obtener resumen de estadísticas
  const getResourceStatsSummary = useCallback(async (lessonId?: string): Promise<ResourceStatsSummary | null> => {
    try {
      let query = supabase
        .from('lesson_resources')
        .select('*');

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data: resources, error } = await query;
      if (error) throw error;

      const resourcesData = resources || [];
      const totalResources = resourcesData.length;
      const totalViews = resourcesData.reduce((sum, r) => sum + (r.view_count || 0), 0);
      const totalDownloads = resourcesData.reduce((sum, r) => sum + (r.download_count || 0), 0);

      const popularResources = resourcesData
        .sort((a, b) => (b.view_count + b.download_count) - (a.view_count + a.download_count))
        .slice(0, 5);

      const { data: recentActivity } = await supabase
        .from('resource_usage_stats')
        .select('*')
        .order('action_timestamp', { ascending: false })
        .limit(10);

      return {
        total_resources: totalResources,
        total_views: totalViews,
        total_downloads: totalDownloads,
        popular_resources: popularResources,
        recent_activity: recentActivity || []
      };
    } catch (error) {
      console.error('Error getting resource stats summary:', error);
      return null;
    }
  }, []);

  // Obtener analytics
  const getResourceAnalytics = useCallback(async (lessonId?: string, days: number = 30): Promise<ResourceAnalytics | null> => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Obtener datos de uso
      const { data: usageStats, error } = await supabase
        .from('resource_usage_stats')
        .select('*')
        .gte('action_timestamp', startDate.toISOString());

      if (error) throw error;

      const stats = usageStats || [];
      
      // Procesar datos diarios
      const dailyViews: Record<string, number> = {};
      const dailyDownloads: Record<string, number> = {};
      
      stats.forEach(stat => {
        const date = new Date(stat.action_timestamp).toISOString().split('T')[0];
        if (stat.action_type === 'view') {
          dailyViews[date] = (dailyViews[date] || 0) + 1;
        } else if (stat.action_type === 'download') {
          dailyDownloads[date] = (dailyDownloads[date] || 0) + 1;
        }
      });

      // Obtener recursos principales
      const { data: topResources } = await supabase
        .from('lesson_resources')
        .select('*')
        .order('view_count', { ascending: false })
        .order('download_count', { ascending: false })
        .limit(10);

      // Procesar engagement de usuarios
      const userEngagement: Record<string, number> = {};
      stats.forEach(stat => {
        userEngagement[stat.user_id] = (userEngagement[stat.user_id] || 0) + 1;
      });

      return {
        daily_views: Object.entries(dailyViews).map(([date, views]) => ({ date, views })),
        daily_downloads: Object.entries(dailyDownloads).map(([date, downloads]) => ({ date, downloads })),
        top_resources: topResources || [],
        user_engagement: Object.entries(userEngagement).map(([user_id, activity_count]) => ({ user_id, activity_count }))
      };
    } catch (error) {
      console.error('Error getting resource analytics:', error);
      return null;
    }
  }, []);

  // Reordenar recursos
  const reorderResources = useCallback(async (resourceIds: string[]): Promise<void> => {
    try {
      const updates = resourceIds.map((id, index) => ({
        id,
        order_index: index
      }));

      const { error } = await supabase
        .from('lesson_resources')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      // Actualizar lista local
      setResources(prev => {
        const updated = [...prev];
        resourceIds.forEach((id, index) => {
          const resourceIndex = updated.findIndex(r => r.id === id);
          if (resourceIndex !== -1) {
            updated[resourceIndex] = { ...updated[resourceIndex], order_index: index };
          }
        });
        return updated.sort((a, b) => a.order_index - b.order_index);
      });
    } catch (error) {
      console.error('Error reordering resources:', error);
      setError('Error al reordenar recursos');
    }
  }, []);

  // Cargar categorías al inicializar
  useEffect(() => {
    getResourceCategories();
  }, [getResourceCategories]);

  return {
    // Estado
    resources,
    categories,
    loading,
    uploading,
    error,

    // Acciones básicas
    getLessonResources,
    getResource,
    createResource,
    updateResource,
    deleteResource,
    
    // Búsqueda y filtros
    searchResources,
    getResourceCategories,
    
    // Estadísticas
    recordResourceUsage,
    getResourceStats,
    getResourceStatsSummary,
    getResourceAnalytics,
    
    // Utilidades
    reorderResources,
    clearError
  };
} 