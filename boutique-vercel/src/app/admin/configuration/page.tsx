'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiUpload, FiTrash2, FiPlus } from 'react-icons/fi';

interface ConfigItem {
  id: string;
  key: string;
  value: any;
  type: string;
}

export default function ConfigurationPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [promotionImages, setPromotionImages] = useState<string[]>([]);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
        
        // Extraire les images de promotion
        const promoConfig = data.find((config: ConfigItem) => config.key === 'promotion_images');
        if (promoConfig && Array.isArray(promoConfig.value)) {
          setPromotionImages(promoConfig.value);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (key: string, value: any, type: string = 'text') => {
    setSaving(key);
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value,
          type,
        }),
      });

      if (response.ok) {
        await fetchConfigs();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(null);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newImages = [...promotionImages, data.url];
        setPromotionImages(newImages);
        await saveConfig('promotion_images', newImages, 'json');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    }
  };

  const removePromotionImage = async (index: number) => {
    const newImages = promotionImages.filter((_, i) => i !== index);
    setPromotionImages(newImages);
    await saveConfig('promotion_images', newImages, 'json');
  };

  const getConfigValue = (key: string, defaultValue: any = '') => {
    const config = configs.find(c => c.key === key);
    return config ? config.value : defaultValue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gérer les paramètres généraux de la boutique
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Configuration générale */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la boutique
                </label>
                <div className="flex">
                  <input
                    type="text"
                    defaultValue={getConfigValue('site_name', 'Boutique')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    onBlur={(e) => saveConfig('site_name', e.target.value)}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                      saveConfig('site_name', input.value);
                    }}
                    disabled={saving === 'site_name'}
                    className="ml-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving === 'site_name' ? '...' : <FiSave size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL du logo Lottie
                </label>
                <div className="flex">
                  <input
                    type="text"
                    defaultValue={getConfigValue('logo_url', 'https://lottie.host/4d929af8-c4a1-4a8c-b0f6-8f8c5c8e0a1b/YXfOJGwpuN.lottie')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    onBlur={(e) => saveConfig('logo_url', e.target.value)}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                      saveConfig('logo_url', input.value);
                    }}
                    disabled={saving === 'logo_url'}
                    className="ml-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving === 'logo_url' ? '...' : <FiSave size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro WhatsApp (avec indicatif)
                </label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="ex: 33612345678"
                    defaultValue={getConfigValue('whatsapp_number', '')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    onBlur={(e) => saveConfig('whatsapp_number', e.target.value)}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                      saveConfig('whatsapp_number', input.value);
                    }}
                    disabled={saving === 'whatsapp_number'}
                    className="ml-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving === 'whatsapp_number' ? '...' : <FiSave size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description de la boutique
                </label>
                <div className="flex">
                  <textarea
                    rows={3}
                    defaultValue={getConfigValue('site_description', 'Découvrez nos produits frais de qualité')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    onBlur={(e) => saveConfig('site_description', e.target.value)}
                  />
                  <button
                    onClick={(e) => {
                      const textarea = e.currentTarget.parentElement?.querySelector('textarea') as HTMLTextAreaElement;
                      saveConfig('site_description', textarea.value);
                    }}
                    disabled={saving === 'site_description'}
                    className="ml-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving === 'site_description' ? '...' : <FiSave size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Images de promotion */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Images promotionnelles</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center mb-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    <FiUpload className="mr-2" size={16} />
                    Ajouter une image
                  </div>
                </label>
              </div>

              {promotionImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {promotionImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Promotion ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePromotionImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}