import { Comment } from '../entities/comment.js';
import { HttpError } from '../types/error.js';
import { CommentModel } from './comments.model.js';
import { Repository } from './repository.js';

export class CommentsRepository implements Repository<Comment> {
  async getAll(): Promise<Comment[]> {
    const data = await CommentModel.find().populate('user', { user: 1 }).exec();
    return data;
  }

  async getById(id: string): Promise<Comment> {
    const data = await CommentModel.findById(id)
      .populate('user', { user: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not found', 'Error searching the comment.');
    return data;
  }

  async create(newComment: Omit<Comment, 'id'>): Promise<Comment> {
    const data = await CommentModel.create(newComment);
    return data;
  }

  async update(id: string, newData: Partial<Comment>): Promise<Comment> {
    const data = await CommentModel.findByIdAndUpdate(id, newData, {
      new: true,
    })
      .populate('user', { user: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not found', 'Error updating the comment.', {
        cause: 'Trying update',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const data = await CommentModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HttpError(404, 'Not found', 'Error updating the comment.', {
        cause: 'Trying delete',
      });
  }
}
