import { Module } from '@nestjs/common';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordEntity } from './password.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PasswordEntity])],
  controllers: [PasswordController],
  providers: [PasswordService]
})
export class PasswordModule {}
