import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from '../repository/users.repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/error.js';

export class AuthInterceptor {
  authorization(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.get('Authorization')?.split(' ')[1];
      if (!token) {
        throw new HttpError(498, 'Invalid Token', 'Not token provided');
      }
      req.body.validatedId = Auth.verifyToken(token).id;
      next();
    } catch (error) {
      next(error);
    }
  }

  async usersAuthentication(req: Request, res: Response, next: NextFunction) {
    const userId = req.body.validatedId;
    try {
      const usersRepository = new UsersRepository();
      const user = await usersRepository.getById(userId);
      if (!user) {
        const error = new HttpError(403, 'Forbidden', 'Not owner');
        next(error);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
