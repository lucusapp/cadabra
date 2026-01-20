import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  FileText, Users, Store, Gift, TrendingUp, 
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
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

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [articles, users, businesses, transactions] = await Promise.all([
        base44.entities.Article.list(),
        base44.entities.User.list(),
        base44.entities.Business.list(),
        base44.entities.PointsTransaction.list('-created_date', 10)
      ]);
      
      return {
        totalArticles: articles.length,
        publishedArticles: articles.filter(a => a.is_published).length,
        totalUsers: users.length,
        totalBusinesses: businesses.length,
        recentTransactions: transactions
      };
    },
    enabled: !!user
  });

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
      label: 'Gestión de Artículos', 
      href: 'AdminArticles',
      color: 'bg-blue-500',
      permission: 'articles',
      stats: `${stats?.publishedArticles || 0} publicados`
    },
    { 
      icon: Users, 
      label: 'Gestión de Usuarios', 
      href: 'AdminUsers',
      color: 'bg-purple-500',
      permission: 'users',
      stats: `${stats?.totalUsers || 0} usuarios`
    },
    { 
      icon: Store, 
      label: 'Gestión de Comercios', 
      href: 'AdminBusinesses',
      color: 'bg-green-500',
      permission: 'businesses',
      stats: `${stats?.totalBusinesses || 0} comercios`
    },
    { 
      icon: Gift, 
      label: 'Gestión de Recompensas', 
      href: 'AdminRewards',
      color: 'bg-amber-500',
      permission: 'rewards',
      stats: 'Próximamente'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      href: 'AdminAnalytics',
      color: 'bg-indigo-500',
      permission: 'analytics',
      stats: 'Métricas'
    }
  ].filter(item => hasPermission(item.permission));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Administración</h1>
          <p className="text-slate-500">Bienvenido, {user?.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Artículos
              </CardTitle>
              <FileText className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalArticles || 0}</div>
              <p className="text-xs text-slate-500">{stats?.publishedArticles || 0} publicados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Usuarios
              </CardTitle>
              <Users className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-slate-500">Total registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Comercios
              </CardTitle>
              <Store className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBusinesses || 0}</div>
              <p className="text-xs text-slate-500">Activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Actividad
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.recentTransactions?.length || 0}</div>
              <p className="text-xs text-slate-500">Transacciones recientes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(item.href)}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{item.label}</h3>
                        <p className="text-sm text-slate-500">{item.stats}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {stats?.recentTransactions && stats.recentTransactions.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentTransactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{tx.description}</p>
                      <p className="text-xs text-slate-500">{tx.action?.replace('_', ' ')}</p>
                    </div>
                    <span className={`font-semibold ${tx.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'earn' ? '+' : ''}{tx.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}