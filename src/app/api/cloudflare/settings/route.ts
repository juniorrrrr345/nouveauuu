import { NextRequest, NextResponse } from 'next/server';

// Configuration Cloudflare D1 hardcodée
const CLOUDFLARE_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  databaseId: '2cacfef4-aa3b-4150-96b8-7bfaad45717a',
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
    console.log('🔍 GET settings MEXICAIN...');
    
    const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
    
    if (result.result?.[0]?.results?.length) {
      const settings = result.result[0].results[0];
      console.log('✅ Settings MEXICAIN récupérés:', settings);
      
      // Mapper les champs D1 vers le format attendu par le frontend
      const mappedSettings = {
        ...settings,
        backgroundImage: settings.backgroundImage,
        backgroundOpacity: settings.backgroundOpacity || 20,
        backgroundBlur: settings.backgroundBlur || 5,
        shopTitle: settings.shopName || 'MEXICAIN',
        shopName: settings.shopName || 'MEXICAIN',
        infoContent: settings.shopDescription,
        contactContent: settings.contactEmail,
        whatsappLink: settings.whatsappLink || '',
        whatsappNumber: settings.contactPhone || '',
        scrollingText: settings.scrollingText || '',
        titleStyle: settings.titleStyle || 'glow'
      };
      
      return NextResponse.json(mappedSettings);
    } else {
      // Retourner des paramètres par défaut MEXICAIN
      const defaultSettings = {
        id: 1,
        shopName: 'MEXICAIN',
        backgroundImage: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/background-oglegacy.jpeg',
        backgroundOpacity: 20,
        backgroundBlur: 5,
        shopDescription: 'Bienvenue chez MEXICAIN - Votre boutique premium',
        contactEmail: 'Contactez MEXICAIN pour toute question',
        contactPhone: '',
        shopTitle: 'MEXICAIN'
      };
      
      return NextResponse.json(defaultSettings);
    }
  } catch (error) {
    console.error('❌ Erreur GET settings MEXICAIN:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour les paramètres (pour compatibilité)
export async function POST(request: NextRequest) {
  return PUT(request);
}

// PUT - Mettre à jour les paramètres
export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 PUT settings MEXICAIN...');
    const body = await request.json();
    
    const {
      background_image,
      backgroundImage,
      background_opacity,
      backgroundOpacity,
      background_blur,
      backgroundBlur,
      info_content,
      infoContent,
      contact_content,
      contactContent,
      shop_title,
      shopTitle,
      whatsapp_link,
      whatsappLink,
      whatsapp_number,
      whatsappNumber,
      scrolling_text,
      scrollingText,
      theme_color,
      titleStyle
    } = body;

    // Utiliser les champs avec priorité aux versions snake_case
    const finalBackgroundImage = background_image || backgroundImage;
    const finalBackgroundOpacity = background_opacity ?? backgroundOpacity ?? 20;
    const finalBackgroundBlur = background_blur ?? backgroundBlur ?? 5;
    const finalInfoContent = info_content || infoContent || 'Bienvenue chez MEXICAIN';
    const finalContactContent = contact_content || contactContent || 'Contactez MEXICAIN';
    const finalShopTitle = shop_title || shopTitle || 'MEXICAIN';
    const finalWhatsappLink = whatsapp_link || whatsappLink || '';
    const finalWhatsappNumber = whatsapp_number || whatsappNumber || '';
    const finalScrollingText = scrolling_text || scrollingText || '';
    const finalThemeColor = theme_color || titleStyle || 'glow';

    // Vérifier si un enregistrement existe
    const checkResult = await executeSqlOnD1('SELECT id FROM settings WHERE id = 1');
    
    if (checkResult.result?.[0]?.results?.length) {
      // UPDATE
      await executeSqlOnD1(`
        UPDATE settings SET 
          backgroundImage = ?, 
          backgroundOpacity = ?, 
          backgroundBlur = ?,
          shopName = ?,
          shopDescription = ?,
          contactEmail = ?,
          contactPhone = ?,
          scrollingText = ?,
          titleStyle = ?,
          whatsappLink = ?
        WHERE id = 1
      `, [
        finalBackgroundImage,
        finalBackgroundOpacity,
        finalBackgroundBlur,
        finalShopTitle,
        finalInfoContent,
        finalContactContent,
        finalWhatsappNumber,
        finalScrollingText,
        finalThemeColor,
        finalWhatsappLink
      ]);
    } else {
      // INSERT
      await executeSqlOnD1(`
        INSERT INTO settings (
          id, backgroundImage, backgroundOpacity, backgroundBlur, 
          shopName, shopDescription, contactEmail, contactPhone,
          scrollingText, titleStyle, whatsappLink
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        1,
        finalBackgroundImage,
        finalBackgroundOpacity,
        finalBackgroundBlur,
        finalShopTitle,
        finalInfoContent,
        finalContactContent,
        finalWhatsappNumber,
        finalScrollingText,
        finalThemeColor,
        finalWhatsappLink
      ]);
    }

    // Récupérer les paramètres mis à jour
    const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
    const settings = result.result[0].results[0];
    
    console.log('✅ Settings MEXICAIN mis à jour:', settings);

    const mappedSettings = {
      ...settings,
      backgroundImage: settings.backgroundImage,
      backgroundOpacity: settings.backgroundOpacity,
      backgroundBlur: settings.backgroundBlur,
      shopTitle: settings.shopName || 'MEXICAIN',
      shopName: settings.shopName || 'MEXICAIN',
      scrollingText: settings.scrollingText || '',
      titleStyle: settings.titleStyle || 'glow',
      whatsappLink: settings.whatsappLink || ''
    };

    return NextResponse.json(mappedSettings);
  } catch (error) {
    console.error('❌ Erreur PUT settings MEXICAIN:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
}