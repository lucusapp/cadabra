// import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { base44 } from '@/api/base44Client';
// import { Link } from 'react-router-dom';
// import { createPageUrl } from '@/utils';
// import { 
//   ArrowLeft, Search, Edit, Eye, Star,
//   TrendingUp, ShoppingBag, User
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import LoadingSpinner from '@/components/ui/LoadingSpinner';
// import LevelBadge from '@/components/points/LevelBadge';
// import { toast } from 'sonner';

// export default function AdminUsers() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     base44.auth.me()
//       .then(u => {
//         if (u.role !== 'admin' || (u.admin_permissions && !u.admin_permissions.includes('users'))) {
//           window.location.href = createPageUrl('AdminDashboard');
//           return;
//         }
//         setUser(u);
//       })
//       .catch(() => base44.auth.redirectToLogin())
//       .finally(() => setLoading(false));
//   }, []);

//   const { data: users = [], isLoading } = useQuery({
//     queryKey: ['admin-users'],
//     queryFn: () => base44.entities.User.list(),
//     enabled: !!user
//   });

//   const { data: allUserPoints = [] } = useQuery({
//     queryKey: ['all-user-points'],
//     queryFn: () => base44.entities.UserPoints.list(),
//     enabled: !!user
//   });

//   const filteredUsers = users.filter(u => 
//     u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const getUserPoints = (userId) => {
//     return allUserPoints.find(up => up.user_id === userId) || {
//       total_points: 0,
//       available_points: 0,
//       level: 'bronze'
//     };
//   };

//   if (loading || isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <Link to={createPageUrl('AdminDashboard')}>
//               <Button variant="ghost" size="icon">
//                 <ArrowLeft className="w-5 h-5" />
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
//               <p className="text-slate-500">{users.length} usuarios registrados</p>
//             </div>
//           </div>
//         </div>

//         <Card className="mb-6">
//           <CardContent className="pt-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//               <Input
//                 placeholder="Buscar por email o nombre..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Todos los Usuarios</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {filteredUsers.map((usr) => {
//                 const points = getUserPoints(usr.id);
//                 return (
//                   <div 
//                     key={usr.id} 
//                     className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
//                     onClick={() => setSelectedUser(usr)}
//                   >
//                     <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
//                       <User className="w-6 h-6 text-slate-500" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <h3 className="font-semibold text-slate-900">{usr.full_name || 'Sin nombre'}</h3>
//                         {usr.role === 'admin' && (
//                           <Badge variant="secondary" className="text-xs">Admin</Badge>
//                         )}
//                       </div>
//                       <p className="text-sm text-slate-500">{usr.email}</p>
//                     </div>
//                     <div className="flex items-center gap-6">
//                       <div className="text-right">
//                         <p className="text-2xl font-bold text-amber-600">{points.available_points}</p>
//                         <p className="text-xs text-slate-500">puntos</p>
//                       </div>
//                       <LevelBadge level={points.level} />
//                       <Button variant="ghost" size="icon">
//                         <Eye className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </CardContent>
//         </Card>

//         <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Detalles del Usuario</DialogTitle>
//             </DialogHeader>
//             {selectedUser && (
//               <UserDetailView 
//                 user={selectedUser} 
//                 userPoints={getUserPoints(selectedUser.id)}
//                 onClose={() => setSelectedUser(null)}
//               />
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }

// function UserDetailView({ user, userPoints, onClose }) {
//   const [editPoints, setEditPoints] = useState(userPoints.available_points);
//   const [editMode, setEditMode] = useState(false);
//   const queryClient = useQueryClient();

//   const { data: transactions = [] } = useQuery({
//     queryKey: ['user-transactions', user.id],
//     queryFn: () => base44.entities.PointsTransaction.filter({ user_id: user.id }, '-created_date', 20)
//   });

//   const { data: reservations = [] } = useQuery({
//     queryKey: ['user-reservations', user.id],
//     queryFn: () => base44.entities.Reservation.filter({ user_id: user.id }, '-created_date', 10)
//   });

//   const updatePointsMutation = useMutation({
//     mutationFn: async (newPoints) => {
//       const pointsDiff = newPoints - userPoints.available_points;
      
//       await base44.entities.UserPoints.update(userPoints.id || user.id, {
//         available_points: newPoints,
//         total_points: (userPoints.total_points || 0) + pointsDiff
//       });

//       if (pointsDiff !== 0) {
//         await base44.entities.PointsTransaction.create({
//           user_id: user.id,
//           type: pointsDiff > 0 ? 'earn' : 'redeem',
//           action: 'promotion',
//           points: pointsDiff,
//           description: 'Ajuste manual por administrador'
//         });
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['all-user-points']);
//       queryClient.invalidateQueries(['user-transactions', user.id]);
//       toast.success('Puntos actualizados');
//       setEditMode(false);
//     }
//   });

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
//         <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
//           <User className="w-8 h-8 text-slate-500" />
//         </div>
//         <div className="flex-1">
//           <h3 className="text-xl font-bold text-slate-900">{user.full_name || 'Sin nombre'}</h3>
//           <p className="text-slate-500">{user.email}</p>
//           <div className="flex gap-2 mt-2">
//             <LevelBadge level={userPoints.level} />
//             {user.role === 'admin' && (
//               <Badge variant="secondary">Administrador</Badge>
//             )}
//           </div>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Gestión de Puntos</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label>Puntos Disponibles</Label>
//               {editMode ? (
//                 <Input
//                   type="number"
//                   value={editPoints}
//                   onChange={(e) => setEditPoints(parseInt(e.target.value) || 0)}
//                   className="mt-2"
//                 />
//               ) : (
//                 <p className="text-3xl font-bold text-amber-600 mt-2">{userPoints.available_points}</p>
//               )}
//             </div>
//             <div>
//               <Label>Puntos Totales</Label>
//               <p className="text-3xl font-bold text-slate-900 mt-2">{userPoints.lifetime_points || 0}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-4 pt-4 border-t">
//             <div className="text-center">
//               <p className="text-2xl font-bold text-slate-900">{userPoints.articles_read || 0}</p>
//               <p className="text-xs text-slate-500">Artículos</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-slate-900">{userPoints.reservations_made || 0}</p>
//               <p className="text-xs text-slate-500">Reservas</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-slate-900">{userPoints.orders_completed || 0}</p>
//               <p className="text-xs text-slate-500">Pedidos</p>
//             </div>
//           </div>

//           {editMode ? (
//             <div className="flex gap-2">
//               <Button 
//                 onClick={() => updatePointsMutation.mutate(editPoints)}
//                 disabled={updatePointsMutation.isPending}
//                 className="flex-1"
//               >
//                 Guardar
//               </Button>
//               <Button 
//                 variant="outline" 
//                 onClick={() => {
//                   setEditMode(false);
//                   setEditPoints(userPoints.available_points);
//                 }}
//               >
//                 Cancelar
//               </Button>
//             </div>
//           ) : (
//             <Button onClick={() => setEditMode(true)} variant="outline" className="w-full">
//               <Edit className="w-4 h-4 mr-2" />
//               Editar Puntos
//             </Button>
//           )}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Actividad Reciente</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {transactions.slice(0, 10).map((tx) => (
//               <div key={tx.id} className="flex items-center gap-3 pb-3 border-b last:border-0">
//                 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                   tx.type === 'earn' ? 'bg-emerald-50' : 'bg-red-50'
//                 }`}>
//                   {tx.type === 'earn' ? (
//                     <TrendingUp className="w-5 h-5 text-emerald-600" />
//                   ) : (
//                     <ShoppingBag className="w-5 h-5 text-red-600" />
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-slate-900">{tx.description}</p>
//                   <p className="text-xs text-slate-400">{tx.action?.replace('_', ' ')}</p>
//                 </div>
//                 <span className={`font-semibold ${tx.type === 'earn' ? 'text-emerald-600' : 'text-red-600'}`}>
//                   {tx.type === 'earn' ? '+' : ''}{tx.points}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {reservations.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Reservas Recientes</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {reservations.map((res) => (
//                 <div key={res.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
//                   <div>
//                     <p className="font-medium text-slate-900">{res.product_name}</p>
//                     <p className="text-sm text-slate-500">{res.business_name}</p>
//                   </div>
//                   <Badge variant={
//                     res.status === 'completed' ? 'default' :
//                     res.status === 'confirmed' ? 'secondary' : 'outline'
//                   }>
//                     {res.status}
//                   </Badge>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
import { useParams } from 'react-router-dom'

const mockArticle = {
  title: 'La IA que cambiará tu trabajo',
  category: 'Tecnología',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
  content: `
La inteligencia artificial ya no es una promesa futura, es una realidad
que está transformando industrias enteras.

Desde el desarrollo de software hasta la medicina, los cambios son
profundos y acelerados. La pregunta ya no es si va a pasar, sino
cómo nos adaptamos.
  `,
}

export default function Article() {
  const { id } = useParams()

  return (
    <article className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[60vh]">
        <img
          src={mockArticle.image}
          alt={mockArticle.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-3xl px-4 pb-12 text-white">
            <span className="text-sm uppercase tracking-wider opacity-80">
              {mockArticle.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mt-2">
              {mockArticle.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {mockArticle.content.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  )
}
