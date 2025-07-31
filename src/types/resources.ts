// Tipos para el Sistema de Recursos

export interface LessonResource {
  id: string;
  lesson_id: string;
  title: string;
  type: string; // This matches the database column
  url: string; // This matches the database column
  created_at: string;
  // Optional fields that may be missing from database
  description?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  resource_type?: 'attachment' | 'video' | 'audio' | 'document' | 'link';
  category?: string;
  tags?: string[];
  is_public?: boolean;
  download_count?: number;
  view_count?: number;
  order_index?: number;
  updated_at?: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
}

export interface ResourceUsageStats {
  id: string;
  resource_id: string;
  user_id: string;
  action_type: 'view' | 'download' | 'play';
  action_timestamp: string;
  session_duration?: number;
  device_info?: Record<string, any>;
  ip_address?: string;
}

export interface ResourceStats {
  total_views: number;
  total_downloads: number;
  unique_users: number;
  avg_session_duration?: number;
  recent_activity: Array<{
    action_type: string;
    timestamp: string;
    user_id: string;
  }>;
}

export interface ResourceSearchFilters {
  search_term?: string;
  lesson_id?: string;
  resource_type?: string;
  category?: string;
  tags?: string[];
  is_public?: boolean;
}

export interface ResourceSearchResult extends LessonResource {
  relevance_score: number;
}

export interface CreateResourceData {
  lesson_id: string;
  title: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  resource_type: 'attachment' | 'video' | 'audio' | 'document' | 'link';
  category?: string;
  tags?: string[];
  is_public?: boolean;
  order_index?: number;
}

export interface UpdateResourceData {
  title?: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  resource_type?: 'attachment' | 'video' | 'audio' | 'document' | 'link';
  category?: string;
  tags?: string[];
  is_public?: boolean;
  order_index?: number;
}

export interface ResourceUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface ResourceFile {
  file: File;
  preview?: string;
  uploadProgress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export interface ResourceStatsSummary {
  total_resources: number;
  total_views: number;
  total_downloads: number;
  popular_resources: LessonResource[];
  recent_activity: ResourceUsageStats[];
}

export interface ResourceAnalytics {
  daily_views: Array<{ date: string; views: number }>;
  daily_downloads: Array<{ date: string; downloads: number }>;
  top_resources: Array<LessonResource & { stats: ResourceStats }>;
  user_engagement: Array<{ user_id: string; activity_count: number }>;
}

// Enums para tipos de recursos
export enum ResourceType {
  ATTACHMENT = 'attachment',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  LINK = 'link'
}

export enum ResourceActionType {
  VIEW = 'view',
  DOWNLOAD = 'download',
  PLAY = 'play'
}

// Constantes para categorías predefinidas
export const DEFAULT_CATEGORIES = [
  { name: 'Documentos', color: '#EF4444', icon: 'file-text' },
  { name: 'Videos', color: '#10B981', icon: 'video' },
  { name: 'Audio', color: '#F59E0B', icon: 'headphones' },
  { name: 'Imágenes', color: '#8B5CF6', icon: 'image' },
  { name: 'Enlaces', color: '#06B6D4', icon: 'link' },
  { name: 'Ejercicios', color: '#84CC16', icon: 'book-open' },
  { name: 'Plantillas', color: '#F97316', icon: 'download' },
  { name: 'Código', color: '#6366F1', icon: 'code' }
] as const;

// Tipos para filtros de búsqueda
export interface ResourceFilters {
  search: string;
  category: string;
  resourceType: string;
  tags: string[];
  isPublic: boolean;
  sortBy: 'relevance' | 'date' | 'title' | 'downloads' | 'views';
  sortOrder: 'asc' | 'desc';
}

// Tipos para componentes de UI
export interface ResourceCardProps {
  resource: LessonResource;
  onView?: (resource: LessonResource) => void;
  onDownload?: (resource: LessonResource) => void;
  onEdit?: (resource: LessonResource) => void;
  onDelete?: (resource: LessonResource) => void;
  showStats?: boolean;
  showActions?: boolean;
}

export interface ResourceListProps {
  resources: LessonResource[];
  loading?: boolean;
  onResourceAction?: (action: string, resource: LessonResource) => void;
  showFilters?: boolean;
  showPagination?: boolean;
}

export interface ResourceUploadProps {
  lessonId: string;
  onUploadComplete?: (resource: LessonResource) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
} 