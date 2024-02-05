import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    return this.appService.create({
      email,
      username,
      password: hashedPassword,
    });
  }
}
