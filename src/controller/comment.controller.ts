import { NextFunction, Request, Response } from 'express';
import { Comment } from '../entities/comment.js';
import { BooksRepository } from '../repository/books.repository.js';
import { CommentsRepository } from '../repository/comments.repository.js';
import { HttpError } from '../types/error.js';
import { Controller } from './controller.js';

export class CommentController extends Controller<Comment> {
  constructor(protected repository: CommentsRepository) {
    super(repository);
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body)
        throw new HttpError(400, 'Bad Request', 'No content provided');
      const bookRepo = new BooksRepository();

      const book = await bookRepo.getById(req.body.book.id);

      const newComment = await this.repository.create(req.body);

      book.comments.push(newComment);
      bookRepo.update(book.id, book);

      const finalComment = await this.repository.getById(newComment.id);
      res.status(201);
      res.json(finalComment);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await this.repository.getById(req.params.id);
      const bookRepo = new BooksRepository();
      const book = await bookRepo.getById(comment.book.id);

      const newBookComments = book.comments.filter(
        (comment) => String(comment) !== req.params.id
      );

      book.comments = newBookComments;

      await this.repository.delete(req.params.id);
    } catch (error) {
      next(error);
    }
  }
}
