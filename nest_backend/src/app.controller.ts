import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {
    ({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  //login route
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
