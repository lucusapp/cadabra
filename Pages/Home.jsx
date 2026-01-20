import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';
import { MoreVertical, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.filter({ is_active: true }, 'order', 20),
  });

  const { data: articles = [], isLoading: loadingArticles } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ is_published: true }, '-created_date', 50),
  });

  const articlesByCategory = categories.map(category => ({
    category,
    articles: articles.filter(a => a.category_id === category.id).slice(0, 2),
  })).filter(group => group.articles.length > 0);

  if (loadingCategories || loadingArticles) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Cargando contenido..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-16 bg-white z-10 border-b border-slate-200">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">SIGUIENDO</h1>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Buscar entre lo que sigues"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-100 border-0 rounded-lg"
              />
            </div>
            <Button variant="ghost" size="icon" className="shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid Layout - Estilo Flipboard */}
      <div className="p-2 md:p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {articlesByCategory.flatMap((group, groupIndex) =>
            group.articles.map((article, articleIndex) => {
              const index = groupIndex * 2 + articleIndex;
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={createPageUrl(`Article?id=${article.id}`)}>
                    <div className="relative aspect-square rounded-lg overflow-hidden group">
                      {/* Background Image */}
                      <img
                        src={article.cover_image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600'}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                      
                      {/* Category Label */}
                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                        <span className="text-white text-xs font-bold uppercase tracking-wider">
                          {group.category.name}
                        </span>
                        <button className="text-white/90 hover:text-white">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Article Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white text-sm font-semibold leading-tight line-clamp-3">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}