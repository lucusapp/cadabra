import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Calendar, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReservationCard from '@/components/reservation/ReservationCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';

export default function MyReservations() {
  const [user, setUser] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => base44.auth.redirectToLogin());
  }, []);

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['user-reservations', user?.id],
    queryFn: () => base44.entities.Reservation.filter({ user_id: user.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  const activeReservations = reservations.filter(r => 
    ['pending', 'confirmed', 'ready'].includes(r.status)
  );
  const pastReservations = reservations.filter(r => 
    ['completed', 'cancelled'].includes(r.status)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Cargando reservas..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Profile')}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Mis Reservas</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full bg-white rounded-xl p-1 h-auto mb-6">
            <TabsTrigger value="active" className="flex-1 rounded-lg py-3">
              Activas ({activeReservations.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1 rounded-lg py-3">
              Historial ({pastReservations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeReservations.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No tienes reservas activas"
                description="Explora los comercios y reserva tus productos favoritos."
                action={
                  <Link to={createPageUrl('Businesses')}>
                    <Button>Explorar comercios</Button>
                  </Link>
                }
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-4"
              >
                {activeReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onViewQR={setSelectedReservation}
                  />
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastReservations.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Sin historial"
                description="Aquí aparecerán tus reservas completadas."
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-4"
              >
                {pastReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                  />
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Modal */}
      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Código de reserva</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <QrCode className="w-24 h-24 text-slate-400" />
            </div>
            <div className="bg-slate-100 rounded-xl p-4 mb-4">
              <span className="text-2xl font-mono font-bold text-slate-900">
                {selectedReservation?.code}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Presenta este código en el comercio para recoger tu reserva.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}