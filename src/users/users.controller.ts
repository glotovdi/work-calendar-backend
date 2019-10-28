import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { UsersService } from './services/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers(@Res() res) {
    const posts = await this.userService.getUsers();
    return res.status(HttpStatus.OK).json(posts);
  }

  @Get('/:login')
  async getUserByLogin(@Res() res, @Param('login') login) {
    const user = await this.userService.getUserByLogin(login);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(user);
  }
}
