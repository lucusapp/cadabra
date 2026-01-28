import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Car, Cpu, Home, Flower2, Utensils, ShoppingBag, 
  Heart, Briefcase, Plane, Book, Gamepad2, Music,
  Camera, Dumbbell, Palette
} from 'lucide-react';

const iconMap = {
  motor: Car,
  tecnologia: Cpu,
  hogar: Home,
  jardineria: Flower2,
  gastronomia: Utensils,
  compras: ShoppingBag,
  salud: Heart,
  negocios: Briefcase,
  viajes: Plane,
  cultura: Book,
  ocio: Gamepad2,
  musica: Music,
  fotografia: Camera,
  deporte: Dumbbell,
  arte: Palette,
};

export default function CategoryPills({ categories, activeId }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
      {categories.map((category, index) => {
        const Icon = iconMap[category.slug] || Book;
        const isActive = activeId === category.id;
        
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={createPageUrl(`Category?id=${category.id}`)}>
              <button
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap font-medium text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}