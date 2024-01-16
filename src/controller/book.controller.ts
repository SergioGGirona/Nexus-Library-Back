import { NextFunction, Request, Response } from 'express';
import { Book } from '../entities/book';
import { BooksRepository } from '../repository/books.repository.js';
import { UsersRepository } from '../repository/users.repository.js';
import { CloudinaryService } from '../services/media.files.js';
import { HttpError } from '../types/error.js';
import { Controller } from './controller.js';

export class BookController extends Controller<Book> {
  cloudinary: CloudinaryService;
  constructor(protected repository: BooksRepository) {
    super(repository);
    this.cloudinary = new CloudinaryService();
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file)
        throw new HttpError(417, 'Expectation failed', 'Not received a photo');
      const finalPath = req.file.destination + '/' + req.file!.filename;
      const image = await this.cloudinary.uploadPhoto(finalPath);
      req.body.image = image;
      const finalItem = await this.repository.create(req.body);
      res.status(201);
      res.json(finalItem);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { validatedId } = req.body;
      const userRepo = new UsersRepository();

      const user = await userRepo.getById(validatedId);
      const userNewBooksReaded = user.booksReaded.filter(
        (book) => book.id !== id
      );
      const userNewBooksToRead = user.booksToRead.filter(
        (book) => book.id !== id
      );

      user.booksReaded = userNewBooksReaded;
      user.booksToRead = userNewBooksToRead;

      userRepo.update(user.id, user);
      await this.repository.delete(id);

      res.json({});
      res.status(204);
    } catch (error) {
      next(error);
    }
  }
}
