import { User } from "lucide-react";

export default function Profile() {
  // Datos mock
  const mockUser = {
    full_name: "Usuario Ejemplo",
    email: "ejemplo@correo.com",
    points: 1200,
    level: "silver",
    articles_read: 12,
    reservations_made: 3,
    orders_completed: 5,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 pt-10 pb-20 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{mockUser.full_name}</h1>
            <p className="text-white/60">{mockUser.email}</p>
          </div>
        </div>
      </div>

      {/* Points & Stats */}
      <div className="max-w-4xl mx-auto px-4 -mt-14 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <p className="text-slate-500 text-sm mb-1">Puntos disponibles</p>
          <p className="text-3xl font-bold text-amber-600">{mockUser.points}</p>
          <p className="text-slate-500 mt-2">Nivel: {mockUser.level}</p>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockUser.articles_read}</p>
              <p className="text-xs text-slate-500">Artículos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockUser.reservations_made}</p>
              <p className="text-xs text-slate-500">Reservas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockUser.orders_completed}</p>
              <p className="text-xs text-slate-500">Pedidos</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="text-center">
          <button className="mt-4 px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

