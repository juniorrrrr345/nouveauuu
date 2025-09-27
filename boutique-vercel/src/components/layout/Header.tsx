'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { useCartStore } from '@/lib/cart';
import Cart from '@/components/ui/Cart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCartStore();

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo avec Lottie */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12">
                <DotLottieReact
                  src="https://lottie.host/4d929af8-c4a1-4a8c-b0f6-8f8c5c8e0a1b/YXfOJGwpuN.lottie"
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
              <span className="text-2xl font-bold text-green-600">Boutique</span>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/categories" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Catégories
              </Link>
              <Link 
                href="/farm" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Farm
              </Link>
            </nav>

            {/* Panier et Menu Mobile */}
            <div className="flex items-center space-x-4">
              {/* Panier */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                <FiShoppingCart size={24} />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cart.itemCount}
                  </span>
                )}
              </button>

              {/* Menu Mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <Link
                href="/categories"
                className="block py-2 text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Catégories
              </Link>
              <Link
                href="/farm"
                className="block py-2 text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Farm
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Panier */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}