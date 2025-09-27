import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const farms = await prisma.farm.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(farms);
  } catch (error) {
    console.error('Erreur GET farms:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des fermes' },
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
      location,
      image,
    } = data;

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }

    const farm = await prisma.farm.create({
      data: {
        name,
        description,
        location,
        image,
      },
    });

    return NextResponse.json(farm);
  } catch (error) {
    console.error('Erreur POST farm:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la ferme' },
      { status: 500 }
    );
  }
}