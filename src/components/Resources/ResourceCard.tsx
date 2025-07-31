import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Video, 
  Headphones, 
  Image, 
  Link, 
  BookOpen, 
  Download, 
  Code,
  Eye,
  Download as DownloadIcon,
  Play,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  HardDrive
} from 'lucide-react';
import { LessonResource, ResourceCardProps } from '@/types/resources';
import { useResources } from '@/hooks/useResources';
import { formatFileSize } from '@/lib/utils';

const getResourceIcon = (resourceType: string) => {
  switch (resourceType) {
    case 'document':
      return <FileText className="w-5 h-5" />;
    case 'video':
      return <Video className="w-5 h-5" />;
    case 'audio':
      return <Headphones className="w-5 h-5" />;
    case 'image':
      return <Image className="w-5 h-5" />;
    case 'link':
      return <Link className="w-5 h-5" />;
    case 'attachment':
    default:
      return <Download className="w-5 h-5" />;
  }
};

const getResourceTypeLabel = (resourceType: string) => {
  switch (resourceType) {
    case 'document':
      return 'Documento';
    case 'video':
      return 'Video';
    case 'audio':
      return 'Audio';
    case 'image':
      return 'Imagen';
    case 'link':
      return 'Enlace';
    case 'attachment':
    default:
      return 'Archivo';
  }
};

const getResourceColor = (resourceType: string) => {
  switch (resourceType) {
    case 'document':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'video':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'audio':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'image':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'link':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'attachment':
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

export function ResourceCard({ 
  resource, 
  onView, 
  onDownload, 
  onEdit, 
  onDelete, 
  showStats = true, 
  showActions = true 
}: ResourceCardProps) {
  const { recordResourceUsage } = useResources();

  const handleView = async () => {
    await recordResourceUsage(resource.id, 'view');
    onView?.(resource);
  };

  const handleDownload = async () => {
    await recordResourceUsage(resource.id, 'download');
    onDownload?.(resource);
  };

  const handlePlay = async () => {
    await recordResourceUsage(resource.id, 'play');
    onView?.(resource);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isVideo = resource.resource_type === 'video';
  const isAudio = resource.resource_type === 'audio';
  const isLink = resource.resource_type === 'link';

  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getResourceColor(resource.resource_type)}`}>
              {getResourceIcon(resource.resource_type)}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {resource.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {getResourceTypeLabel(resource.resource_type)}
                </Badge>
                {resource.category && (
                  <Badge variant="outline" className="text-xs">
                    {resource.category}
                  </Badge>
                )}
                {resource.is_public && (
                  <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                    Público
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isVideo || isAudio ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePlay}
                  className="h-8 w-8 p-0"
                >
                  <Play className="w-4 h-4" />
                </Button>
              ) : isLink ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleView}
                  className="h-8 w-8 p-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleView}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              
              {resource.file_url && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDownload}
                  className="h-8 w-8 p-0"
                >
                  <DownloadIcon className="w-4 h-4" />
                </Button>
              )}
              
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(resource)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(resource)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {resource.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {resource.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            {resource.file_size && (
              <div className="flex items-center space-x-1">
                <HardDrive className="w-3 h-3" />
                <span>{formatFileSize(resource.file_size)}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(resource.created_at)}</span>
            </div>
          </div>
          
          {showStats && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{resource.view_count}</span>
              </div>
              {resource.download_count > 0 && (
                <div className="flex items-center space-x-1">
                  <DownloadIcon className="w-3 h-3" />
                  <span>{resource.download_count}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{resource.tags.length - 3} más
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 