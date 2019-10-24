import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LdapService } from './services/ldap/ldap.service';

@Module({
  controllers: [AuthController],
  providers: [LdapService],
})
export class AuthModule {}
