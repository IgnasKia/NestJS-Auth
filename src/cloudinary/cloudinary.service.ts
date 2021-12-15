import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()

export class CloudinaryService {

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(publicId: string) {
    
    const destroy = v2.uploader.destroy(publicId, (error, result) => {
      if (error) return error;
      return result;
     });

     return destroy;
    
  }

  async updateImage(publicId: string, file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    
   await this.deleteImage(publicId);
   return await this.uploadImage(file);
    
  }

}