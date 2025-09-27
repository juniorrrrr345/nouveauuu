'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlus, FiHeart, FiTag } from 'react-icons/fi';
import { Product, ProductPrice } from '@/types';
import { useCartStore } from '@/lib/cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedPriceId, setSelectedPriceId] = useState(
    product.prices.find(p => p.isDefault)?.id || product.prices[0]?.id || ''
  );
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();

  const selectedPrice = product.prices.find(p => p.id === selectedPriceId);

  const handleAddToCart = async () => {
    if (!selectedPrice) return;
    
    setIsAdding(true);
    
    // Petit délai pour l'animation
    setTimeout(() => {
      addItem(product, selectedPriceId, selectedPrice);
      setIsAdding(false);
    }, 300);
  };

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image du produit */}
      <div className="relative h-48 overflow-hidden">
        <Link href={`/produit/${product.id}`}>
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Badge stock faible */}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Stock faible
          </div>
        )}
        
        {/* Badge rupture de stock */}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Rupture de stock
          </div>
        )}

        {/* Badge promotion */}
        {selectedPrice?.originalPrice && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <FiTag size={12} className="mr-1" />
            Promo
          </div>
        )}

        {/* Bouton favori */}
        <button className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <FiHeart size={16} />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Nom et description */}
        <Link href={`/produit/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Catégorie et ferme */}
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
          <span className="bg-gray-100 px-2 py-1 rounded">
            {product.category?.name}
          </span>
          {product.farm && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              {product.farm.name}
            </span>
          )}
        </div>

        {/* Sélection de prix */}
        {product.prices.length > 1 && (
          <div className="mb-3">
            <select
              value={selectedPriceId}
              onChange={(e) => setSelectedPriceId(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {product.prices.map((price) => (
                <option key={price.id} value={price.id}>
                  {price.label} - {price.price.toFixed(2)}€
                  {price.originalPrice && ` (au lieu de ${price.originalPrice.toFixed(2)}€)`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Prix */}
        {selectedPrice && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">
                {selectedPrice.price.toFixed(2)}€
              </span>
              {selectedPrice.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {selectedPrice.originalPrice.toFixed(2)}€
                </span>
              )}
            </div>
            {product.prices.length === 1 && (
              <span className="text-sm text-gray-500">
                {selectedPrice.label}
              </span>
            )}
          </div>
        )}

        {/* Stock */}
        <div className="mb-4">
          {product.stock > 0 ? (
            <span className="text-xs text-green-600">
              ✓ En stock ({product.stock} disponibles)
            </span>
          ) : (
            <span className="text-xs text-red-500">
              ✗ Rupture de stock
            </span>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isAdding
                ? 'bg-green-700 text-white scale-95'
                : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105'
            }`}
          >
            <FiPlus size={16} className="mr-2" />
            {isAdding ? 'Ajout...' : 'Ajouter'}
          </button>
          
          <Link
            href={`/produit/${product.id}`}
            className="px-4 py-2 border border-green-600 text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium transition-colors"
          >
            Voir
          </Link>
        </div>
      </div>
    </div>
  );
}