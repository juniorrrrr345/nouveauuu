import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { CloudflareUploadResponse } from '@/types';

export class CloudflareR2 {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || '';
    this.publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';
    
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadFile(file: File, folder: string = 'uploads'): Promise<CloudflareUploadResponse> {
    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type,
      });

      await this.s3Client.send(command);

      return {
        success: true,
        result: {
          id: fileName,
          filename: file.name,
          uploaded: new Date().toISOString(),
          requireSignedURLs: false,
          variants: [`${this.publicUrl}/${fileName}`],
        },
      };
    } catch (error) {
      console.error('Erreur upload R2:', error);
      return {
        success: false,
        errors: ['Erreur lors de l\'upload vers R2'],
      };
    }
  }

  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Erreur suppression R2:', error);
      return false;
    }
  }

  getFileUrl(fileName: string): string {
    return `${this.publicUrl}/${fileName}`;
  }
}

// Maintenir la compatibilité avec l'ancien code
export class CloudflareImages extends CloudflareR2 {
  async uploadImage(file: File): Promise<CloudflareUploadResponse> {
    return this.uploadFile(file, 'images');
  }

  async deleteImage(imageId: string): Promise<boolean> {
    return this.deleteFile(imageId);
  }

  getImageUrl(imageId: string, variant: string = 'public'): string {
    return this.getFileUrl(imageId);
  }
}

export class CloudflareVideos extends CloudflareR2 {
  async uploadVideo(file: File): Promise<CloudflareUploadResponse> {
    return this.uploadFile(file, 'videos');
  }

  async deleteVideo(videoId: string): Promise<boolean> {
    return this.deleteFile(videoId);
  }

  getVideoUrl(videoId: string): string {
    return this.getFileUrl(videoId);
  }

  getThumbnailUrl(videoId: string): string {
    // Pour les vidéos, on retourne la même URL (R2 ne génère pas automatiquement de thumbnails)
    return this.getFileUrl(videoId);
  }
}