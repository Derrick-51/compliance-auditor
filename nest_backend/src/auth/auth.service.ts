import {
  BadRequestException,
  Inject,
  Injectable,
  Res,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Users } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, email, ...rest } = user;
      return rest;
    }

    return null;
  }

  async login(user: any, @Res({ passthrough: true }) response: Response) {
    const payload = { email: user.email, sub: user.userId };
    response.cookie('jwt', payload, { httpOnly: true });
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async create(data: any): Promise<Users> {
    return this.userRepository.save(data);
  }

  async profile(@Req() request: Request) {
    // there are two different requests imports, use Request is from express, while there is also Req from Nest.js, do not import Request from Nest.js or there will be duplicate imports
    try {
      const cookie = request.cookies['jwt'];

      if (!cookie) {
        throw new Error('JWT cookie not found');
      }

      const data = await this.jwtService.verifyAsync(cookie);

      return data;
    } catch (e) {
      console.error('JWT verification error:', e.message);
      throw new Error('Invalid JWT token');
    }
  }
}
