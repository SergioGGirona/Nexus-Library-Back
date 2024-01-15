import { Schema, model } from 'mongoose';
import { User } from '../entities/user.js';

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userSurnames: {
    type: String,
  },
  isAdult: { type: Boolean },
  avatar: {
    type: {
      publicId: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
      url: { type: String },
    },
  },
  booksReaded: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  booksToRead: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});
export const UserModel = model('User', userSchema, 'users');
