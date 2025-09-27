'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCartStore } from '@/lib/cart';
import Cart from '@/components/ui/Cart';
import { SiteConfig } from '@/types';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig[]>([]);
  const { cart } = useCartStore();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          setSiteConfig(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
      }
    };

    fetchConfig();
  }, []);

  const getConfigValue = (key: string, defaultValue: string = '') => {
    const config = siteConfig.find(c => c.key === key);
    return config ? config.value : defaultValue;
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo dynamique */}
            <Link href="/" className="flex items-center space-x-3">
              {getConfigValue('logo_url') ? (
                <div className="w-12 h-12">
                  <DotLottieReact
                    src={getConfigValue('logo_url', 'https://lottie.host/4d929af8-c4a1-4a8c-b0f6-8f8c5c8e0a1b/YXfOJGwpuN.lottie')}
                    loop
                    autoplay
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
              )}
              <span className="text-2xl font-bold text-black">
                {getConfigValue('site_name', 'Boutique')}
              </span>
            </Link>

            {/* Navigation Desktop - Simple et épuré */}
            <nav className="hidden md:flex space-x-8">
              {/* Navigation simplifiée - pas de liens complexes */}
            </nav>

            {/* Panier */}
            <div className="flex items-center">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-black transition-colors"
              >
                <FiShoppingCart size={24} />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cart.itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Panier */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}