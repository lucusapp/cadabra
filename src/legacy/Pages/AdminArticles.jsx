import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Wand2, Image as ImageIcon, Link as LinkIcon,
  Loader2, Trash2, Edit, Eye, EyeOff, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

export default function AdminArticles() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createMode, setCreateMode] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        if (u.role !== 'admin' || (u.admin_permissions && !u.admin_permissions.includes('articles'))) {
          window.location.href = createPageUrl('AdminPanel');
          return;
        }
        setUser(u);
      })
      .catch(() => base44.auth.redirectToLogin())
      .finally(() => setLoading(false));
  }, []);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list('-created_date', 100),
    enabled: !!user
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order', 50),
    enabled: !!user
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Article.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-articles']);
      toast.success('Artículo eliminado');
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, is_published }) => base44.entities.Article.update(id, { is_published }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-articles']);
      toast.success('Estado actualizado');
    }
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('AdminPanel')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestión de Artículos</h1>
              <p className="text-slate-500">{articles.length} artículos totales</p>
            </div>
          </div>

          <Dialog open={!!createMode} onOpenChange={(open) => !open && setCreateMode(null)}>
            <div className="flex gap-2">
              <Button onClick={() => setCreateMode('ai')} className="bg-purple-600 hover:bg-purple-700">
                <Wand2 className="w-4 h-4 mr-2" />
                Crear con IA
              </Button>
              <Button onClick={() => setCreateMode('image')} className="bg-blue-600 hover:bg-blue-700">
                <ImageIcon className="w-4 h-4 mr-2" />
                Desde Imagen
              </Button>
              <Button onClick={() => setCreateMode('url')} className="bg-green-600 hover:bg-green-700">
                <LinkIcon className="w-4 h-4 mr-2" />
                Desde URL
              </Button>
            </div>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {createMode === 'ai' && 'Crear Artículo con IA'}
                  {createMode === 'image' && 'Crear Artículo desde Imagen'}
                  {createMode === 'url' && 'Crear Artículo desde URL'}
                </DialogTitle>
              </DialogHeader>
              
              {createMode === 'ai' && <CreateWithAI categories={categories} onClose={() => setCreateMode(null)} />}
              {createMode === 'image' && <CreateFromImage categories={categories} onClose={() => setCreateMode(null)} />}
              {createMode === 'url' && <CreateFromURL categories={categories} onClose={() => setCreateMode(null)} />}
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos los Artículos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {articles.map((article) => (
                <div key={article.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                  {article.cover_image && (
                    <img 
                      src={article.cover_image} 
                      alt={article.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{article.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{article.excerpt}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded">
                        {categories.find(c => c.id === article.category_id)?.name || 'Sin categoría'}
                      </span>
                      {article.source_type === 'web' && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          URL Externa
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePublishMutation.mutate({ 
                        id: article.id, 
                        is_published: !article.is_published 
                      })}
                    >
                      {article.is_published ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                    <Link to={createPageUrl(`Article?id=${article.id}`)}>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('¿Eliminar este artículo?')) {
                          deleteMutation.mutate(article.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CreateWithAI({ categories, onClose }) {
  const [formData, setFormData] = useState({
    description: '',
    category_id: '',
    use_internet: true
  });
  const [generating, setGenerating] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Crea un artículo periodístico completo sobre: ${formData.description}
        
Debes devolver:
- title: título atractivo
- excerpt: resumen de 1-2 líneas
- content: contenido del artículo en markdown (mínimo 300 palabras)
- cover_image: URL de imagen relevante de Unsplash (formato: https://images.unsplash.com/photo-...)
- read_time: minutos estimados de lectura`,
        add_context_from_internet: formData.use_internet,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            excerpt: { type: 'string' },
            content: { type: 'string' },
            cover_image: { type: 'string' },
            read_time: { type: 'number' }
          }
        }
      });

      await base44.entities.Article.create({
        ...result,
        category_id: formData.category_id,
        source_type: 'manual',
        is_published: true,
        slug: result.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });

      queryClient.invalidateQueries(['admin-articles']);
      toast.success('Artículo creado con IA');
      onClose();
    } catch (error) {
      toast.error('Error al generar artículo');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Descripción del artículo que quieres crear</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Ej: Un artículo sobre los mejores restaurantes de Lugo..."
          rows={4}
          required
        />
      </div>

      <div>
        <Label>Categoría</Label>
        <Select
          value={formData.category_id}
          onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.use_internet}
          onCheckedChange={(checked) => setFormData({ ...formData, use_internet: checked })}
        />
        <Label>Usar búsqueda en internet</Label>
      </div>

      <Button type="submit" disabled={generating} className="w-full">
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Generar Artículo
          </>
        )}
      </Button>
    </form>
  );
}

function CreateFromImage({ categories, onClose }) {
  const [formData, setFormData] = useState({
    image: null,
    category_id: ''
  });
  const [generating, setGenerating] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({
        file: formData.image
      });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analiza esta imagen y crea un artículo completo sobre ella.
        
Debes devolver:
- title: título basado en la imagen
- excerpt: resumen de 1-2 líneas
- content: artículo completo en markdown
- read_time: minutos estimados`,
        file_urls: [file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            excerpt: { type: 'string' },
            content: { type: 'string' },
            read_time: { type: 'number' }
          }
        }
      });

      await base44.entities.Article.create({
        ...result,
        cover_image: file_url,
        category_id: formData.category_id,
        source_type: 'manual',
        is_published: true,
        slug: result.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });

      queryClient.invalidateQueries(['admin-articles']);
      toast.success('Artículo creado desde imagen');
      onClose();
    } catch (error) {
      toast.error('Error al procesar imagen');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Imagen</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          required
        />
      </div>

      <div>
        <Label>Categoría</Label>
        <Select
          value={formData.category_id}
          onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={generating} className="w-full">
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analizando...
          </>
        ) : (
          <>
            <ImageIcon className="w-4 h-4 mr-2" />
            Crear Artículo
          </>
        )}
      </Button>
    </form>
  );
}

function CreateFromURL({ categories, onClose }) {
  const [formData, setFormData] = useState({
    url: '',
    category_id: '',
    description: '',
    instructions: ''
  });
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!formData.category_id) {
      toast.error('Selecciona una categoría');
      return;
    }

    setGenerating(true);

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Visita esta URL: ${formData.url}

${formData.description ? `Contexto: ${formData.description}` : ''}

${formData.instructions ? `Instrucciones de redacción: ${formData.instructions}` : ''}

Extrae y crea un artículo completo:
- title: título del contenido
- excerpt: resumen corto (1-2 líneas)
- content: contenido resumido en markdown (mínimo 200 palabras)
- source_name: nombre del sitio web
- read_time: minutos estimados de lectura`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            excerpt: { type: 'string' },
            content: { type: 'string' },
            source_name: { type: 'string' },
            read_time: { type: 'number' }
          }
        }
      });

      // Generar imagen automáticamente
      const { url: generatedImageUrl } = await base44.integrations.Core.GenerateImage({
        prompt: `Imagen ilustrativa para un artículo sobre: ${result.title}. Estilo periodístico profesional.`
      });

      setGeneratedArticle({
        ...result,
        cover_image: generatedImageUrl
      });
      toast.success('Artículo e imagen generados, revisa y edita si es necesario');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar URL: ' + (error.message || 'Error desconocido'));
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Article.create({
        ...generatedArticle,
        category_id: formData.category_id,
        source_type: 'web',
        source_url: formData.url,
        is_published: true,
        slug: generatedArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });

      queryClient.invalidateQueries(['admin-articles']);
      toast.success('Artículo creado desde URL');
      onClose();
    } catch (error) {
      toast.error('Error al guardar artículo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {!generatedArticle ? (
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <Label>URL del artículo</Label>
            <Input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://ejemplo.com/noticia"
              required
            />
          </div>

          <div>
            <Label>Categoría</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Instrucciones de redacción (opcional)</Label>
            <Textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Ej: Redacta en tono informal, enfócate en los beneficios para la comunidad local..."
              rows={3}
            />
          </div>

          <div>
            <Label>Contexto adicional (opcional)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Añade contexto..."
              rows={2}
            />
          </div>

          <Button type="submit" disabled={generating} className="w-full">
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando artículo...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generar Artículo
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Edita el artículo generado</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGeneratedArticle(null)}
            >
              Regenerar
            </Button>
          </div>

          <div>
            <Label>Título</Label>
            <Input
              value={generatedArticle.title}
              onChange={(e) => setGeneratedArticle({ ...generatedArticle, title: e.target.value })}
            />
          </div>

          <div>
            <Label>Resumen</Label>
            <Textarea
              value={generatedArticle.excerpt}
              onChange={(e) => setGeneratedArticle({ ...generatedArticle, excerpt: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <Label>Contenido (Markdown)</Label>
            <Textarea
              value={generatedArticle.content}
              onChange={(e) => setGeneratedArticle({ ...generatedArticle, content: e.target.value })}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <Label>URL de imagen</Label>
            <Input
              value={generatedArticle.cover_image || ''}
              onChange={(e) => setGeneratedArticle({ ...generatedArticle, cover_image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {generatedArticle.cover_image && (
            <img 
              src={generatedArticle.cover_image} 
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fuente</Label>
              <Input
                value={generatedArticle.source_name || ''}
                onChange={(e) => setGeneratedArticle({ ...generatedArticle, source_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Tiempo de lectura (min)</Label>
              <Input
                type="number"
                value={generatedArticle.read_time || 5}
                onChange={(e) => setGeneratedArticle({ ...generatedArticle, read_time: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setGeneratedArticle(null)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Artículo'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}