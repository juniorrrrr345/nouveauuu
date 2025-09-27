import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const socialMedia = await prisma.socialMedia.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Erreur GET social media:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réseaux sociaux' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const {
      platform,
      name,
      url,
      icon,
      order = 0,
    } = data;

    if (!platform || !name || !url) {
      return NextResponse.json(
        { error: 'Plateforme, nom et URL sont requis' },
        { status: 400 }
      );
    }

    const socialMedia = await prisma.socialMedia.create({
      data: {
        platform,
        name,
        url,
        icon,
        order,
      },
    });

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Erreur POST social media:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du réseau social' },
      { status: 500 }
    );
  }
}