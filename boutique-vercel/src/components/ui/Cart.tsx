'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiPlus, FiMinus, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { useCartStore } from '@/lib/cart';
import Image from 'next/image';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { cart, updateQuantity, removeItem, clearCart, getCartMessage } = useCartStore();

  const handleOrder = () => {
    const message = getCartMessage();
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-start justify-between p-4 border-b">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Panier ({cart.itemCount})
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                          onClick={onClose}
                        >
                          <FiX className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      {cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                          <div className="text-6xl mb-4">🛒</div>
                          <p className="text-lg font-medium">Votre panier est vide</p>
                          <p className="text-sm mt-2">Ajoutez des produits pour commencer</p>
                        </div>
                      ) : (
                        <div className="px-4 py-6">
                          <div className="flow-root">
                            <ul className="-my-6 divide-y divide-gray-200">
                              {cart.items.map((item, index) => (
                                <li key={`${item.product.id}-${item.priceId}-${index}`} className="flex py-6">
                                  {/* Image du produit */}
                                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    {item.product.images && item.product.images.length > 0 ? (
                                      <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        width={80}
                                        height={80}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    ) : (
                                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400 text-xs">No image</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Détails du produit */}
                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3 className="text-sm">{item.product.name}</h3>
                                        <button
                                          onClick={() => removeItem(item.product.id, item.priceId)}
                                          className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                          <FiTrash2 size={16} />
                                        </button>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">{item.price.label}</p>
                                      <div className="flex items-center mt-1">
                                        <span className="text-lg font-bold text-green-600">
                                          {item.price.price.toFixed(2)}€
                                        </span>
                                        {item.price.originalPrice && (
                                          <span className="ml-2 text-sm text-gray-400 line-through">
                                            {item.price.originalPrice.toFixed(2)}€
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Contrôles de quantité */}
                                    <div className="flex items-end justify-between text-sm mt-4">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => updateQuantity(item.product.id, item.priceId, Math.max(0, item.quantity - 1))}
                                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                                        >
                                          <FiMinus size={14} />
                                        </button>
                                        <span className="px-3 py-1 border border-gray-300 rounded-md min-w-[60px] text-center">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() => updateQuantity(item.product.id, item.priceId, item.quantity + 1)}
                                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                                        >
                                          <FiPlus size={14} />
                                        </button>
                                      </div>
                                      <p className="font-medium">
                                        {(item.price.price * item.quantity).toFixed(2)}€
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {cart.items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                          <p>Total</p>
                          <p className="text-2xl font-bold text-green-600">{cart.total.toFixed(2)}€</p>
                        </div>
                        
                        <div className="space-y-3">
                          <button
                            onClick={handleOrder}
                            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                          >
                            <FiExternalLink className="mr-2" size={20} />
                            Commander via WhatsApp
                          </button>
                          
                          <button
                            onClick={clearCart}
                            className="w-full px-6 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            Vider le panier
                          </button>
                        </div>

                        <p className="mt-4 text-center text-sm text-gray-500">
                          La commande sera envoyée via WhatsApp
                        </p>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}