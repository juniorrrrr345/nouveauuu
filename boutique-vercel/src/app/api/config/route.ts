import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      // Get specific config
      const config = await prisma.siteConfig.findUnique({
        where: { key },
      });

      if (!config) {
        return NextResponse.json(
          { error: 'Configuration non trouvée' },
          { status: 404 }
        );
      }

      let value = config.value;
      if (config.type === 'json') {
        try {
          value = JSON.parse(config.value);
        } catch (e) {
          // Keep as string if not valid JSON
        }
      }

      return NextResponse.json({ ...config, value });
    } else {
      // Get all configs
      const configs = await prisma.siteConfig.findMany({
        orderBy: {
          key: 'asc',
        },
      });

      const configsWithParsedValues = configs.map(config => {
        let value = config.value;
        if (config.type === 'json') {
          try {
            value = JSON.parse(config.value);
          } catch (e) {
            // Keep as string if not valid JSON
          }
        }
        return { ...config, value };
      });

      return NextResponse.json(configsWithParsedValues);
    }
  } catch (error) {
    console.error('Erreur GET config:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const {
      key,
      value,
      type = 'text',
    } = data;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Clé et valeur sont requis' },
        { status: 400 }
      );
    }

    const stringValue = type === 'json' ? JSON.stringify(value) : String(value);

    const config = await prisma.siteConfig.upsert({
      where: { key },
      update: {
        value: stringValue,
        type,
      },
      create: {
        key,
        value: stringValue,
        type,
      },
    });

    let returnValue = config.value;
    if (config.type === 'json') {
      try {
        returnValue = JSON.parse(config.value);
      } catch (e) {
        // Keep as string if not valid JSON
      }
    }

    return NextResponse.json({ ...config, value: returnValue });
  } catch (error) {
    console.error('Erreur POST config:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde de la configuration' },
      { status: 500 }
    );
  }
}