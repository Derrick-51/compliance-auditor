import {
  BadRequestException,
  Inject,
  Injectable,
  Res,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { QueryFailedError, Repository } from 'typeorm';
import { Users } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { access } from 'fs';
import { error } from 'console';

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
    const payload = { id: user.id, email: user.email, sub: user.userId };

    const accessToken = this.jwtService.sign(payload);

    response.cookie('jwt', accessToken, { httpOnly: true });
    return {
      access_token: accessToken,
    };
  }

  async create(data: any): Promise<Users> {
    try {
      return await this.userRepository.save(data);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if (e.message.includes('unique constraint')) {
          throw new Error('Email address is already in use.');
        } else {
          const failedEntry = {
            query: e.query,
            parameters: e.parameters,
          };

          throw new Error('Failed to save user data.');
        }
      } else {
        throw new Error('Unexpected error has occurred.');
      }
    }
  }

  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'logout successful',
    };
  }

  async profile(@Req() request: Request) {
    // there are two different request imports, Request is from express, while there is also Req from Nest.js, do not import Request from Nest.js or there will be duplicate imports
    try {
      const cookie = request.cookies['jwt'];

      if (!cookie) {
        throw new Error('JWT cookie not found');
      }

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.findID(Number(data['id']));

      const { password, usertype, ...result } = user;

      return result;
    } catch (e) {
      console.error('JWT verification error:', e.message);
      throw new Error('Invalid JWT token');
    }
  }
}
