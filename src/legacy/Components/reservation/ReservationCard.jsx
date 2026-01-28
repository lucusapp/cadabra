import React from 'react';
import { Calendar, Clock, MapPin, QrCode, CheckCircle2, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmada', color: 'bg-blue-100 text-blue-700' },
  ready: { label: 'Lista', color: 'bg-emerald-100 text-emerald-700' },
  completed: { label: 'Completada', color: 'bg-slate-100 text-slate-600' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-700' },
};

export default function ReservationCard({ reservation, onViewQR }) {
  const status = statusConfig[reservation.status] || statusConfig.pending;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900">{reservation.product_name}</h3>
            <p className="text-slate-500 text-sm">{reservation.business_name}</p>
          </div>
          <Badge className={status.color}>{status.label}</Badge>
        </div>

        <div className="flex items-center gap-1 text-slate-400 text-sm">
          <Package className="w-4 h-4" />
          <span>Código: <span className="font-mono font-medium text-slate-600">{reservation.code}</span></span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Fecha de recogida</p>
            <p className="font-semibold text-slate-900">
              {reservation.pickup_date ? format(new Date(reservation.pickup_date), "d 'de' MMMM, yyyy", { locale: es }) : '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Franja horaria</p>
            <p className="font-semibold text-slate-900">{reservation.pickup_time_slot || '-'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Total pagado</p>
            <p className="font-bold text-slate-900">{reservation.total_amount?.toFixed(2)} €</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {reservation.status !== 'completed' && reservation.status !== 'cancelled' && (
        <div className="p-5 border-t border-slate-100">
          <Button 
            onClick={() => onViewQR?.(reservation)}
            className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Ver código QR
          </Button>
        </div>
      )}
    </div>
  );
}