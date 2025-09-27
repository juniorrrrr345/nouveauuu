import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section) {
      // Get specific section
      const contents = await prisma.footerContent.findMany({
        where: { 
          section,
          isActive: true,
        },
        orderBy: {
          order: 'asc',
        },
      });

      const contentsWithParsedLinks = contents.map(content => ({
        ...content,
        links: content.links ? JSON.parse(content.links) : [],
      }));

      return NextResponse.json(contentsWithParsedLinks);
    } else {
      // Get all sections
      const contents = await prisma.footerContent.findMany({
        where: {
          isActive: true,
        },
        orderBy: [
          { section: 'asc' },
          { order: 'asc' },
        ],
      });

      const contentsWithParsedLinks = contents.map(content => ({
        ...content,
        links: content.links ? JSON.parse(content.links) : [],
      }));

      return NextResponse.json(contentsWithParsedLinks);
    }
  } catch (error) {
    console.error('Erreur GET footer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du contenu footer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const {
      section,
      title,
      content,
      links = [],
      order = 0,
    } = data;

    if (!section || !title) {
      return NextResponse.json(
        { error: 'Section et titre sont requis' },
        { status: 400 }
      );
    }

    const footerContent = await prisma.footerContent.create({
      data: {
        section,
        title,
        content: content || '',
        links: JSON.stringify(links),
        order,
      },
    });

    return NextResponse.json({
      ...footerContent,
      links: JSON.parse(footerContent.links || '[]'),
    });
  } catch (error) {
    console.error('Erreur POST footer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du contenu footer' },
      { status: 500 }
    );
  }
}