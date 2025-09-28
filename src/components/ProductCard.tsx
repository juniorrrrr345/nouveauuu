import MediaDisplay from './MediaDisplay';

interface Product {
  id: number;
  name: string;
  farm: string;
  category: string;
  image_url: string;
  video_url?: string;
  description?: string;
  prices: {
    "5g": number;
    "10g": number;
    "25g": number;
    "50g": number;
    "100g": number;
    "200g": number;
  };
}

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group touch-manipulation w-full"
    >
      {/* Container image avec badge */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-4xl">📷</div>
          </div>
        )}
        
        {/* Badge catégorie CLEAN */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
          {product.category}
        </div>
        
        {/* Indicateur vidéo CLEAN */}
        {product.video_url && (
          <div className="absolute top-3 right-3 bg-white/90 text-blue-600 p-2 rounded-full shadow-lg backdrop-blur-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5v10l8-5-8-5z" />
            </svg>
          </div>
        )}
        
        {/* Overlay subtil au survol */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Informations produit CLEAN */}
      <div className="p-4 sm:p-5">
        <h3 className="text-gray-900 font-bold text-sm sm:text-base mb-2 leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="text-blue-600 text-xs sm:text-sm font-medium mb-2 line-clamp-1">
          {product.farm}
        </p>
        {/* Description du produit */}
        {product.description && (
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        
        {/* Bouton d'action Clean */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 text-sm">
            Voir les détails
          </button>
        </div>
      </div>
    </div>
  );
}

export type { Product };