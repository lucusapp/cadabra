// import React, { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { base44 } from '@/api/base44Client';
// import { Link } from 'react-router-dom';
// import { createPageUrl } from '@/utils';
// import { 
//   User, Star, Gift, Calendar, FileText, Settings, 
//   LogOut, ChevronRight, TrendingUp, ShoppingBag
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import PointsBadge from '@/components/points/PointsBadge';
// import LevelBadge from '@/components/points/LevelBadge';
// import LoadingSpinner from '@/components/ui/LoadingSpinner';
// import { motion } from 'framer-motion';

// const levelThresholds = {
//   bronze: 0,
//   silver: 500,
//   gold: 2000,
//   platinum: 5000,
// };

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     base44.auth.me()
//       .then(setUser)
//       .catch(() => base44.auth.redirectToLogin())
//       .finally(() => setLoading(false));
//   }, []);

//   const { data: userPoints } = useQuery({
//     queryKey: ['user-points', user?.id],
//     queryFn: async () => {
//       const results = await base44.entities.UserPoints.filter({ user_id: user.id });
//       return results[0] || { total_points: 0, available_points: 0, level: 'bronze' };
//     },
//     enabled: !!user?.id,
//   });

//   const { data: recentTransactions = [] } = useQuery({
//     queryKey: ['recent-transactions', user?.id],
//     queryFn: () => base44.entities.PointsTransaction.filter({ user_id: user.id }, '-created_date', 5),
//     enabled: !!user?.id,
//   });

//   const { data: reservations = [] } = useQuery({
//     queryKey: ['user-reservations', user?.id],
//     queryFn: () => base44.entities.Reservation.filter({ user_id: user.id }, '-created_date', 5),
//     enabled: !!user?.id,
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   const currentLevel = userPoints?.level || 'bronze';
//   const nextLevel = currentLevel === 'platinum' ? 'platinum' : 
//     Object.keys(levelThresholds)[Object.keys(levelThresholds).indexOf(currentLevel) + 1];
//   const currentThreshold = levelThresholds[currentLevel];
//   const nextThreshold = levelThresholds[nextLevel];
//   const progress = nextLevel === currentLevel ? 100 : 
//     Math.min(100, ((userPoints?.lifetime_points || 0) - currentThreshold) / (nextThreshold - currentThreshold) * 100);

//   const menuItems = [
//     { icon: Calendar, label: 'Mis reservas', href: 'MyReservations', count: reservations.length },
//     { icon: Gift, label: 'Recompensas', href: 'Rewards' },
//     { icon: FileText, label: 'Historial de puntos', href: 'PointsHistory' },
//     { icon: Settings, label: 'Configuración', href: 'Settings' },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="bg-gradient-to-br from-slate-900 to-slate-800 pt-10 pb-20 px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
//               <User className="w-10 h-10 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-white">{user?.full_name || 'Usuario'}</h1>
//               <p className="text-white/60">{user?.email}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Points Card */}
//       <div className="max-w-4xl mx-auto px-4 -mt-14">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl p-6 mb-6"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <p className="text-slate-500 text-sm mb-1">Puntos disponibles</p>
//               <PointsBadge points={userPoints?.available_points || 0} />
//             </div>
//             <LevelBadge level={currentLevel} />
//           </div>

//           {/* Progress to next level */}
//           {nextLevel !== currentLevel && (
//             <div>
//               <div className="flex items-center justify-between text-sm mb-2">
//                 <span className="text-slate-500">Progreso hacia {nextLevel}</span>
//                 <span className="font-medium">{userPoints?.lifetime_points || 0} / {nextThreshold}</span>
//               </div>
//               <Progress value={progress} className="h-2" />
//               <p className="text-xs text-slate-400 mt-2">
//                 Te faltan {nextThreshold - (userPoints?.lifetime_points || 0)} puntos para subir de nivel
//               </p>
//             </div>
//           )}

//           {/* Stats */}
//           <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
//             <div className="text-center">
//               <p className="text-2xl font-bold text-slate-900">{userPoints?.articles_read || 0}</p>
//               <p className="text-xs text-slate-500">Artículos</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-slate-900">{userPoints?.reservations_made || 0}</p>
//               <p className="text-xs text-slate-500">Reservas</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-slate-900">{userPoints?.orders_completed || 0}</p>
//               <p className="text-xs text-slate-500">Pedidos</p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Recent Activity */}
//         {recentTransactions.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-white rounded-2xl shadow-sm p-6 mb-6"
//           >
//             <h2 className="font-bold text-slate-900 mb-4">Actividad reciente</h2>
//             <div className="space-y-3">
//               {recentTransactions.slice(0, 3).map((tx) => (
//                 <div key={tx.id} className="flex items-center gap-3">
//                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
//                     tx.type === 'earn' ? 'bg-emerald-50' : 'bg-red-50'
//                   }`}>
//                     {tx.type === 'earn' ? (
//                       <TrendingUp className="w-5 h-5 text-emerald-600" />
//                     ) : (
//                       <ShoppingBag className="w-5 h-5 text-red-600" />
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-slate-900 line-clamp-1">{tx.description}</p>
//                     <p className="text-xs text-slate-400">{tx.action?.replace('_', ' ')}</p>
//                   </div>
//                   <span className={`font-semibold ${tx.type === 'earn' ? 'text-emerald-600' : 'text-red-600'}`}>
//                     {tx.type === 'earn' ? '+' : ''}{tx.points}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         )}

//         {/* Menu */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6"
//         >
//           {menuItems.map((item, index) => (
//             <Link key={item.href} to={createPageUrl(item.href)}>
//               <div className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${
//                 index !== menuItems.length - 1 ? 'border-b border-slate-100' : ''
//               }`}>
//                 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
//                   <item.icon className="w-5 h-5 text-slate-600" />
//                 </div>
//                 <span className="flex-1 font-medium text-slate-900">{item.label}</span>
//                 {item.count > 0 && (
//                   <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
//                     {item.count}
//                   </span>
//                 )}
//                 <ChevronRight className="w-5 h-5 text-slate-400" />
//               </div>
//             </Link>
//           ))}
//         </motion.div>

//         {/* Logout */}
//         <Button
//           variant="ghost"
//           onClick={() => base44.auth.logout()}
//           className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
//         >
//           <LogOut className="w-5 h-5 mr-2" />
//           Cerrar sesión
//         </Button>
//       </div>
//     </div>
//   );
// }
export default function Profile() {
  return <h2>Profile</h2>;
}
