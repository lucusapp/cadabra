import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Star, 
  Minus, Plus, ShoppingBag, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', notes: '' });
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setFormData(f => ({ ...f, name: u.full_name || '' }));
    }).catch(() => {});
  }, []);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const results = await base44.entities.Product.filter({ id: productId });
      return results[0];
    },
    enabled: !!productId,
  });

  const { data: business } = useQuery({
    queryKey: ['business', product?.business_id],
    queryFn: async () => {
      const results = await base44.entities.Business.filter({ id: product.business_id });
      return results[0];
    },
    enabled: !!product?.business_id,
  });

  const createReservation = useMutation({
    mutationFn: async () => {
      if (!user) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      const code = `RES-${Date.now().toString(36).toUpperCase()}`;
      const totalAmount = product.price * quantity;

      const reservation = await base44.entities.Reservation.create({
        code,
        user_id: user.id,
        user_email: user.email,
        user_name: formData.name,
        user_phone: formData.phone,
        business_id: product.business_id,
        business_name: business?.name,
        product_id: product.id,
        product_name: product.name,
        quantity,
        pickup_date: format(selectedDate, 'yyyy-MM-dd'),
        pickup_time_slot: selectedSlot,
        total_amount: totalAmount,
        status: 'confirmed',
        payment_status: 'pending',
        points_earned: product.points_reward * quantity,
        notes: formData.notes,
      });

      // Update user points
      let userPoints = await base44.entities.UserPoints.filter({ user_id: user.id });
      const pointsToAdd = product.points_reward * quantity;

      if (userPoints.length === 0) {
        await base44.entities.UserPoints.create({
          user_id: user.id,
          user_email: user.email,
          total_points: pointsToAdd,
          available_points: pointsToAdd,
          lifetime_points: pointsToAdd,
          reservations_made: 1,
        });
      } else {
        await base44.entities.UserPoints.update(userPoints[0].id, {
          total_points: (userPoints[0].total_points || 0) + pointsToAdd,
          available_points: (userPoints[0].available_points || 0) + pointsToAdd,
          lifetime_points: (userPoints[0].lifetime_points || 0) + pointsToAdd,
          reservations_made: (userPoints[0].reservations_made || 0) + 1,
        });
      }

      // Create points transaction
      await base44.entities.PointsTransaction.create({
        user_id: user.id,
        type: 'earn',
        action: 'reservation',
        points: pointsToAdd,
        description: `Reserva: ${product.name}`,
        reference_type: 'reservation',
        reference_id: reservation.id,
        business_id: product.business_id,
        business_name: business?.name,
      });

      return { reservation, code };
    },
    onSuccess: (data) => {
      setReservationCode(data.code);
      setReservationSuccess(true);
      queryClient.invalidateQueries(['user-points']);
      toast.success('¡Reserva confirmada!');
    },
    onError: () => {
      toast.error('Error al crear la reserva');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Cargando producto..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Producto no encontrado</p>
      </div>
    );
  }

  const availableSlots = product.reservation_config?.pickup_slots?.find(
    s => s.date === format(selectedDate || new Date(), 'yyyy-MM-dd')
  )?.time_slots || ['09:00-11:00', '11:00-13:00', '16:00-18:00', '18:00-20:00'];

  const canReserve = selectedDate && selectedSlot && formData.name && formData.phone;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Image Gallery */}
      <div className="relative h-80 md:h-96">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=1600'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Link to={createPageUrl(`BusinessDetail?id=${product.business_id}`)}>
            <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {product.is_reservable && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-amber-500 text-white text-sm px-4 py-1.5">
              <Calendar className="w-4 h-4 mr-1.5" />
              Producto reservable
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 -mt-10 relative">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Business */}
          {business && (
            <Link to={createPageUrl(`BusinessDetail?id=${business.id}`)}>
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-4 hover:text-amber-600 transition-colors">
                <MapPin className="w-4 h-4" />
                {business.name}
              </div>
            </Link>
          )}

          {/* Title & Price */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-slate-900">{product.price.toFixed(2)} €</span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-xl text-slate-400 line-through">{product.original_price.toFixed(2)} €</span>
                <Badge className="bg-red-500 text-white">
                  -{Math.round((1 - product.price / product.original_price) * 100)}%
                </Badge>
              </>
            )}
          </div>

          {/* Points */}
          <div className="flex items-center gap-2 mb-6 text-amber-600">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-medium">+{product.points_reward || 10} puntos por compra</span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-slate-700">Cantidad:</span>
            <div className="flex items-center gap-3 bg-slate-100 rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setQuantity(q => q + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-lg font-bold text-slate-900 ml-auto">
              {(product.price * quantity).toFixed(2)} €
            </span>
          </div>

          {/* Actions */}
          {product.is_reservable ? (
            <Button 
              onClick={() => setShowReservationModal(true)}
              className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-lg font-semibold"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Reservar ahora
            </Button>
          ) : (
            <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-lg font-semibold">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Añadir al pedido
            </Button>
          )}
        </div>
      </div>

      {/* Reservation Modal */}
      <Dialog open={showReservationModal} onOpenChange={setShowReservationModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reservar {product.name}</DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {reservationSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Reserva confirmada!</h3>
                <p className="text-slate-500 mb-4">Tu código de reserva es:</p>
                <div className="bg-slate-100 rounded-xl p-4 mb-6">
                  <span className="text-2xl font-mono font-bold text-slate-900">{reservationCode}</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  Presenta este código en {business?.name} el {format(selectedDate, "d 'de' MMMM", { locale: es })} 
                  entre las {selectedSlot.replace('-', ' y las ')}.
                </p>
                <Button onClick={() => setShowReservationModal(false)} className="w-full">
                  Cerrar
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Calendar */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Fecha de recogida</Label>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={es}
                    disabled={(date) => date < new Date()}
                    className="rounded-xl border"
                  />
                </div>

                {/* Time Slot */}
                {selectedDate && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Franja horaria</Label>
                    <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Selecciona horario" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map(slot => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Nombre completo</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                      placeholder="Tu nombre"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Teléfono</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                      placeholder="600 000 000"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Notas (opcional)</Label>
                    <Input
                      value={formData.notes}
                      onChange={(e) => setFormData(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Alergias, preferencias..."
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{product.name} x{quantity}</span>
                    <span className="font-medium">{(product.price * quantity).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm text-amber-600">
                    <span>Puntos a ganar</span>
                    <span className="font-medium">+{(product.points_reward || 10) * quantity}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">{(product.price * quantity).toFixed(2)} €</span>
                  </div>
                </div>

                <Button
                  onClick={() => createReservation.mutate()}
                  disabled={!canReserve || createReservation.isPending}
                  className="w-full h-14 bg-amber-500 hover:bg-amber-600 rounded-xl text-lg font-semibold"
                >
                  {createReservation.isPending ? 'Procesando...' : 'Confirmar reserva'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}