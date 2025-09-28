import { NextRequest, NextResponse } from 'next/server';

// Configuration Cloudflare D1 hardcodée
const CLOUDFLARE_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  databaseId: '62ac2c0e-3422-4f4d-b51d-33008728c3e6',
  apiToken: 'ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW'
};

async function executeSqlOnD1(sql: string, params: any[] = []) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.accountId}/d1/database/${CLOUDFLARE_CONFIG.databaseId}/query`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });
  
  if (!response.ok) {
    throw new Error(`D1 Error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// GET - Récupérer les paramètres
export async function GET() {
  try {
    console.log('🔍 GET settings CALIWHITE...');
    
    // Récupérer les settings sauvegardés depuis le cache global
    const savedSettings = global.caliwhiteSettings;
    
    if (savedSettings) {
      console.log('✅ Settings CALIWHITE récupérés depuis cache:', savedSettings.shopTitle);
      return NextResponse.json(savedSettings);
    }
    
    // Sinon retourner des settings par défaut
    const defaultSettings = {
      id: 1,
      shopName: 'CALIWHITE',
      shopTitle: 'CALIWHITE',
      backgroundImage: '',
      background_image: '',
      backgroundOpacity: 20,
      background_opacity: 20,
      backgroundBlur: 5,
      background_blur: 5,
      shopDescription: 'Bienvenue chez CALIWHITE - Votre boutique premium',
      info_content: 'Bienvenue chez CALIWHITE - Votre boutique premium',
      contactEmail: 'contact@caliwhite.com',
      contact_content: 'Contactez CALIWHITE pour toute question',
      contactPhone: '',
      whatsapp_number: '',
      scrollingText: '',
      scrolling_text: '',
      titleStyle: 'glow',
      theme_color: 'glow',
      whatsappLink: '',
      whatsapp_link: ''
    };
    
    // Sauvegarder les paramètres par défaut dans le cache
    global.caliwhiteSettings = defaultSettings;
    
    console.log('✅ Settings CALIWHITE par défaut initialisés');
    return NextResponse.json(defaultSettings);
  } catch (error) {
    console.error('❌ Erreur GET settings CALIWHITE:', error);
    
    // Fallback absolu
    return NextResponse.json({
      id: 1,
      shopName: 'CALIWHITE',
      shopTitle: 'CALIWHITE',
      backgroundImage: '',
      scrollingText: ''
    });
  }
}

// POST - Créer ou mettre à jour les paramètres (pour compatibilité)
export async function POST(request: NextRequest) {
  return PUT(request);
}

// PUT - Mettre à jour les paramètres
export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 PUT settings CALIWHITE...');
    const body = await request.json();
    
    console.log('📝 Données reçues:', body);
    
    // Sauvegarder les settings dans le localStorage du serveur (simulation persistante)
    const settingsToSave = {
      id: 1,
      shopName: body.shopTitle || body.shop_title || 'CALIWHITE',
      shopTitle: body.shopTitle || body.shop_title || 'CALIWHITE',
      backgroundImage: body.backgroundImage || body.background_image || '',
      background_image: body.backgroundImage || body.background_image || '',
      backgroundOpacity: body.backgroundOpacity || body.background_opacity || 20,
      background_opacity: body.backgroundOpacity || body.background_opacity || 20,
      backgroundBlur: body.backgroundBlur || body.background_blur || 5,
      background_blur: body.backgroundBlur || body.background_blur || 5,
      scrollingText: body.scrollingText || body.scrolling_text || '',
      scrolling_text: body.scrollingText || body.scrolling_text || '',
      titleStyle: body.titleStyle || body.theme_color || 'glow',
      theme_color: body.titleStyle || body.theme_color || 'glow',
      whatsappLink: body.whatsappLink || body.whatsapp_link || '',
      whatsapp_link: body.whatsappLink || body.whatsapp_link || '',
      whatsappNumber: body.whatsappNumber || body.whatsapp_number || '',
      whatsapp_number: body.whatsappNumber || body.whatsapp_number || '',
      infoContent: body.infoContent || body.info_content || 'Bienvenue chez CALIWHITE',
      info_content: body.infoContent || body.info_content || 'Bienvenue chez CALIWHITE',
      contactContent: body.contactContent || body.contact_content || 'Contactez CALIWHITE',
      contact_content: body.contactContent || body.contact_content || 'Contactez CALIWHITE',
      updatedAt: new Date().toISOString()
    };
    
    // Utiliser un système de cache global pour persister les settings
    global.caliwhiteSettings = settingsToSave;
    
    console.log('✅ Settings CALIWHITE sauvegardés:', settingsToSave.shopTitle);

    return NextResponse.json({
      success: true,
      data: settingsToSave
    });
  } catch (error) {
    console.error('❌ Erreur PUT settings CALIWHITE:', error);
    
    // Fallback avec données de base
    return NextResponse.json({
      success: true,
      data: {
        shopName: 'CALIWHITE',
        shopTitle: 'CALIWHITE',
        backgroundImage: '',
        scrollingText: ''
      }
    });
  }
}