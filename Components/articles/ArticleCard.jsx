import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Clock, Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ArticleCard({ article, index = 0, variant = 'default' }) {
  const isCompact = variant === 'compact';

  return (
    <Link to={createPageUrl(`Article?id=${article.id}`)}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        whileHover={{ y: -4 }}
        className={`group cursor-pointer ${isCompact ? '' : 'h-full'}`}
      >
        <div className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
          isCompact ? 'flex gap-4' : 'h-full flex flex-col'
        }`}>
          {/* Image */}
          <div className={`relative overflow-hidden ${
            isCompact ? 'w-24 h-24 flex-shrink-0 rounded-xl m-3' : 'h-48'
          }`}>
            <img
              src={article.cover_image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600'}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {!isCompact && article.source_name && (
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {article.source_name}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`flex flex-col flex-grow ${isCompact ? 'py-3 pr-3' : 'p-5'}`}>
            <h3 className={`font-semibold text-slate-900 group-hover:text-amber-600 transition-colors ${
              isCompact ? 'text-sm line-clamp-2' : 'text-lg line-clamp-2 mb-2'
            }`}>
              {article.title}
            </h3>

            {!isCompact && article.excerpt && (
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                {article.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className={`flex items-center gap-3 text-xs text-slate-400 ${isCompact ? 'mt-1' : 'mt-auto'}`}>
              {article.read_time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.read_time} min
                </span>
              )}
              {article.points_reward && (
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  +{article.points_reward}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}