import { Schema, model } from 'mongoose';
import { Comment } from '../entities/comment.js';

const commentSchema = new Schema<Comment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
});

commentSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
export const CommentModel = model('Comment', commentSchema, 'comments');
