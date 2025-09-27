'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone } from 'react-icons/fi';
import { FooterContent, SocialMedia } from '@/types';

export default function Footer() {
  const [footerContent, setFooterContent] = useState<FooterContent[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [footerRes, socialRes] = await Promise.all([
          fetch('/api/footer'),
          fetch('/api/social'),
        ]);

        if (footerRes.ok) {
          const footerData = await footerRes.json();
          setFooterContent(footerData);
        }

        if (socialRes.ok) {
          const socialData = await socialRes.json();
          setSocialMedia(socialData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du footer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const getIconComponent = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return FiFacebook;
      case 'instagram':
        return FiInstagram;
      case 'twitter':
        return FiTwitter;
      case 'youtube':
        return FiYoutube;
      case 'email':
        return FiMail;
      case 'phone':
        return FiPhone;
      default:
        return FiMail;
    }
  };

  const getContentBySection = (section: string) => {
    return footerContent.filter(content => content.section === section);
  };

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-6 bg-gray-700 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section Menu */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-green-400">Menu</h3>
            <div className="space-y-4">
              {getContentBySection('menu').map((content) => (
                <div key={content.id}>
                  <h4 className="font-medium mb-2">{content.title}</h4>
                  {content.content && (
                    <p className="text-gray-300 text-sm mb-3">{content.content}</p>
                  )}
                  {content.links && content.links.length > 0 && (
                    <ul className="space-y-1">
                      {content.links.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.url}
                            className="text-gray-300 hover:text-white text-sm transition-colors"
                            target={link.isExternal ? '_blank' : undefined}
                            rel={link.isExternal ? 'noopener noreferrer' : undefined}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              
              {/* Liens par défaut si pas de contenu personnalisé */}
              {getContentBySection('menu').length === 0 && (
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                      Accueil
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="text-gray-300 hover:text-white text-sm transition-colors">
                      Catégories
                    </Link>
                  </li>
                  <li>
                    <Link href="/farm" className="text-gray-300 hover:text-white text-sm transition-colors">
                      Nos Fermes
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Section Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-green-400">Information</h3>
            <div className="space-y-4">
              {getContentBySection('information').map((content) => (
                <div key={content.id}>
                  <h4 className="font-medium mb-2">{content.title}</h4>
                  {content.content && (
                    <p className="text-gray-300 text-sm mb-3">{content.content}</p>
                  )}
                  {content.links && content.links.length > 0 && (
                    <ul className="space-y-1">
                      {content.links.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.url}
                            className="text-gray-300 hover:text-white text-sm transition-colors"
                            target={link.isExternal ? '_blank' : undefined}
                            rel={link.isExternal ? 'noopener noreferrer' : undefined}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Contenu par défaut si pas de contenu personnalisé */}
              {getContentBySection('information').length === 0 && (
                <div className="text-gray-300 text-sm space-y-2">
                  <p>Boutique de produits frais</p>
                  <p>Directement de nos fermes partenaires</p>
                  <p>Qualité garantie</p>
                </div>
              )}
            </div>
          </div>

          {/* Section Réseaux Sociaux */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-green-400">Réseaux</h3>
            <div className="space-y-4">
              {getContentBySection('reseaux').map((content) => (
                <div key={content.id}>
                  <h4 className="font-medium mb-2">{content.title}</h4>
                  {content.content && (
                    <p className="text-gray-300 text-sm mb-3">{content.content}</p>
                  )}
                </div>
              ))}

              {/* Liens des réseaux sociaux */}
              {socialMedia.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Suivez-nous</h4>
                  <div className="flex flex-wrap gap-3">
                    {socialMedia.map((social) => {
                      const IconComponent = getIconComponent(social.platform);
                      return (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                          title={social.name}
                        >
                          <IconComponent size={20} className="group-hover:scale-110 transition-transform" />
                          <span className="text-sm">{social.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Réseaux par défaut si aucun configuré */}
              {socialMedia.length === 0 && (
                <div className="flex space-x-4">
                  <FiFacebook size={24} className="text-gray-400" />
                  <FiInstagram size={24} className="text-gray-400" />
                  <FiTwitter size={24} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Boutique. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}