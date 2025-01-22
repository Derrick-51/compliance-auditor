import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { PasswordService } from './password.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class PasswordController {

  constructor(
    private passwordService: PasswordService, //Custom service for password
    private mailerService: MailerService, //Service for sending emails
    private userService: UserService, //Custom service for user
  ) {

  }

  //Function to send email to user to reset password
  @Post('forgot')
  async forget(
    @Body('email') email: string
  ) {
    const token = Math.random().toString(20).substr(2, 12); //Generate random token

    //Create password reset entry
    await this.passwordService.create({
      email,
      token
    });

    const url = `http://localhost:4200/reset/${token}`; //Angular local host address, should be changed for production

    //send email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      html: `Click <a href="${url}">here</a> to reset your password!`,
    });
    //Return success message
    return {
      message: 'Email sent!'
    }
  }

  //Function to reset password
  @Post('reset')
  async reset(
    @Body('token') token: string, //reset token
    @Body('password') password: string, //new password
    @Body('confirmPassword') confirmPassword: string, //confirm new password

  ) {
    // if passwords don't match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const passwordReset: any = await this.passwordService.findOne({ token }); //Find password reset entry

    const email: string = passwordReset.email //Get email from password reset entry

    const user = await this.userService.findOne(email); //Find user by email

    //If user not found
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const hashedPassword = await bcrypt.hash(password, 12); //Hash new password

    await this.userService.update(user.id, { password: hashedPassword }); //Update user password

    return { //Return success message
      message: 'success'
    }

  }

}
