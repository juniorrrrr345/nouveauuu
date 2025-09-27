import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        products: {
          include: {
            prices: true,
            farm: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Parse JSON for products
    const categoryWithProducts = {
      ...category,
      products: category.products.map(product => ({
        ...product,
        images: JSON.parse(product.images || '[]'),
        videos: JSON.parse(product.videos || '[]'),
      })),
    };

    return NextResponse.json(categoryWithProducts);
  } catch (error) {
    console.error('Erreur GET category:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la catégorie' },
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
      image,
      order = 0,
      isActive = true,
    } = data;

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        description,
        image,
        order,
        isActive,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Erreur PUT category:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la catégorie' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: params.id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une catégorie contenant des produits' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE category:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    );
  }
}