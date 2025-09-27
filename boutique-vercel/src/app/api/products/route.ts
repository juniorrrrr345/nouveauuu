import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        farm: true,
        prices: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse JSON strings for images and videos
    const productsWithParsedData = products.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      videos: JSON.parse(product.videos || '[]'),
    }));

    return NextResponse.json(productsWithParsedData);
  } catch (error) {
    console.error('Erreur GET products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    } = data;

    // Validate required fields
    if (!name || !categoryId || prices.length === 0) {
      return NextResponse.json(
        { error: 'Nom, catégorie et au moins un prix sont requis' },
        { status: 400 }
      );
    }

    // Create product with prices
    const product = await prisma.product.create({
      data: {
        name,
        description,
        images: JSON.stringify(images),
        videos: JSON.stringify(videos),
        categoryId,
        farmId: farmId || null,
        stock,
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
    console.error('Erreur POST product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}