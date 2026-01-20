import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { 
  Home, Store, User, Menu, X, Star, 
  Search, Bell, ChevronRight, LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(async (u) => {
        setUser(u);
        const points = await base44.entities.UserPoints.filter({ user_id: u.id });
        setUserPoints(points[0]);
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { icon: Home, label: 'Inicio', href: 'Home' },
    { icon: Store, label: 'Comercios', href: 'Businesses' },
    { icon: User, label: 'Perfil', href: 'Profile' },
  ];

  const isActive = (href) => currentPageName === href;

  // Pages without bottom nav
  const hideNav = ['Article', 'ProductDetail'].includes(currentPageName);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:block">LugoLocal</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} to={createPageUrl(item.href)}>
                <Button
                  variant={isActive(item.href) ? 'secondary' : 'ghost'}
                  className={`rounded-full px-4 ${
                    isActive(item.href) ? 'bg-amber-50 text-amber-700' : ''
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {user && userPoints && (
              <Link to={createPageUrl('Profile')}>
                <div className="hidden sm:flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="font-semibold text-amber-700">
                    {userPoints.available_points?.toLocaleString() || 0}
                  </span>
                </div>
              </Link>
            )}

            {user ? (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menú</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl mb-6">
                      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.full_name || 'Usuario'}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    {/* Points */}
                    {userPoints && (
                      <Link to={createPageUrl('Profile')} onClick={() => setIsMenuOpen(false)}>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl text-white mb-6">
                          <div>
                            <p className="text-amber-100 text-sm">Tus puntos</p>
                            <p className="text-2xl font-bold">{userPoints.available_points?.toLocaleString() || 0}</p>
                          </div>
                          <Star className="w-8 h-8 fill-current opacity-50" />
                        </div>
                      </Link>
                    )}

                    {/* Menu Items */}
                    <nav className="space-y-1">
                      {[
                        { label: 'Mis reservas', href: 'MyReservations' },
                        { label: 'Recompensas', href: 'Rewards' },
                        { label: 'Historial de puntos', href: 'PointsHistory' },
                      ].map((item) => (
                        <Link 
                          key={item.href} 
                          to={createPageUrl(item.href)}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <span className="font-medium text-slate-700">{item.label}</span>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          </div>
                        </Link>
                      ))}
                    </nav>

                    {/* Logout */}
                    <Button
                      variant="ghost"
                      onClick={() => base44.auth.logout()}
                      className="w-full mt-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Cerrar sesión
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                onClick={() => base44.auth.redirectToLogin()}
                className="bg-amber-500 hover:bg-amber-600 rounded-full"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={hideNav ? '' : 'pb-20 md:pb-0'}>
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      {!hideNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => (
              <Link key={item.href} to={createPageUrl(item.href)} className="flex-1">
                <div className={`flex flex-col items-center py-2 ${
                  isActive(item.href) ? 'text-amber-600' : 'text-slate-400'
                }`}>
                  <item.icon className={`w-6 h-6 ${isActive(item.href) ? 'stroke-2' : ''}`} />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}