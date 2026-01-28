import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, TrendingUp, TrendingDown, FileText, Calendar, Gift, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PointsBadge from '@/components/points/PointsBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const actionIcons = {
  article_read: FileText,
  reservation: Calendar,
  order: ShoppingBag,
  reward_redemption: Gift,
  promotion: Star,
  welcome_bonus: Gift,
  referral: TrendingUp,
};

const actionLabels = {
  article_read: 'Lectura de artículo',
  reservation: 'Reserva',
  order: 'Pedido',
  reward_redemption: 'Canje de recompensa',
  promotion: 'Promoción',
  welcome_bonus: 'Bono de bienvenida',
  referral: 'Referido',
};

export default function PointsHistory() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => base44.auth.redirectToLogin());
  }, []);

  const { data: userPoints } = useQuery({
    queryKey: ['user-points', user?.id],
    queryFn: async () => {
      const results = await base44.entities.UserPoints.filter({ user_id: user.id });
      return results[0] || { available_points: 0, lifetime_points: 0 };
    },
    enabled: !!user?.id,
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['points-transactions', user?.id],
    queryFn: () => base44.entities.PointsTransaction.filter({ user_id: user.id }, '-created_date', 100),
    enabled: !!user?.id,
  });

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, tx) => {
    const date = format(new Date(tx.created_date), 'yyyy-MM-dd');
    if (!groups[date]) groups[date] = [];
    groups[date].push(tx);
    return groups;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Cargando historial..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to={createPageUrl('Profile')}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Historial de puntos</h1>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-500 text-sm mb-1">Disponibles</p>
              <PointsBadge points={userPoints?.available_points || 0} size="small" />
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-500 text-sm mb-1">Total ganados</p>
              <p className="text-xl font-bold text-slate-900">{userPoints?.lifetime_points?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {transactions.length === 0 ? (
          <EmptyState
            icon={Star}
            title="Sin historial"
            description="Aquí aparecerán todos tus movimientos de puntos."
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, txs]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-slate-500 mb-3">
                  {format(new Date(date), "d 'de' MMMM, yyyy", { locale: es })}
                </h3>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {txs.map((tx, index) => {
                    const Icon = actionIcons[tx.action] || Star;
                    const isEarn = tx.type === 'earn';

                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-4 ${
                          index !== txs.length - 1 ? 'border-b border-slate-100' : ''
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isEarn ? 'bg-emerald-50' : 'bg-red-50'
                        }`}>
                          <Icon className={`w-6 h-6 ${isEarn ? 'text-emerald-600' : 'text-red-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {tx.description || actionLabels[tx.action] || tx.action}
                          </p>
                          <p className="text-sm text-slate-400">
                            {actionLabels[tx.action] || tx.action}
                            {tx.business_name && ` • ${tx.business_name}`}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1 font-bold text-lg ${
                          isEarn ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {isEarn ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {isEarn ? '+' : ''}{tx.points}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}