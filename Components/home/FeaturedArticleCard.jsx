import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturedArticleCard({ article, category, size = 'large' }) {
  const isLarge = size === 'large';
  
  return (
    <Link to={createPageUrl(`Article?id=${article.id}`)}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
          isLarge ? 'h-[420px]' : 'h-[280px]'
        }`}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={article.cover_image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          {/* Category Badge */}
          {category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium w-fit mb-3">
              {category.name}
            </span>
          )}

          {/* Title */}
          <h2 className={`text-white font-semibold leading-tight mb-2 line-clamp-2 ${
            isLarge ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
          }`}>
            {article.title}
          </h2>

          {/* Excerpt */}
          {article.excerpt && (
            <p className={`text-white/70 line-clamp-2 mb-4 ${
              isLarge ? 'text-base' : 'text-sm'
            }`}>
              {article.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-white/60 text-sm">
            {article.read_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.read_time} min
              </span>
            )}
            {article.points_reward && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                +{article.points_reward} pts
              </span>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.article>
    </Link>
  );
}