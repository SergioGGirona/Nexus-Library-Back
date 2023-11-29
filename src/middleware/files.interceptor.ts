import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export class FilesInterceptor {
  singleFileStore(file: string) {
    const storage = multer.diskStorage({
      destination: './NexusLibrary',
      filename(req, file, callback) {
        callback(null, file.originalname);
      },
    });
    const upload = multer({ storage });
    const middleware = upload.single(file);
    return (req: Request, res: Response, next: NextFunction) => {
      const previousFile = req.body;
      middleware(req, res, next);
      req.body = { ...previousFile, ...req.body };
    };
  }
}
