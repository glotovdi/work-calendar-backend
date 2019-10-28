import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('Users') private readonly userModel: Model<any>) {}

  async getUsers(): Promise<any[]> {
    const posts = await this.userModel.find().exec();
    return posts;
  }

  async addPost(): Promise<any> {
    const data = { title: 'user' };

    const newPost = await this.userModel(data);
    return newPost.save();
  }
}
