import { NextRequest, NextResponse } from 'next/server';
import { CloudflareImages, CloudflareVideos } from '@/lib/cloudflare';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'video'

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    if (type === 'image') {
      const cloudflare = new CloudflareImages();
      const result = await cloudflare.uploadImage(file);

      if (result.success && result.result) {
        return NextResponse.json({
          success: true,
          url: cloudflare.getImageUrl(result.result.id),
          id: result.result.id,
          type: 'image',
        });
      } else {
        return NextResponse.json(
          { error: result.errors?.[0] || 'Erreur lors de l\'upload' },
          { status: 500 }
        );
      }
    } else if (type === 'video') {
      const cloudflare = new CloudflareVideos();
      const result = await cloudflare.uploadVideo(file);

      if (result.success && result.result) {
        return NextResponse.json({
          success: true,
          url: cloudflare.getVideoUrl(result.result.uid),
          thumbnail: cloudflare.getThumbnailUrl(result.result.uid),
          id: result.result.uid,
          type: 'video',
        });
      } else {
        return NextResponse.json(
          { error: result.errors?.[0] || 'Erreur lors de l\'upload de la vidéo' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Type de fichier non supporté' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json(
        { error: 'ID et type sont requis' },
        { status: 400 }
      );
    }

    let success = false;

    if (type === 'image') {
      const cloudflare = new CloudflareImages();
      success = await cloudflare.deleteImage(id);
    } else if (type === 'video') {
      const cloudflare = new CloudflareVideos();
      success = await cloudflare.deleteVideo(id);
    }

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur DELETE upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}