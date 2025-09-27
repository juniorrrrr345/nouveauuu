'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import PromotionCarousel from '@/components/ui/PromotionCarousel';
import ProductCard from '@/components/ui/ProductCard';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.slice(0, 12)); // Afficher les 12 premiers produits
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section avec Carrousel */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Produits Frais
              <span className="text-green-600"> de Qualité</span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos produits authentiques directement de nos fermes partenaires
            </p>
          </div>
          
          {/* Carrousel promotionnel */}
          <div className="max-w-4xl mx-auto">
            <PromotionCarousel />
          </div>
        </div>
      </section>

      {/* Section Produits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Produits
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explorez notre sélection de produits frais et de qualité
            </p>
          </div>

          {loading ? (
            /* Loading State */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            /* Grille des produits - 2 par ligne */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* État vide */
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun produit disponible
              </h3>
              <p className="text-gray-500">
                Nos produits seront bientôt disponibles !
              </p>
            </div>
          )}

          {/* Lien vers tous les produits */}
          {products.length > 0 && (
            <div className="text-center mt-12">
              <a
                href="/categories"
                className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Voir tous les produits
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}