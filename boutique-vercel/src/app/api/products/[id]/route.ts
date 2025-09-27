import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        farm: true,
        prices: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...product,
      images: JSON.parse(product.images || '[]'),
      videos: JSON.parse(product.videos || '[]'),
    });
  } catch (error) {
    console.error('Erreur GET product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
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
      images = [],
      videos = [],
      categoryId,
      farmId,
      stock = 0,
      prices = [],
      isActive = true,
    } = data;

    // Delete existing prices
    await prisma.productPrice.deleteMany({
      where: { productId: params.id },
    });

    // Update product with new prices
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        images: JSON.stringify(images),
        videos: JSON.stringify(videos),
        categoryId,
        farmId: farmId || null,
        stock,
        isActive,
        prices: {
          create: prices.map((price: any, index: number) => ({
            label: price.label,
            price: parseFloat(price.price),
            originalPrice: price.originalPrice ? parseFloat(price.originalPrice) : null,
            isDefault: index === 0 || price.isDefault === true,
          })),
        },
      },
      include: {
        category: true,
        farm: true,
        prices: true,
      },
    });

    return NextResponse.json({
      ...product,
      images: JSON.parse(product.images),
      videos: JSON.parse(product.videos),
    });
  } catch (error) {
    console.error('Erreur PUT product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    );
  }
}