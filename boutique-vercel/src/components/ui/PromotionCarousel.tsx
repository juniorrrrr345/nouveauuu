'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PromotionCarouselProps {
  images?: string[];
  autoPlay?: boolean;
  interval?: number;
}

export default function PromotionCarousel({ 
  images = [], 
  autoPlay = true, 
  interval = 5000 
}: PromotionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [promotionImages, setPromotionImages] = useState<string[]>([]);

  useEffect(() => {
    // Récupérer les images de promotion depuis la configuration
    const fetchPromotionImages = async () => {
      try {
        const response = await fetch('/api/config?key=promotion_images');
        if (response.ok) {
          const config = await response.json();
          if (config.value && Array.isArray(config.value)) {
            setPromotionImages(config.value);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des images de promotion:', error);
      }
    };

    if (images.length === 0) {
      fetchPromotionImages();
    } else {
      setPromotionImages(images);
    }
  }, [images]);

  // Images par défaut si aucune n'est configurée
  const defaultImages = [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
  ];

  const displayImages = promotionImages.length > 0 ? promotionImages : defaultImages;

  // Auto-play
  useEffect(() => {
    if (autoPlay && displayImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
        );
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, displayImages.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? displayImages.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === displayImages.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (displayImages.length === 0) {
    return (
      <div className="w-full bg-gray-100 rounded-xl p-8">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Carrousel principal */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayImages.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <Image
                src={image}
                alt={`Promotion ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ))}
        </div>

        {/* Boutons de navigation */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Image précédente"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Image suivante"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}

        {/* Indicateurs */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniatures circulaires */}
      <div className="p-4 bg-gray-50">
        <div className="flex justify-center items-center space-x-4 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 relative transition-all duration-200 ${
                index === currentIndex
                  ? 'scale-110 ring-4 ring-green-500'
                  : 'hover:scale-105 ring-2 ring-gray-200'
              }`}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-md">
                <Image
                  src={image}
                  alt={`Miniature ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}