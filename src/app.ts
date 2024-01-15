import cors from 'cors';
import createDebug from 'debug';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { errorMiddleware } from './middleware/error.middleware.js';
import { bookRouter } from './router/book.router.js';
import { userRouter } from './router/user.router.js';
import { HttpError } from './types/error.js';

const debug = createDebug('Nexus: App');

export const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

debug('Started');

app.use('/users', userRouter);
app.use('/books', bookRouter);

app.use('/:id', (_req: Request, _res: Response, next: NextFunction) => {
  const error = new HttpError(404, 'Not found', 'Invalid route');
  next(error);
});

app.use(errorMiddleware);
