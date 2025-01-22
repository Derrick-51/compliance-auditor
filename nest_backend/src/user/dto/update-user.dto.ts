import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  address: string;
}
