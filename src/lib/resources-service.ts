import { supabase } from '@/integrations/supabase/client';
import { 
  LessonResource, 
  ResourceCategory, 
  ResourceStats, 
  CreateResourceData, 
  UpdateResourceData,
  ResourceSearchFilters,
  ResourceSearchResult,
  ResourceUsageStats,
  ResourceStatsSummary,
  ResourceAnalytics
} from '@/types/resources';

export class ResourcesService {
  /**
   * Obtener recursos de una lección
   */
  async getLessonResources(lessonId: string): Promise<LessonResource[]> {
    try {
      const { data, error } = await supabase
        .from('lesson_resources')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting lesson resources:', error);
      throw error;
    }
  }

  /**
   * Obtener un recurso por ID
   */
  async getResource(resourceId: string): Promise<LessonResource | null> {
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
      throw error;
    }
  }

  /**
   * Crear un nuevo recurso
   */
  async createResource(resourceData: CreateResourceData): Promise<LessonResource> {
    try {
      const { data, error } = await supabase
        .from('lesson_resources')
        .insert(resourceData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  }

  /**
   * Actualizar un recurso
   */
  async updateResource(resourceId: string, updateData: UpdateResourceData): Promise<LessonResource> {
    try {
      const { data, error } = await supabase
        .from('lesson_resources')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', resourceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  }

  /**
   * Eliminar un recurso
   */
  async deleteResource(resourceId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('lesson_resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  }

  /**
   * Buscar recursos con filtros
   */
  async searchResources(filters: ResourceSearchFilters): Promise<ResourceSearchResult[]> {
    try {
      const { data, error } = await supabase
        .rpc('search_resources', {
          search_term: filters.search_term || null,
          lesson_id: filters.lesson_id || null,
          resource_type: filters.resource_type || null,
          category: filters.category || null,
          tags: filters.tags || null
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching resources:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías de recursos
   */
  async getResourceCategories(): Promise<ResourceCategory[]> {
    try {
      const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting resource categories:', error);
      throw error;
    }
  }

  /**
   * Registrar uso de un recurso
   */
  async recordResourceUsage(
    resourceId: string, 
    actionType: 'view' | 'download' | 'play',
    sessionDuration?: number
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('resource_usage_stats')
        .insert({
          resource_id: resourceId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
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
  }

  /**
   * Obtener estadísticas de un recurso
   */
  async getResourceStats(resourceId: string): Promise<ResourceStats | null> {
    try {
      const { data, error } = await supabase
        .rpc('get_resource_stats', { resource_id: resourceId });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error getting resource stats:', error);
      throw error;
    }
  }

  /**
   * Obtener resumen de estadísticas
   */
  async getResourceStatsSummary(lessonId?: string): Promise<ResourceStatsSummary> {
    try {
      let query = supabase
        .from('lesson_resources')
        .select('*');

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data: resources, error: resourcesError } = await query;
      if (resourcesError) throw resourcesError;

      const totalResources = resources?.length || 0;
      const totalViews = resources?.reduce((sum, r) => sum + (r.view_count || 0), 0) || 0;
      const totalDownloads = resources?.reduce((sum, r) => sum + (r.download_count || 0), 0) || 0;

      // Obtener recursos populares
      const popularResources = resources
        ?.sort((a, b) => (b.view_count + b.download_count) - (a.view_count + a.download_count))
        .slice(0, 5) || [];

      // Obtener actividad reciente
      const { data: recentActivity, error: activityError } = await supabase
        .from('resource_usage_stats')
        .select('*')
        .order('action_timestamp', { ascending: false })
        .limit(10);

      if (activityError) throw activityError;

      return {
        total_resources: totalResources,
        total_views: totalViews,
        total_downloads: totalDownloads,
        popular_resources: popularResources,
        recent_activity: recentActivity || []
      };
    } catch (error) {
      console.error('Error getting resource stats summary:', error);
      throw error;
    }
  }

  /**
   * Obtener analytics detallados
   */
  async getResourceAnalytics(lessonId?: string, days: number = 30): Promise<ResourceAnalytics> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Obtener vistas diarias
      const { data: dailyViews, error: viewsError } = await supabase
        .from('resource_usage_stats')
        .select('action_timestamp, action_type')
        .eq('action_type', 'view')
        .gte('action_timestamp', startDate.toISOString());

      if (viewsError) throw viewsError;

      // Obtener descargas diarias
      const { data: dailyDownloads, error: downloadsError } = await supabase
        .from('resource_usage_stats')
        .select('action_timestamp, action_type')
        .eq('action_type', 'download')
        .gte('action_timestamp', startDate.toISOString());

      if (downloadsError) throw downloadsError;

      // Obtener recursos principales
      const { data: topResources, error: topError } = await supabase
        .from('lesson_resources')
        .select('*')
        .order('view_count', { ascending: false })
        .order('download_count', { ascending: false })
        .limit(10);

      if (topError) throw topError;

      // Obtener engagement de usuarios
      const { data: userEngagement, error: engagementError } = await supabase
        .from('resource_usage_stats')
        .select('user_id')
        .gte('action_timestamp', startDate.toISOString());

      if (engagementError) throw engagementError;

      // Procesar datos
      const dailyViewsData = this.processDailyData(dailyViews || [], 'view');
      const dailyDownloadsData = this.processDailyData(dailyDownloads || [], 'download');
      const userEngagementData = this.processUserEngagement(userEngagement || []);

      return {
        daily_views: dailyViewsData,
        daily_downloads: dailyDownloadsData,
        top_resources: topResources || [],
        user_engagement: userEngagementData
      };
    } catch (error) {
      console.error('Error getting resource analytics:', error);
      throw error;
    }
  }

  /**
   * Reordenar recursos
   */
  async reorderResources(resourceIds: string[]): Promise<void> {
    try {
      const updates = resourceIds.map((id, index) => ({
        id,
        order_index: index
      }));

      const { error } = await supabase
        .from('lesson_resources')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
    } catch (error) {
      console.error('Error reordering resources:', error);
      throw error;
    }
  }

  /**
   * Procesar datos diarios
   */
  private processDailyData(data: any[], actionType: string): Array<{ date: string; [key: string]: any }> {
    const dailyCounts: Record<string, number> = {};
    
    data.forEach(item => {
      const date = new Date(item.action_timestamp).toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      [actionType === 'view' ? 'views' : 'downloads']: count
    }));
  }

  /**
   * Procesar engagement de usuarios
   */
  private processUserEngagement(data: any[]): Array<{ user_id: string; activity_count: number }> {
    const userCounts: Record<string, number> = {};
    
    data.forEach(item => {
      userCounts[item.user_id] = (userCounts[item.user_id] || 0) + 1;
    });

    return Object.entries(userCounts).map(([user_id, activity_count]) => ({
      user_id,
      activity_count
    }));
  }
}

// Instancia singleton
export const resourcesService = new ResourcesService(); 