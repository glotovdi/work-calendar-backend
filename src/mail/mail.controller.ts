import { Body, Controller, Post, Res } from '@nestjs/common';
import { SendMailRequestModel } from './models/send-mail.request.model';
const nodemailer = require('nodemailer');
@Controller('mail')
export class MailController {
  @Post()
  async sendMail(@Res() res, @Body() body: SendMailRequestModel) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    const transporter = nodemailer.createTransport({
      host: 'exchange.it2g.ru',
      port: 25,
      secure: false,
    });

    const message = ` Пользователь ${body.author} изменил присутсвие на ${body.date} для ${body.user} на ${body.status}`;
    let info = await transporter.sendMail({
      from: 'Робот Яков<robotovya@it2g.ru>', // sender address
      to: body.targetUsers, // list of receivers
      subject: 'Изменение присутствия', // Subject line
      text: message, // plain text body
    });

    res.status(202).send(info.messageId);
  }
}
