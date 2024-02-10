import { Module } from '@nestjs/common';
//import { DatabaseModule } from 'src/database.module';
//import { userProviders } from 'src/user/user.provider';
import { UserService } from 'src/user/user.service';
import { Users } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
