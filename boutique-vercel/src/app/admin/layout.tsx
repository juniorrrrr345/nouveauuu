'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiSettings, FiPackage, FiHome, FiUsers, FiShare2, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'votre_nouveau_mot_de_passe') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    router.push('/');
  };

  const menuItems = [
    {
      name: 'Configuration',
      href: '/admin/configuration',
      icon: FiSettings,
    },
    {
      name: 'Produits',
      href: '/admin/produits',
      icon: FiPackage,
    },
    {
      name: 'Farm',
      href: '/admin/farm',
      icon: FiHome,
    },
    {
      name: 'Catégories',
      href: '/admin/categories',
      icon: FiUsers,
    },
    {
      name: 'Réseaux',
      href: '/admin/reseaux',
      icon: FiShare2,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Panel Administrateur
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Connectez-vous pour accéder au panel d'administration
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe administrateur"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="mr-3" size={20} />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-8 px-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="mr-3" size={20} />
              Déconnexion
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay pour mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiMenu size={24} />
            </button>
            
            <div className="flex items-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 mr-4"
              >
                Voir le site
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}