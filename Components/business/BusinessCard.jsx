import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MapPin, Star, Clock, ShoppingBag, Calendar, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function BusinessCard({ business, index = 0 }) {
  return (
    <Link to={createPageUrl(`BusinessDetail?id=${business.id}`)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        whileHover={{ y: -4 }}
        className="group cursor-pointer h-full"
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
          {/* Cover Image */}
          <div className="relative h-40 overflow-hidden">
            <img
              src={business.cover_image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600'}
              alt={business.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            
            {/* Logo */}
            {business.logo && (
              <div className="absolute bottom-3 left-3">
                <div className="w-14 h-14 rounded-xl bg-white shadow-lg p-1">
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Verified Badge */}
            {business.is_verified && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-emerald-500 text-white">
                  <BadgeCheck className="w-3 h-3 mr-1" />
                  Verificado
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors mb-1">
              {business.name}
            </h3>

            {business.short_description && (
              <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                {business.short_description}
              </p>
            )}

            {/* Location */}
            <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-3">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{business.address || business.city}</span>
            </div>

            {/* Rating */}
            {business.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold text-sm">{business.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-400 text-xs">
                  ({business.reviews_count} reseñas)
                </span>
              </div>
            )}

            {/* Features */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {business.accepts_reservations && (
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                  <Calendar className="w-3 h-3 mr-1" />
                  Reservas
                </Badge>
              )}
              {business.accepts_orders && (
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  Pedidos
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}