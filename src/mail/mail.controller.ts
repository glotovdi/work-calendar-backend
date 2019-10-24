import { Body, Controller, Post, Res } from '@nestjs/common';

@Controller('mail')
export class MailController {
  @Post()
  async sendMail(@Res() res, @Body() foo: any) {}
}
