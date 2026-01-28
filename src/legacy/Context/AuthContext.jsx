// src/contexts/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { base44 } from '@/api/base44Client';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userPoints, setUserPoints] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         const u = await base44.auth.me();
//         setUser(u);
        
//         // Cargamos los puntos como parte del perfil de usuario
//         const points = await base44.entities.UserPoints.filter({ user_id: u.id });
//         setUserPoints(points[0]);
//       } catch (error) {
//         console.error("No hay sesión activa");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initAuth();
//   }, []);

//   const login = () => base44.auth.redirectToLogin();
//   const logout = () => base44.auth.logout();

//   return (
//     <AuthContext.Provider value={{ user, userPoints, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
//   return context;
// };
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // MOCK login
  const login = () => {
    setUser({
      id: 1,
      name: 'Usuario Demo',
      role: 'user',
    })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
