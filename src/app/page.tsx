'use client';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
// Redéploiement forcé - Nouveau chargement CALIWHITE
import CategoryFilter from '../components/CategoryFilter';
import ProductCard, { Product } from '../components/ProductCard';
import ProductDetail from '../components/ProductDetail';
import BottomNav from '../components/BottomNav';
import contentCache from '../lib/contentCache';
import { useAdminSync } from '../hooks/useAdminSync';
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('Toutes les catégories');
  const [selectedFarm, setSelectedFarm] = useState('Toutes les farms');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('menu');
  const router = useRouter();
  
  // Précharger les autres pages pour navigation instantanée
  useEffect(() => {
    router.prefetch('/info');
    router.prefetch('/contact');
    router.prefetch('/social');
  }, [router]);
  
  // États pour les données - Initialiser avec des valeurs par défaut
  const [loading, setLoading] = useState(true); // Toujours true au départ
  const [settings, setSettings] = useState<any>(null);

  // Charger les settings immédiatement ET écouter les changements admin
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Essayer d'abord le localStorage
        const cached = localStorage.getItem('shopSettings');
        if (cached) {
          const cachedData = JSON.parse(cached);
          setSettings(cachedData);
          console.log('🚀 Page - Settings depuis localStorage:', cachedData.shopTitle);
        }
        
        // Puis charger depuis l'API
        const settingsRes = await fetch('/api/cloudflare/settings', { cache: 'no-store' });
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
          localStorage.setItem('shopSettings', JSON.stringify(settingsData));
          console.log('📝 Page - Settings depuis API:', settingsData.shopTitle);
        }
      } catch (error) {
        console.error('Erreur chargement settings:', error);
        setSettings({ shopTitle: 'CALIWHITE', shopName: 'CALIWHITE' });
      }
    };
    
    loadSettings();
    
    // Écouter les mises à jour depuis le panel admin
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('🔄 Page - Settings mis à jour depuis admin:', event.detail);
      setSettings(event.detail);
      
      // Recharger immédiatement les données
      loadAllData();
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);
  
  // Gérer la logique de première visite côté client uniquement
  useEffect(() => {
    // Vérifier si c'est la première visite
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      // Si déjà visité, cacher le chargement immédiatement
      setLoading(false);
    } else {
      // Si première visite, marquer comme visité
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, []); // Ne s'exécute qu'une fois au montage
  
  // Charger le thème depuis l'API au démarrage
  useEffect(() => {
    const loadThemeForNewVisitors = async () => {
      try {
        // Charger les paramètres depuis l'API pour les nouveaux visiteurs
        const settingsRes = await fetch('/api/cloudflare/settings', { cache: 'no-store' });
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData); // Sauvegarder dans l'état
          
          // Sauvegarder dans localStorage pour les prochaines visites
          localStorage.setItem('shopSettings', JSON.stringify(settingsData));
          
          // Appliquer le thème immédiatement
          if (settingsData.backgroundImage) {
            const style = document.createElement('style');
            style.id = 'dynamic-theme-new-visitor';
            style.textContent = `
              html, body, .main-container {
                background-image: url(${settingsData.backgroundImage}) !important;
                background-size: cover !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
                background-attachment: fixed !important;
              }
              .global-overlay {
                background-color: rgba(0, 0, 0, ${(settingsData.backgroundOpacity || 20) / 100}) !important;
                backdrop-filter: blur(${settingsData.backgroundBlur || 5}px) !important;
              }
            `;
            document.head.appendChild(style);
          }
        }
      } catch (error) {
        console.error('Erreur chargement thème:', error);
      }
    };
    
    // Charger le thème immédiatement pour les nouveaux visiteurs
    if (!localStorage.getItem('shopSettings')) {
      loadThemeForNewVisitors();
    }
  }, []);

  // Charger immédiatement depuis l'API - PAS depuis localStorage
  const getInitialProducts = () => {
    // Toujours retourner un tableau vide pour forcer le chargement depuis l'API
    return [];
  };
  
  const getInitialCategories = () => {
    // Toujours retourner les catégories par défaut pour forcer le chargement depuis l'API
    return ['Toutes les catégories'];
  };
  
  const getInitialFarms = () => {
    // Toujours retourner les farms par défaut pour forcer le chargement depuis l'API
    return ['Toutes les farms'];
  };
  
  const [products, setProducts] = useState<Product[]>(getInitialProducts());
  const [categories, setCategories] = useState<string[]>(getInitialCategories());
  const [farms, setFarms] = useState<string[]>(getInitialFarms());

  // Fonction de rechargement des données
  const loadAllData = async () => {
    try {
      console.log('🔄 Rechargement données...');
      
      const [productsRes, categoriesRes, farmsRes] = await Promise.all([
        fetch('/api/cloudflare/products', { cache: 'no-store' }),
        fetch('/api/cloudflare/categories', { cache: 'no-store' }),
        fetch('/api/cloudflare/farms', { cache: 'no-store' })
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        console.log('📦 Produits:', productsData.length);
        setProducts(productsData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        console.log('🏷️ Catégories:', categoriesData.length);
        setCategories(['Toutes les catégories', ...categoriesData.map((c: any) => c.name)]);
      }

      if (farmsRes.ok) {
        const farmsData = await farmsRes.json();
        console.log('🏭 Farms:', farmsData.length);
        setFarms(['Toutes les farms', ...farmsData.map((f: any) => f.name)]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement CALIWHITE:', error);
      setProducts([]);
      setCategories(['Toutes les catégories']);
      setFarms(['Toutes les farms']);
    }
  };

  // Synchronisation avec l'admin
  useAdminSync(loadAllData);



  // CHARGEMENT INSTANTANÉ DEPUIS L'API (DONNÉES FRAÎCHES)
  useEffect(() => {
    // Charger IMMÉDIATEMENT depuis l'API pour données fraîches
    loadAllData();
    
    // Cacher le chargement après délai
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    // Rafraîchir les données toutes les 2 secondes pour synchronisation temps réel
    const interval = setInterval(() => {
      loadAllData();
    }, 2000);
    
    return () => {
      clearTimeout(loadingTimeout);
      clearInterval(interval);
    };
  }, []);

  // Écouter les mises à jour du cache
  useEffect(() => {
    const handleCacheUpdate = (event: CustomEvent) => {
      const { products: newProducts, categories: newCategories, farms: newFarms } = event.detail;
      
      if (newProducts) {
        setProducts(newProducts);
      }
      
      if (newCategories) {
        setCategories(['Toutes les catégories', ...newCategories.map((c: any) => c.name)]);
      }
      
      if (newFarms) {
        setFarms(['Toutes les farms', ...newFarms.map((f: any) => f.name)]);
      }
    };
    
    window.addEventListener('cacheUpdated', handleCacheUpdate as EventListener);
    
    return () => {
      window.removeEventListener('cacheUpdated', handleCacheUpdate as EventListener);
    };
  }, []);

  // Filtrage des produits
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'Toutes les catégories' || product.category === selectedCategory;
    const farmMatch = selectedFarm === 'Toutes les farms' || product.farm === selectedFarm;
    return categoryMatch && farmMatch;
  });

  const handleTabChange = (tabId: string) => {
    if (tabId === 'social') {
      router.push('/social');
    } else if (tabId === 'infos') {
      router.push('/info');
    } else if (tabId === 'contact') {
      router.push('/contact');
    } else {
      setActiveTab(tabId);
      if (tabId === 'menu') {
        setSelectedProduct(null);
      }
    }
  };

  // Écran de chargement CLEAN - Style moderne
  if (loading) {
    return (
      <div className="main-container loading-container">
        <div className="global-overlay"></div>
        <div className="content-layer">
          <div className="min-h-screen loading-screen flex items-center justify-center p-4">
            <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 sm:p-12 max-w-lg mx-auto shadow-xl border border-gray-200">

              {/* Logo Clean - Utilise backgroundImage du panel admin ou défaut */}
              <div className="mb-8">
                {settings?.backgroundImage ? (
                  <img 
                    src={settings.backgroundImage} 
                    alt={settings.shopTitle || settings.shopName || 'CALIWHITE'} 
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl object-cover shadow-lg border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-2xl sm:text-3xl">
                      {(settings?.shopTitle || settings?.shopName || 'CALIWHITE').charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl sm:text-3xl text-gray-900 mb-8 font-black tracking-tight">
                {settings?.shopTitle || settings?.shopName || 'CALIWHITE'}
              </h2>
              
              {/* Barre de chargement CLEAN */}
              <div className="w-full max-w-sm mx-auto mb-8">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full animate-loading-bar"></div>
                </div>
                <div className="mt-3 text-sm text-gray-600 font-medium">Chargement...</div>
              </div>
              
              {/* Points de chargement Clean */}
              <div className="flex justify-center gap-2 mb-8">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              
              {/* Footer Clean */}
              <div className="text-gray-500 text-sm font-medium">
                <p>Boutique Premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }





  // Structure avec fond toujours visible
  return (
    <div className="main-container">
      {/* Overlay global toujours présent */}
      <div className="global-overlay"></div>
      
      {/* Contenu principal avec navigation */}
      <div className="content-layer">
        <Header />
        
        {/* Ajouter un padding-top pour compenser le header fixe */}
        <div className="pt-24 sm:pt-28 md:pt-32">
            {selectedProduct ? (
              <ProductDetail 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
              />
            ) : (
              <div className="pt-2">
                <CategoryFilter
                  categories={categories}
                  farms={farms}
                  selectedCategory={selectedCategory}
                  selectedFarm={selectedFarm}
                  onCategoryChange={setSelectedCategory}
                  onFarmChange={setSelectedFarm}
                />
                
                <main className="pt-6 pb-24 sm:pb-28 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                
                {/* Hero Section Clean */}
                <div className="text-center py-8 sm:py-12 mb-8">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Découvrez CALIWHITE
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                    Produits de qualité supérieure avec livraison express
                  </p>
                </div>

                {/* Affichage des produits CLEAN */}
                {filteredProducts.length === 0 && products.length > 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                    <p className="text-gray-600">
                      Aucun produit ne correspond à vos critères de recherche
                    </p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onClick={() => setSelectedProduct(product)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 sm:py-20">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl">🛍️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Boutique en préparation</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Nos produits seront bientôt disponibles. Revenez prochainement !
                    </p>
                  </div>
                )}
                </main>
              </div>
            )}
        </div>
      </div>
      
      {/* BottomNav toujours visible - en dehors du content-layer */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}