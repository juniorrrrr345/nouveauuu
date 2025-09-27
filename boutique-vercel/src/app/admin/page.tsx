'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPackage, FiUsers, FiHome, FiShare2, FiSettings, FiTrendingUp, FiShoppingCart } from 'react-icons/fi';

interface DashboardStats {
  products: number;
  categories: number;
  farms: number;
  socialMedia: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    farms: 0,
    socialMedia: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes, farmsRes, socialRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/farms'),
        fetch('/api/social'),
      ]);

      const [products, categories, farms, social] = await Promise.all([
        productsRes.ok ? productsRes.json() : [],
        categoriesRes.ok ? categoriesRes.json() : [],
        farmsRes.ok ? farmsRes.json() : [],
        socialRes.ok ? socialRes.json() : [],
      ]);

      setStats({
        products: products.length || 0,
        categories: categories.length || 0,
        farms: farms.length || 0,
        socialMedia: social.length || 0,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: 'Nouveau produit',
      href: '/admin/produits',
      icon: FiPackage,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Nouvelle catégorie',
      href: '/admin/categories',
      icon: FiUsers,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Nouvelle ferme',
      href: '/admin/farm',
      icon: FiHome,
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      name: 'Configuration',
      href: '/admin/configuration',
      icon: FiSettings,
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-2 text-gray-600">
          Bienvenue dans votre panel d'administration. Gérez votre boutique en ligne.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FiPackage className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Produits</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.products}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FiUsers className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Catégories</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.categories}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FiHome className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fermes</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.farms}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FiShare2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Réseaux sociaux</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.socialMedia}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className={`${action.color} text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-200`}
                >
                  <action.icon className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">{action.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Informations système */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configuration</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Cloudflare R2</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Configuré
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Base de données</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  SQLite
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Environnement</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Développement
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Panier WhatsApp</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Actif
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                href="/admin/configuration"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
              >
                <FiSettings className="mr-2" size={16} />
                Aller à la configuration
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lien vers le site */}
      <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">Voir votre boutique</h3>
              <p className="text-green-100">Découvrez comment vos clients voient votre site</p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center px-4 py-2 bg-white text-green-600 rounded-md hover:bg-gray-100 font-medium transition-colors"
            >
              <FiShoppingCart className="mr-2" size={16} />
              Visiter la boutique
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}