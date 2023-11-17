import { Schema } from 'mongoose';
import { Book } from '../entities/book';

const bookSchema = new Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publishYear: {
    type: Number,
  },
  publishHouse: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  mainCategory: {
    type: String,
    required: true,
  },
  secondCategories: {
    type: [String],
  },
  readers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  averageRate: {
    type: Number,
  },
});