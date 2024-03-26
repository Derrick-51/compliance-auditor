import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Controller,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('users/:id')
  async updateUser(@Param('id') id: number, @Body() user: Users): Promise<Users> {
    return await this.userService.updateUser(id, user);
  }
  
}
