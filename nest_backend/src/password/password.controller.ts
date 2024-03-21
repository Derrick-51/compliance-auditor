import { Body, Controller, Post } from '@nestjs/common';
import { PasswordService } from './password.service';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('password')
export class PasswordController {

  constructor(
    private passwordService: PasswordService,
    private mailerService: MailerService,
  ) {

  }
  
  @Post('forgot')
  async forget(
    @Body('email') email: string
  ) {
    const token = Math.random().toString(20).substr(2, 12); //probably want to change how this is created

    await this.passwordService.create({
      email,
      token
    });

    const url = `http://localhost:4200/reset/${token}`; //Angular local host address, should be changed for production

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      html: `Click <a href="${url}">here</a> to reset your password!`,
    });

    return {
      message: 'Email sent!'
    }
  }

}
