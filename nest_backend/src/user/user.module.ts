import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Users } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { PasswordModule } from 'src/password/password.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), PasswordModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
