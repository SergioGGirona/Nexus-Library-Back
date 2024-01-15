import { Router } from 'express';
import { BookController } from '../controller/book.controller.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { BooksRepository } from '../repository/books.repository.js';

const repository = new BooksRepository();
const bookController = new BookController(repository);
const filesInterceptor = new FilesInterceptor();
const authInterceptor = new AuthInterceptor();
export const bookRouter = Router();

bookRouter.get('./', bookController.getAll.bind(bookController));
bookRouter.get('./:id', bookController.getById.bind(bookController));

bookRouter.post(
  '/create',
  filesInterceptor.singleFileStore('image').bind(bookController),
  bookController.create.bind(bookController),
  (req, res, _next) => {
    res.json(req.body);
  }
);

bookRouter.patch('/login', bookController.update.bind(bookController));
bookRouter.delete(
  '/:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.usersAuthentication.bind(authInterceptor),
  bookController.delete.bind(bookController)
);
