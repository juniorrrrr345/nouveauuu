'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiLink } from 'react-icons/fi';
import { SocialMedia } from '@/types';

const platformOptions = [
  { value: 'facebook', label: 'Facebook', icon: FiFacebook },
  { value: 'instagram', label: 'Instagram', icon: FiInstagram },
  { value: 'twitter', label: 'Twitter', icon: FiTwitter },
  { value: 'youtube', label: 'YouTube', icon: FiYoutube },
  { value: 'email', label: 'Email', icon: FiMail },
  { value: 'phone', label: 'Téléphone', icon: FiPhone },
  { value: 'website', label: 'Site Web', icon: FiLink },
];

export default function SocialPage() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialMedia | null>(null);
  const [formData, setFormData] = useState({
    platform: '',
    name: '',
    url: '',
  });

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const fetchSocialMedia = async () => {
    try {
      const response = await fetch('/api/social');
      if (response.ok) {
        const data = await response.json();
        setSocialMedia(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réseaux sociaux:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSocial 
        ? `/api/social/${editingSocial.id}` 
        : '/api/social';
      
      const method = editingSocial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSocialMedia();
        resetForm();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce réseau social ?')) {
      try {
        const response = await fetch(`/api/social/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchSocialMedia();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (social: SocialMedia) => {
    setEditingSocial(social);
    setFormData({
      platform: social.platform,
      name: social.name,
      url: social.url,
    });
    setShowModal(true);
  };

  const getIconComponent = (platform: string) => {
    const option = platformOptions.find(opt => opt.value === platform);
    return option ? option.icon : FiLink;
  };

  const resetForm = () => {
    setFormData({
      platform: '',
      name: '',
      url: '',
    });
    setEditingSocial(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Réseaux Sociaux</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gérer les liens de réseaux sociaux et contacts ({socialMedia.length})
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FiPlus className="mr-2" size={16} />
            Nouveau réseau
          </button>
        </div>

        {socialMedia.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun réseau social configuré
            </h3>
            <p className="text-gray-500 mb-4">
              Ajoutez vos réseaux sociaux et contacts pour permettre aux clients de vous suivre
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FiPlus className="mr-2" size={16} />
              Premier réseau
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {socialMedia.map((social) => {
              const IconComponent = getIconComponent(social.platform);
              return (
                <div key={social.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        <IconComponent size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{social.name}</h3>
                        <p className="text-xs text-gray-500 capitalize">{social.platform}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(social)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(social.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {social.url}
                    </a>
                  </div>

                  <div className="flex items-center justify-end text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full ${
                      social.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {social.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {editingSocial ? 'Modifier le réseau social' : 'Nouveau réseau social'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plateforme *
                  </label>
                  <select
                    required
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Sélectionner une plateforme</option>
                    {platformOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'affichage *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Notre Facebook"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Lien complet vers votre profil/page
                  </p>
                </div>

              </div>

              {/* Aperçu */}
              {formData.platform && formData.name && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Aperçu :</h4>
                  <div className="flex items-center">
                    <div className="p-2 bg-white rounded-lg mr-3">
                      {formData.icon ? (
                        <img src={formData.icon} alt="" className="w-6 h-6" />
                      ) : (
                        (() => {
                          const IconComponent = getIconComponent(formData.platform);
                          return <IconComponent size={24} className="text-gray-600" />;
                        })()
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{formData.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{formData.platform}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {editingSocial ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}