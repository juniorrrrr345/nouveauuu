import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const {
      section,
      title,
      content,
      links = [],
      order = 0,
      isActive = true,
    } = data;

    if (!section || !title) {
      return NextResponse.json(
        { error: 'Section et titre sont requis' },
        { status: 400 }
      );
    }

    const footerContent = await prisma.footerContent.update({
      where: { id: params.id },
      data: {
        section,
        title,
        content: content || '',
        links: JSON.stringify(links),
        order,
        isActive,
      },
    });

    return NextResponse.json({
      ...footerContent,
      links: JSON.parse(footerContent.links || '[]'),
    });
  } catch (error) {
    console.error('Erreur PUT footer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du contenu footer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.footerContent.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE footer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contenu footer' },
      { status: 500 }
    );
  }
}