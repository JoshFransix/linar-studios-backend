/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import type { Express } from 'express';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'blog_uploads' },
          (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
            if (error) return reject(error);
            if (!result)
              return reject(new Error('Cloudinary returned no result'));
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
