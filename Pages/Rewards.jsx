import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Star, Gift, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PointsBadge from '@/components/points/PointsBadge';
import LevelBadge from '@/components/points/LevelBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Rewards() {
  const [user, setUser] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => base44.auth.redirectToLogin());
  }, []);

  const { data: userPoints } = useQuery({
    queryKey: ['user-points', user?.id],
    queryFn: async () => {
      const results = await base44.entities.UserPoints.filter({ user_id: user.id });
      return results[0] || { available_points: 0, level: 'bronze' };
    },
    enabled: !!user?.id,
  });

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: () => base44.entities.Reward.filter({ is_active: true }, 'points_cost', 50),
  });

  const redeemReward = useMutation({
    mutationFn: async (reward) => {
      // Deduct points
      await base44.entities.UserPoints.update(userPoints.id, {
        available_points: userPoints.available_points - reward.points_cost,
        total_points: userPoints.total_points - reward.points_cost,
      });

      // Create transaction
      await base44.entities.PointsTransaction.create({
        user_id: user.id,
        type: 'redeem',
        action: 'reward_redemption',
        points: -reward.points_cost,
        description: `Canje: ${reward.name}`,
        reference_type: 'reward',
        reference_id: reward.id,
        business_id: reward.business_id,
        business_name: reward.business_name,
      });

      // Update reward redemptions count
      await base44.entities.Reward.update(reward.id, {
        current_redemptions: (reward.current_redemptions || 0) + 1,
      });

      return reward;
    },
    onSuccess: () => {
      setRedemptionSuccess(true);
      queryClient.invalidateQueries(['user-points']);
      toast.success('¡Recompensa canjeada!');
    },
    onError: () => {
      toast.error('Error al canjear la recompensa');
    },
  });

  const canRedeem = (reward) => {
    if (!userPoints) return false;
    if (userPoints.available_points < reward.points_cost) return false;
    
    const levelOrder = ['bronze', 'silver', 'gold', 'platinum'];
    const userLevelIndex = levelOrder.indexOf(userPoints.level || 'bronze');
    const requiredLevelIndex = levelOrder.indexOf(reward.min_level || 'bronze');
    
    return userLevelIndex >= requiredLevelIndex;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Cargando recompensas..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to={createPageUrl('Profile')}>
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">Recompensas</h1>
          </div>

          {/* Points Balance */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Puntos disponibles</p>
                <p className="text-4xl font-bold text-white">
                  {userPoints?.available_points?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-right">
                <LevelBadge level={userPoints?.level || 'bronze'} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {rewards.length === 0 ? (
          <EmptyState
            icon={Gift}
            title="No hay recompensas disponibles"
            description="Vuelve pronto para descubrir nuevas recompensas."
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {rewards.map((reward, index) => {
              const isRedeemable = canRedeem(reward);
              const needsHigherLevel = userPoints && 
                ['silver', 'gold', 'platinum'].indexOf(reward.min_level) > 
                ['bronze', 'silver', 'gold', 'platinum'].indexOf(userPoints.level || 'bronze');

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm ${
                    !isRedeemable ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative h-40">
                    <img
                      src={reward.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400'}
                      alt={reward.name}
                      className="w-full h-full object-cover"
                    />
                    {needsHigherLevel && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Nivel {reward.min_level} requerido</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-amber-500 text-white">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {reward.points_cost}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-1">{reward.name}</h3>
                    {reward.business_name && (
                      <p className="text-slate-500 text-sm mb-2">{reward.business_name}</p>
                    )}
                    {reward.description && (
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4">{reward.description}</p>
                    )}
                    <Button
                      onClick={() => {
                        setSelectedReward(reward);
                        setShowConfirmDialog(true);
                        setRedemptionSuccess(false);
                      }}
                      disabled={!isRedeemable}
                      className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      {isRedeemable ? 'Canjear' : 'Puntos insuficientes'}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-sm">
          {redemptionSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Canjeado!</h3>
              <p className="text-slate-500 mb-6">
                Tu recompensa "{selectedReward?.name}" ha sido canjeada correctamente.
              </p>
              <Button onClick={() => setShowConfirmDialog(false)} className="w-full">
                Cerrar
              </Button>
            </motion.div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Confirmar canje</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que quieres canjear esta recompensa?
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-slate-900">{selectedReward?.name}</h4>
                  <p className="text-sm text-slate-500">{selectedReward?.description}</p>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500">Coste</span>
                  <span className="font-semibold text-amber-600">
                    {selectedReward?.points_cost} puntos
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Después del canje</span>
                  <span className="font-semibold">
                    {(userPoints?.available_points || 0) - (selectedReward?.points_cost || 0)} puntos
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => redeemReward.mutate(selectedReward)}
                  disabled={redeemReward.isPending}
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                >
                  {redeemReward.isPending ? 'Canjeando...' : 'Confirmar'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}