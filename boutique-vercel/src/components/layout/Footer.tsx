'use client';

import { useEffect, useState } from 'react';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { SocialMedia, SiteConfig } from '@/types';

export default function Footer() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [socialRes, configRes] = await Promise.all([
          fetch('/api/social'),
          fetch('/api/config'),
        ]);

        if (socialRes.ok) {
          const socialData = await socialRes.json();
          setSocialMedia(socialData);
        }

        if (configRes.ok) {
          const configData = await configRes.json();
          setSiteConfig(configData);
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

  const getConfigValue = (key: string, defaultValue: string = '') => {
    const config = siteConfig.find(c => c.key === key);
    return config ? config.value : defaultValue;
  };

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-32 bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section INFO */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-green-400">INFO</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FiMapPin className="text-green-400 mt-1" size={20} />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-gray-300 text-sm">
                    {getConfigValue('address', 'Votre adresse ici')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FiPhone className="text-green-400 mt-1" size={20} />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-gray-300 text-sm">
                    {getConfigValue('phone', 'Votre numéro de téléphone')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FiMail className="text-green-400 mt-1" size={20} />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-300 text-sm">
                    {getConfigValue('email', 'contact@boutique.com')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FiClock className="text-green-400 mt-1" size={20} />
                <div>
                  <p className="font-medium">Horaires</p>
                  <p className="text-gray-300 text-sm">
                    {getConfigValue('schedule', 'Lun-Ven: 9h-18h')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section RÉSEAUX SOCIAUX */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-green-400">RÉSEAUX SOCIAUX</h3>
            <div className="space-y-4">
              {socialMedia.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {socialMedia.map((social) => {
                    const IconComponent = getIconComponent(social.platform);
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                      >
                        <IconComponent 
                          size={24} 
                          className="text-green-400 group-hover:scale-110 transition-transform" 
                        />
                        <div>
                          <p className="font-medium text-sm">{social.name}</p>
                          <p className="text-gray-400 text-xs capitalize">{social.platform}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                    <FiFacebook size={24} className="text-green-400" />
                    <div>
                      <p className="font-medium text-sm">Facebook</p>
                      <p className="text-gray-400 text-xs">Suivez-nous</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                    <FiInstagram size={24} className="text-green-400" />
                    <div>
                      <p className="font-medium text-sm">Instagram</p>
                      <p className="text-gray-400 text-xs">Photos</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} {getConfigValue('site_name', 'Boutique')}. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}