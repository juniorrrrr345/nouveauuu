'use client';
import { useState, useEffect } from 'react';
import contentCache from '@/lib/contentCache';
import { useCartStore } from '@/lib/cartStore';
import { ShoppingCart } from 'lucide-react';

interface Settings {
  shopTitle: string;
  shopSubtitle: string;
  bannerText: string;
  titleEffect: string;
  scrollingText: string;
}

export default function Header() {
  const { getTotalItems, setIsOpen } = useCartStore();
  const totalItems = getTotalItems();
  
  const [settings, setSettings] = useState(null); // null = pas encore chargé
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les settings depuis l'API Cloudflare ET écouter les changements admin
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // 1. Essayer localStorage d'abord (plus rapide)
        const cached = localStorage.getItem('shopSettings');
        if (cached) {
          const cachedData = JSON.parse(cached);
          setSettings({
            shopTitle: cachedData.shopTitle || cachedData.shopName || 'CALIWHITE',
            shopSubtitle: '',
            scrollingText: cachedData.scrollingText || cachedData.scrolling_text || '',
            bannerText: '',
            titleStyle: cachedData.titleStyle || cachedData.theme_color || 'glow',
            backgroundImage: cachedData.backgroundImage || cachedData.background_image || ''
          });
          setIsLoaded(true);
          console.log('🚀 Header - Settings depuis localStorage:', cachedData.shopTitle);
        }
        
        // 2. Puis charger depuis l'API
        const response = await fetch('/api/cloudflare/settings', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          console.log('📝 Header - Settings depuis API:', data);
          
          const newSettings = {
            shopTitle: data.shopName || data.shopTitle || 'CALIWHITE',
            shopSubtitle: '',
            scrollingText: data.scrollingText || data.scrolling_text || '',
            bannerText: '',
            titleStyle: data.titleStyle || data.theme_color || 'glow',
            backgroundImage: data.backgroundImage || data.background_image || ''
          };
          
          setSettings(newSettings);
          setIsLoaded(true);
          
          // Sauvegarder pour la prochaine fois
          localStorage.setItem('shopSettings', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Erreur chargement settings Header:', error);
        
        // Fallback minimal
        setSettings({
          shopTitle: 'CALIWHITE',
          shopSubtitle: '',
          scrollingText: '',
          bannerText: '',
          titleStyle: 'glow',
          backgroundImage: ''
        });
        setIsLoaded(true);
      }
    };

    loadSettings();
    
    // Écouter les mises à jour depuis le panel admin
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('🔄 Header - Settings mis à jour depuis admin:', event.detail);
      const newData = event.detail;
      
      setSettings({
        shopTitle: newData.shopTitle || newData.shopName || 'CALIWHITE',
        shopSubtitle: '',
        scrollingText: newData.scrollingText || newData.scrolling_text || '',
        bannerText: '',
        titleStyle: newData.titleStyle || newData.theme_color || 'glow',
        backgroundImage: newData.backgroundImage || newData.background_image || ''
      });
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    
    // Recharger périodiquement pour synchronisation
    const interval = setInterval(loadSettings, 10000); // Toutes les 10s
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    // Mise à jour en arrière-plan (pas prioritaire)
    setTimeout(() => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          setSettings({
            shopTitle: data.shopTitle || '',
            shopSubtitle: data.shopSubtitle || '',
            scrollingText: data.scrollingText || '',
            bannerText: data.bannerText || '',
            titleStyle: data.titleStyle || 'glow'
          });
          // Sauvegarder pour la prochaine fois
          localStorage.setItem('adminSettings', JSON.stringify(data));
        })
        .catch(() => {});
    }, 50);
  }, []);

  const getTitleClass = () => {
    const baseClass = "text-responsive-lg sm:text-responsive-xl md:text-responsive-2xl font-black tracking-wider transition-all duration-300 text-center line-height-tight";
    
    switch (settings.titleStyle) {
      case 'gradient':
        return `${baseClass} bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent`;
      case 'neon':
        return `${baseClass} text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]`;
      case 'rainbow':
        return `${baseClass} bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse`;
      case 'glow':
        return `${baseClass} text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]`;
      case 'shadow':
        return `${baseClass} text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]`;
      case 'bounce':
        return `${baseClass} text-white animate-bounce`;
      case 'graffiti':
        return `graffiti-text text-responsive-lg sm:text-responsive-xl md:text-responsive-2xl font-normal`;
      default:
        return `${baseClass} text-white`;
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm safe-area-padding">
      {/* N'afficher que si les données sont chargées */}
      {isLoaded && settings && (
        <>
          {/* Texte défilant CLEAN - style moderne */}
          {settings.scrollingText && settings.scrollingText.trim() && (
            <div className="bg-blue-50 text-blue-900 py-1 overflow-hidden relative border-b border-blue-100">
              <div className="animate-marquee whitespace-nowrap inline-block">
                <span className="text-xs font-medium tracking-wide px-4">
                  {settings.scrollingText}
                </span>
              </div>
            </div>
          )}
          
          {/* Logo boutique CLEAN - style Apple */}
          <div className="bg-white/80 backdrop-blur-xl py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 text-center relative">
            {/* Bouton panier CLEAN */}
            <button
              onClick={() => setIsOpen(true)}
              className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 p-2.5 sm:p-3 rounded-full transition-all duration-200 flex items-center gap-2 shadow-sm border border-gray-300/50"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className="bg-blue-600 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            
            <div className="flex flex-col items-center justify-center">
              {/* Logo ou texte selon les settings admin */}
              {settings.backgroundImage ? (
                <img 
                  src={settings.backgroundImage} 
                  alt={settings.shopTitle || settings.shopName || 'CALIWHITE'} 
                  className="h-12 sm:h-14 md:h-16 w-auto rounded-lg shadow-sm border border-gray-200"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                  {settings.shopTitle || settings.shopName || 'CALIWHITE'}
                </h1>
              )}
              <div className="w-12 h-0.5 bg-blue-600 mt-2 rounded-full"></div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}