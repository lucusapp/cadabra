import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  FileText, Users, Store, Gift, BookOpen, BarChart3,
  Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        if (u.role !== 'admin') {
          window.location.href = createPageUrl('Home');
          return;
        }
        setUser(u);
      })
      .catch(() => base44.auth.redirectToLogin())
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const hasPermission = (perm) => {
    return user?.admin_permissions?.includes(perm) || !user?.admin_permissions;
  };

  const menuItems = [
    { 
      icon: FileText, 
      label: 'Artículos', 
      description: 'Gestión de contenido',
      href: 'AdminArticles',
      color: 'from-blue-500 to-blue-600',
      permission: 'articles'
    },
    { 
      icon: Users, 
      label: 'Usuarios', 
      description: 'Gestión de usuarios',
      href: 'AdminUsers',
      color: 'from-purple-500 to-purple-600',
      permission: 'users'
    },
    { 
      icon: Store, 
      label: 'Comercios', 
      description: 'Gestión de comercios',
      href: 'AdminBusinesses',
      color: 'from-green-500 to-green-600',
      permission: 'businesses'
    },
    { 
      icon: Gift, 
      label: 'Recompensas', 
      description: 'Gestión de recompensas',
      href: 'AdminRewards',
      color: 'from-amber-500 to-amber-600',
      permission: 'rewards'
    },
    { 
      icon: BookOpen, 
      label: 'Libros', 
      description: 'Gestión de libros',
      href: 'AdminBooks',
      color: 'from-indigo-500 to-indigo-600',
      permission: 'books'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      description: 'Métricas y reportes',
      href: 'AdminAnalytics',
      color: 'from-pink-500 to-pink-600',
      permission: 'analytics'
    }
  ].filter(item => hasPermission(item.permission));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Panel de Administración</h1>
          <p className="text-slate-500 text-lg">Gestiona el contenido de LugoLocal</p>
        </div>

        {/* Grid de opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(item.href)}>
                <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`h-2 bg-gradient-to-r ${item.color}`} />
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                          <item.icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                            {item.label}
                          </h3>
                          <p className="text-sm text-slate-500">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}