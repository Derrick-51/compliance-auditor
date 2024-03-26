import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { PasswordService } from './password.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class PasswordController {

  constructor(
    private passwordService: PasswordService,
    private mailerService: MailerService,
    private userService: UserService,
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

  @Post('reset')
  async reset(
    @Body('token') token: string,
    @Body('password') password: string,
    @Body('confirmPassword') confirmPassword: string,

  ) {
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const passwordReset: any = await this.passwordService.findOne({ token });

    const email: string = passwordReset.email

    const user = await this.userService.findOne(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    await this.userService.update(user.id, { password: hashedPassword });

    return {
      message: 'success'
    }

  }

}
