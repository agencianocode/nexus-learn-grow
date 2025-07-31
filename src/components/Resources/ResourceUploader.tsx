import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Link, 
  FileText, 
  Video, 
  Headphones, 
  Image, 
  Code,
  X,
  Loader2
} from 'lucide-react';
import { LessonResource } from '@/types/resources';
import { useResources } from '@/hooks/useResources';
import { useStorage } from '@/hooks/useStorage';
import { MediaUploader } from '../CourseEditor/MediaUploader';

interface ResourceUploaderProps {
  lessonId: string;
  editingResource?: LessonResource | null;
  onUploadComplete: (resourceData: any) => void;
  onCancel: () => void;
}

export function ResourceUploader({ 
  lessonId, 
  editingResource, 
  onUploadComplete, 
  onCancel 
}: ResourceUploaderProps) {
  const { categories } = useResources();
  const { uploadFile } = useStorage();
  
  const [resourceType, setResourceType] = useState<'attachment' | 'video' | 'audio' | 'document' | 'link'>(
    editingResource?.resource_type || 'attachment'
  );
  const [title, setTitle] = useState(editingResource?.title || '');
  const [description, setDescription] = useState(editingResource?.description || '');
  const [category, setCategory] = useState(editingResource?.category || '');
  const [tags, setTags] = useState<string[]>(editingResource?.tags || []);
  const [isPublic, setIsPublic] = useState(editingResource?.is_public || false);
  const [fileUrl, setFileUrl] = useState(editingResource?.file_url || '');
  const [fileName, setFileName] = useState(editingResource?.file_name || '');
  const [fileSize, setFileSize] = useState(editingResource?.file_size || 0);
  const [fileType, setFileType] = useState(editingResource?.file_type || '');
  const [linkUrl, setLinkUrl] = useState(editingResource?.file_url || '');
  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);

  const resourceTypes = [
    { value: 'attachment', label: 'Archivo', icon: <FileText className="w-4 h-4" /> },
    { value: 'video', label: 'Video', icon: <Video className="w-4 h-4" /> },
    { value: 'audio', label: 'Audio', icon: <Headphones className="w-4 h-4" /> },
    { value: 'image', label: 'Imagen', icon: <Image className="w-4 h-4" /> },
    { value: 'document', label: 'Documento', icon: <FileText className="w-4 h-4" /> },
    { value: 'link', label: 'Enlace', icon: <Link className="w-4 h-4" /> }
  ];

  const handleFileUpload = async (files: any[]) => {
    if (files.length === 0) return;

    const file = files[0];
    setUploading(true);

    try {
      const uploadedFile = await uploadFile(file);
      if (uploadedFile) {
        setFileUrl(uploadedFile.url);
        setFileName(uploadedFile.name);
        setFileSize(uploadedFile.size);
        setFileType(uploadedFile.type);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    const resourceData = {
      title: title.trim(),
      description: description.trim(),
      resource_type: resourceType,
      category: category,
      tags: tags,
      is_public: isPublic,
      file_url: resourceType === 'link' ? linkUrl : fileUrl,
      file_name: fileName,
      file_size: fileSize,
      file_type: fileType
    };

    onUploadComplete(resourceData);
  };

  const isFormValid = title.trim() && (
    resourceType === 'link' ? linkUrl.trim() : fileUrl.trim()
  );

  return (
    <div className="space-y-6">
      {/* Tipo de recurso */}
      <div>
        <Label className="text-base font-medium">Tipo de Recurso</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {resourceTypes.map((type) => (
            <Button
              key={type.value}
              variant={resourceType === type.value ? 'default' : 'outline'}
              className="justify-start h-auto p-3"
              onClick={() => setResourceType(type.value as any)}
            >
              {type.icon}
              <span className="ml-2">{type.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nombre del recurso"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sin categoría</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe el contenido del recurso..."
          className="mt-1"
          rows={3}
        />
      </div>

      {/* Tags */}
      <div>
        <Label>Etiquetas</Label>
        <div className="flex items-center space-x-2 mt-1">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Agregar etiqueta"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          />
          <Button size="sm" onClick={handleAddTag}>
            Agregar
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>#{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Contenido del recurso */}
      {resourceType === 'link' ? (
        <div>
          <Label htmlFor="linkUrl">URL del Enlace *</Label>
          <Input
            id="linkUrl"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1"
          />
        </div>
      ) : (
        <div>
          <Label>Archivo</Label>
          {fileUrl ? (
            <Card className="mt-1">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {fileSize > 0 ? `${(fileSize / 1024 / 1024).toFixed(2)} MB` : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFileUrl('');
                      setFileName('');
                      setFileSize(0);
                      setFileType('');
                    }}
                  >
                    Cambiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-1">
              <MediaUploader
                onFileUpload={handleFileUpload}
                acceptedTypes={resourceType === 'video' ? ['video/*'] : 
                              resourceType === 'audio' ? ['audio/*'] :
                              resourceType === 'image' ? ['image/*'] :
                              resourceType === 'document' ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] :
                              ['*/*']}
                maxFiles={1}
                maxSize={100}
              />
            </div>
          )}
        </div>
      )}

      {/* Configuración de visibilidad */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPublic"
          checked={isPublic}
          onCheckedChange={(checked) => setIsPublic(checked as boolean)}
        />
        <Label htmlFor="isPublic">
          Recurso público (visible para todos los estudiantes)
        </Label>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!isFormValid || uploading}
        >
          {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {editingResource ? 'Actualizar' : 'Crear'} Recurso
        </Button>
      </div>
    </div>
  );
} 