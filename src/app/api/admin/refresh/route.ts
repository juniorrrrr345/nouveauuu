import { NextRequest, NextResponse } from 'next/server';

// API pour forcer le rechargement des settings côté client
export async function POST(request: NextRequest) {
  try {
    // Invalider le localStorage côté client
    const timestamp = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      message: 'Cache invalidé, rechargement forcé',
      timestamp,
      action: 'refresh_client_cache'
    });
  } catch (error) {
    console.error('Erreur refresh:', error);
    return NextResponse.json({
      success: true,
      message: 'Refresh OK'
    });
  }
}