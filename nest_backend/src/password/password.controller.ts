import { Body, Controller, Post } from '@nestjs/common';
import { PasswordService } from './password.service';

@Controller('password')
export class PasswordController {

  constructor(private passwordService: PasswordService){

  }

  @Post('forgot')
  async forget(
    @Body('email') email: string
  ){
    const token = Math.random().toString(20).substr(2,12); //probably want to change how this is created

    await this.passwordService.create({
      email,
      token
    });
  }
}
