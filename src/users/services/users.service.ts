import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginResponseModel } from 'src/auth/models/login.response.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<LoginResponseModel>,
  ) {}

  async getUsers(): Promise<LoginResponseModel[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  async getUserByLogin(mailNickname: string): Promise<LoginResponseModel[]> {
    const post = await this.userModel
      .find({ mailNickname: mailNickname })
      .exec();
    return post;
  }

  async addUser(userInfo: LoginResponseModel): Promise<LoginResponseModel> {
    const newPost = await this.userModel(userInfo);
    return newPost.save();
  }
}
