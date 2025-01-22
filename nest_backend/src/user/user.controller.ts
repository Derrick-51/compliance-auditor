import {
  Body,
  Controller,
  Get,
  Param,
  Put
} from '@nestjs/common';
import { Users } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() user: Users,
  ): Promise<Users> {
    return await this.userService.updateUser(id, user);
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<Users> {
    return await this.userService.findID(id);
  }
}
