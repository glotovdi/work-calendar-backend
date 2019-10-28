import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { UserSchema } from './schemas/user.schemas';
import { UserService } from './services/db/db.service';
import { LdapService } from './services/ldap/ldap.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }])],
  controllers: [AuthController],
  providers: [LdapService, UserService],
})
export class AuthModule {}
