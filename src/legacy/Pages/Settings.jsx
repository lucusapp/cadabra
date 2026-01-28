import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, User, Bell, Shield, HelpCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    promotions: false,
  });

  useEffect(() => {
    base44.auth.me()
      .then((u) => {
        setUser(u);
        setFormData({ full_name: u.full_name || '' });
      })
      .catch(() => base44.auth.redirectToLogin())
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe(formData);
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
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
            <h1 className="text-xl font-bold text-slate-900">Configuración</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="font-bold text-slate-900">Información personal</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-slate-500">Email</Label>
              <Input
                value={user?.email || ''}
                disabled
                className="mt-1 bg-slate-50"
              />
            </div>
            <div>
              <Label className="text-sm text-slate-500">Nombre completo</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData(f => ({ ...f, full_name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="font-bold text-slate-900">Notificaciones</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Notificaciones por email</p>
                <p className="text-sm text-slate-500">Recibe actualizaciones importantes</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(n => ({ ...n, email: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Notificaciones push</p>
                <p className="text-sm text-slate-500">Alertas en tiempo real</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(n => ({ ...n, push: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Promociones</p>
                <p className="text-sm text-slate-500">Ofertas y novedades de comercios</p>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) => setNotifications(n => ({ ...n, promotions: checked }))}
              />
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </div>
            <span className="font-medium text-slate-900">Ayuda y soporte</span>
          </button>
          <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-600" />
            </div>
            <span className="font-medium text-slate-900">Privacidad</span>
          </button>
          <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5 text-slate-600" />
            </div>
            <span className="font-medium text-slate-900">Acerca de LugoLocal</span>
          </button>
        </motion.div>

        {/* Version */}
        <p className="text-center text-sm text-slate-400">
          Versión 1.0.0
        </p>
      </div>
    </div>
  );
}