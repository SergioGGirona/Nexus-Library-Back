import createDebug from 'debug';

import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const debug = createDebug('Nexus: Files Interceptor');

export class FilesInterceptor {
  singleFileStore(file: string) {
    debug('Called multer');

    const storage = multer.diskStorage({
      destination: './Nexus',
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
