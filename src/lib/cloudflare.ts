import { CloudflareUploadResponse } from '@/types';

export class CloudflareImages {
  private accountId: string;
  private apiToken: string;
  private baseUrl: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN || '';
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/images/v1`;
  }

  async uploadImage(file: File): Promise<CloudflareUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur upload Cloudflare:', error);
      return {
        success: false,
        errors: ['Erreur lors de l\'upload'],
      };
    }
  }

  async deleteImage(imageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Erreur suppression Cloudflare:', error);
      return false;
    }
  }

  getImageUrl(imageId: string, variant: string = 'public'): string {
    return `https://imagedelivery.net/${this.accountId}/${imageId}/${variant}`;
  }
}

export class CloudflareVideos {
  private accountId: string;
  private apiToken: string;
  private baseUrl: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN || '';
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream`;
  }

  async uploadVideo(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur upload vidéo Cloudflare:', error);
      return {
        success: false,
        errors: ['Erreur lors de l\'upload de la vidéo'],
      };
    }
  }

  async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Erreur suppression vidéo Cloudflare:', error);
      return false;
    }
  }

  getVideoUrl(videoId: string): string {
    return `https://customer-${this.accountId}.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
  }

  getThumbnailUrl(videoId: string): string {
    return `https://customer-${this.accountId}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;
  }
}