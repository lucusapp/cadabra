import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import FeaturedArticleCard from './FeaturedArticleCard';

export default function CategorySection({ category, articles }) {
  if (!articles || articles.length === 0) return null;

  const featured = articles[0];
  const secondary = articles.slice(1, 3);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-600`} />
          <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
        </div>
        <Link 
          to={createPageUrl(`Category?id=${category.id}`)}
          className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-amber-600 transition-colors"
        >
          Ver todo
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Featured Article */}
        <div className="lg:row-span-2">
          <FeaturedArticleCard article={featured} category={category} size="large" />
        </div>

        {/* Secondary Articles */}
        <div className="space-y-4">
          {secondary.map((article) => (
            <FeaturedArticleCard 
              key={article.id} 
              article={article} 
              category={category} 
              size="small" 
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}