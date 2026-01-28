import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PointsBadge({ points, showAnimation = false, size = 'default' }) {
  const isSmall = size === 'small';
  
  return (
    <motion.div
      initial={showAnimation ? { scale: 0.8, opacity: 0 } : false}
      animate={showAnimation ? { scale: 1, opacity: 1 } : false}
      className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full font-semibold shadow-lg shadow-amber-500/25 ${
        isSmall ? 'px-2.5 py-1 text-xs' : 'px-4 py-2 text-sm'
      }`}
    >
      <Star className={`fill-current ${isSmall ? 'w-3 h-3' : 'w-4 h-4'}`} />
      <span>{points?.toLocaleString() || 0}</span>
      {showAnimation && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-0.5 ml-1 text-amber-100"
        >
          <TrendingUp className="w-3 h-3" />
        </motion.span>
      )}
    </motion.div>
  );
}