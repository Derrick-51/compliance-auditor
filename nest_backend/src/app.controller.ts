import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {
    ({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  //registration route
  @Post('auth/register')
  async register(
    @Body('dealership') dealershipName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12); //encrypted password will be stored in the database, remember to compare the decrypted password with user input when logging in

    return this.authService.create({
      dealershipName,
      email,
      password: hashedPassword, //encrypted password is stored
    });
  }

  //login route
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response); //showing result of validation using passport.js, this is just for testing and should be removed later (don't show JWT access token in the console)
  }

  @UseGuards(LocalAuthGuard)
  @Get('auth/profile')
  profile(@Req() request: Request) {
    return this.authService.profile(request);
  }

  // getProfile(@Request() req) {
  //   return this.authService.profile(req.user);
  // }
}
