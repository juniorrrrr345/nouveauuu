import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const {
      platform,
      name,
      url,
      icon,
      order = 0,
      isActive = true,
    } = data;

    if (!platform || !name || !url) {
      return NextResponse.json(
        { error: 'Plateforme, nom et URL sont requis' },
        { status: 400 }
      );
    }

    const socialMedia = await prisma.socialMedia.update({
      where: { id: params.id },
      data: {
        platform,
        name,
        url,
        icon,
        order,
        isActive,
      },
    });

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Erreur PUT social media:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du réseau social' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.socialMedia.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE social media:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du réseau social' },
      { status: 500 }
    );
  }
}