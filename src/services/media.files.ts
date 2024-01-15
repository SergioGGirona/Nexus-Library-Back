import cloudinaryBase from 'cloudinary';
import { HttpError } from '../types/error.js';
import { CloudinaryError, ImageData } from '../types/imageData.js';

export class CloudinaryService {
  private cloudinary: typeof cloudinaryBase.v2;
  constructor() {
    this.cloudinary = cloudinaryBase.v2;
    this.cloudinary.config({ secure: true });
  }

  async uploadPhoto(imagePath: string) {
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };
    try {
      const upload = await this.cloudinary.uploader.upload(imagePath, options);
      const photoData: ImageData = {
        publicId: upload.public_id,
        width: upload.width,
        height: upload.height,
        format: upload.format,
        url: upload.url,
      };
      return photoData;
    } catch (error) {
      const httpError = new HttpError(
        406,
        'Not Acceptable',
        (error as CloudinaryError).error.message
      );
      throw httpError;
    }
  }
}
