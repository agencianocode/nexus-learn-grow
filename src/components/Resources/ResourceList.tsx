import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Plus,
  Loader2,
  FileText,
  Video,
  Headphones,
  Image,
  Link,
  Download,
  Code
} from 'lucide-react';
import { LessonResource, ResourceListProps, ResourceFilters } from '@/types/resources';
import { useResources } from '@/hooks/useResources';
import { ResourceCard } from './ResourceCard';

export function ResourceList({ 
  resources, 
  loading = false, 
  onResourceAction,
  showFilters = true,
  showPagination = true 
}: ResourceListProps) {
  const { categories } = useResources();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ResourceFilters>({
    search: '',
    category: '',
    resourceType: '',
    tags: [],
    isPublic: false,
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [filteredResources, setFilteredResources] = useState<LessonResource[]>(resources);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let filtered = [...resources];

    // Filtro de búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.description?.toLowerCase().includes(searchTerm) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filtro de categoría
    if (filters.category) {
      filtered = filtered.filter(resource => resource.category === filters.category);
    }

    // Filtro de tipo de recurso
    if (filters.resourceType) {
      filtered = filtered.filter(resource => resource.resource_type === filters.resourceType);
    }

    // Filtro de público
    if (filters.isPublic) {
      filtered = filtered.filter(resource => resource.is_public);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case 'downloads':
          comparison = (b.download_count || 0) - (a.download_count || 0);
          break;
        case 'views':
          comparison = (b.view_count || 0) - (a.view_count || 0);
          break;
        default:
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }

      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });

    setFilteredResources(filtered);
  }, [resources, filters]);

  const handleResourceAction = (action: string, resource: LessonResource) => {
    onResourceAction?.(action, resource);
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

  const resourceTypes = [
    { value: '', label: 'Todos los tipos' },
    { value: 'document', label: 'Documentos' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'image', label: 'Imágenes' },
    { value: 'link', label: 'Enlaces' },
    { value: 'attachment', label: 'Archivos' }
  ];

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
      {/* Header con filtros */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Recursos ({filteredResources.length})
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar recursos..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>

              {/* Filtro de categoría */}
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro de tipo */}
              <Select
                value={filters.resourceType}
                onValueChange={(value) => setFilters(prev => ({ ...prev, resourceType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Ordenamiento */}
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-') as [any, 'asc' | 'desc'];
                  setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Más recientes</SelectItem>
                  <SelectItem value="date-asc">Más antiguos</SelectItem>
                  <SelectItem value="title-asc">A-Z</SelectItem>
                  <SelectItem value="title-desc">Z-A</SelectItem>
                  <SelectItem value="views-desc">Más vistos</SelectItem>
                  <SelectItem value="downloads-desc">Más descargados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtros adicionales */}
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="public-only"
                  checked={filters.isPublic}
                  onChange={(e) => setFilters(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="public-only" className="text-sm">
                  Solo recursos públicos
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de recursos */}
      {filteredResources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No hay recursos</h3>
                <p className="text-muted-foreground">
                  {filters.search || filters.category || filters.resourceType
                    ? 'No se encontraron recursos con los filtros aplicados'
                    : 'Aún no se han agregado recursos a esta lección'}
                </p>
              </div>
              {filters.search || filters.category || filters.resourceType ? (
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    search: '',
                    category: '',
                    resourceType: '',
                    tags: [],
                    isPublic: false,
                    sortBy: 'date',
                    sortOrder: 'desc'
                  })}
                >
                  Limpiar filtros
                </Button>
              ) : (
                <Button onClick={() => handleResourceAction('add', {} as LessonResource)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar primer recurso
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onView={(resource) => handleResourceAction('view', resource)}
              onDownload={(resource) => handleResourceAction('download', resource)}
              onEdit={(resource) => handleResourceAction('edit', resource)}
              onDelete={(resource) => handleResourceAction('delete', resource)}
              showStats={true}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Estadísticas rápidas */}
      {filteredResources.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {filteredResources.length}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {filteredResources.reduce((sum, r) => sum + (r.view_count || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Vistas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredResources.reduce((sum, r) => sum + (r.download_count || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Descargas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(filteredResources.map(r => r.resource_type)).size}
                </div>
                <div className="text-sm text-muted-foreground">Tipos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 