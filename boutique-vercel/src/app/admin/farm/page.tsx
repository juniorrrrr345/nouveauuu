'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiUpload, FiX, FiMapPin } from 'react-icons/fi';
import { Farm } from '@/types';

export default function FarmPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await fetch('/api/farms');
      if (response.ok) {
        const data = await response.json();
        setFarms(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fermes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingFarm 
        ? `/api/farms/${editingFarm.id}` 
        : '/api/farms';
      
      const method = editingFarm ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchFarms();
        resetForm();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ferme ?')) {
      try {
        const response = await fetch(`/api/farms/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchFarms();
        } else {
          const error = await response.json();
          alert(error.error || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (farm: Farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
    });
    setShowModal(true);
  };


  const resetForm = () => {
    setFormData({
      name: '',
    });
    setEditingFarm(null);
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
            <h1 className="text-2xl font-bold text-gray-900">Fermes Partenaires</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gérer les fermes partenaires ({farms.length})
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
            Nouvelle ferme
          </button>
        </div>

        {farms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚜</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune ferme enregistrée
            </h3>
            <p className="text-gray-500 mb-4">
              Ajoutez vos fermes partenaires pour commencer
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FiPlus className="mr-2" size={16} />
              Première ferme
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {farms.map((farm) => (
              <div key={farm.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Image de la ferme */}
                <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  {farm.image ? (
                    <img
                      src={farm.image}
                      alt={farm.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">🚜</span>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {farm.name}
                    </h3>
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={() => handleEdit(farm)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(farm.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Localisation */}
                  {farm.location && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FiMapPin size={14} className="mr-1" />
                      {farm.location}
                    </div>
                  )}

                  {/* Description */}
                  {farm.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {farm.description}
                    </p>
                  )}

                  {/* Statistiques */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Créée le {new Date(farm.createdAt).toLocaleDateString()}
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {(farm as any)._count?.products || 0} produits
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {editingFarm ? 'Modifier la ferme' : 'Nouvelle ferme'}
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
                    Nom de la ferme *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="ex: Région Provence, France"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez la ferme, ses spécialités, son histoire..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo de la ferme
                </label>
                
                {formData.image ? (
                  <div className="mb-4">
                    <div className="relative inline-block">
                      <img
                        src={formData.image}
                        alt="Aperçu"
                        className="h-32 w-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="text-center">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Cliquer pour ajouter une photo
                        </span>
                        <span className="block text-xs text-gray-500">
                          JPG, PNG jusqu'à 5MB
                        </span>
                      </div>
                    </label>
                  </div>
                )}
              </div>

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
                  {editingFarm ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}