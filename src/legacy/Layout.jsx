// src/components/Layout.jsx
import React, { useState } from 'react'; // Eliminamos useEffect
import { Link } from 'react-router-dom';
// import { createPageUrl } from '@/utils';
// import { useAuth } from '@/contexts/AuthContext'; // Importamos el nuevo hook
// ... (resto de imports de lucide-react y UI iguales)


// export default function Layout({ children, currentPageName }) {
//   // Extraemos todo del hook global
//   // const { user, userPoints, login, logout } = useAuth();

  
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const navItems = [
//     { icon: Home, label: 'Inicio', href: 'Home' },
//     { icon: Store, label: 'Comercios', href: 'Businesses' },
//     { icon: User, label: 'Perfil', href: 'Profile' },
//   ];

//   const isActive = (href) => currentPageName === href;
//   const hideNav = ['Article', 'ProductDetail'].includes(currentPageName);

 
//     return (
//   <div style={{ padding: 40 }}>
//     <h1>Layout renderizando</h1>
//     {children}
//   </div>
// );
// }


import Header from '@/components/Header'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
    </div>
  )
}
