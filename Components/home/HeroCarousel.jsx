import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronLeft, ChevronRight, Clock, Star, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function HeroCarousel({ articles, categories }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || !articles.length) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, articles.length]);

  if (!articles.length) return null;

  const currentArticle = articles[currentIndex];
  const category = categories?.find(c => c.id === currentArticle?.category_id);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => goToSlide((currentIndex - 1 + articles.length) % articles.length);
  const goToNext = () => goToSlide((currentIndex + 1) % articles.length);

  return (
    <div className="relative h-[70vh] min-h-[500px] max-h-[700px] w-full overflow-hidden rounded-3xl mb-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background */}
          <img
            src={currentArticle?.cover_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600'}
            alt={currentArticle?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-end p-8 md:p-12">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Category */}
              {category && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium mb-4">
                  {category.name}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                {currentArticle?.title}
              </h1>

              {/* Excerpt */}
              {currentArticle?.excerpt && (
                <p className="text-lg text-white/80 mb-6 line-clamp-2">
                  {currentArticle.excerpt}
                </p>
              )}

              {/* Meta & CTA */}
              <div className="flex flex-wrap items-center gap-4">
                <Link to={createPageUrl(`Article?id=${currentArticle?.id}`)}>
                  <Button className="bg-white text-slate-900 hover:bg-white/90 rounded-full px-6 h-11 font-medium">
                    Leer artículo
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                
                <div className="flex items-center gap-4 text-white/60 text-sm">
                  {currentArticle?.read_time && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {currentArticle.read_time} min
                    </span>
                  )}
                  {currentArticle?.points_reward && (
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      +{currentArticle.points_reward} pts
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrev}
          className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-white' 
                : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}