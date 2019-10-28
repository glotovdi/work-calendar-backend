import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { UsersService } from './services/users.service';

@Controller('Users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers(@Res() res) {
    const posts = await this.userService.getUsers();
    return res.status(HttpStatus.OK).json(posts);
  }

  @Get('/:login')
  async getUserByLogin(@Res() res, @Param('login') login) {
    const post = await this.userService.getUserByLogin(login);
    if (!post) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(post);
  }
}
