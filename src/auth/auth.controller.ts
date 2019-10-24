import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { LoginRequestModel } from './models/login.request.model';
import { LdapService } from './services/ldap/ldap.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly ldapService: LdapService) {}
  @Post()
  async auth(@Res() res, @Body() credentials: LoginRequestModel) {
    try {
      const result = await this.ldapService.auth(credentials);
      res.status(HttpStatus.OK).send(result);
    } catch (e) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send('USER FOUND');
    }
  }
}
