import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const farm = await prisma.farm.findUnique({
      where: { id: params.id },
      include: {
        products: {
          include: {
            prices: true,
            category: true,
          },
        },
      },
    });

    if (!farm) {
      return NextResponse.json(
        { error: 'Ferme non trouvée' },
        { status: 404 }
      );
    }

    // Parse JSON for products
    const farmWithProducts = {
      ...farm,
      products: farm.products.map(product => ({
        ...product,
        images: JSON.parse(product.images || '[]'),
        videos: JSON.parse(product.videos || '[]'),
      })),
    };

    return NextResponse.json(farmWithProducts);
  } catch (error) {
    console.error('Erreur GET farm:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la ferme' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const {
      name,
      description,
      location,
      image,
      isActive = true,
    } = data;

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }

    const farm = await prisma.farm.update({
      where: { id: params.id },
      data: {
        name,
        description,
        location,
        image,
        isActive,
      },
    });

    return NextResponse.json(farm);
  } catch (error) {
    console.error('Erreur PUT farm:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la ferme' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if farm has products
    const productsCount = await prisma.product.count({
      where: { farmId: params.id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une ferme contenant des produits' },
        { status: 400 }
      );
    }

    await prisma.farm.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE farm:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la ferme' },
      { status: 500 }
    );
  }
}