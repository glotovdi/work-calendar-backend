import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { LoginRequestModel } from './models/login.request.model';
import { UserService } from './services/db/db.service';
import { LdapService } from './services/ldap/ldap.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly ldapService: LdapService,
    private userService: UserService,
  ) {}
  @Post()
  async auth(@Res() res, @Body() credentials: LoginRequestModel) {
    try {
      const result = await this.ldapService.auth(credentials);
      res.status(HttpStatus.OK).send(result);
    } catch (e) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send('USER FOUND');
    }
  }

  @Get('posts')
  async getPosts(@Res() res) {
    const posts = await this.userService.getUsers();
    console.log(posts);
    return res.status(HttpStatus.OK).json(posts);
  }

  @Post('post')
  async createUser(@Res() res) {
    const post = await this.userService.addPost();
    console.log(post);
    return res.status(HttpStatus.OK).json(post);
  }
}
