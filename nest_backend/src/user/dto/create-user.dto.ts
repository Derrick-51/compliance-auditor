import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  dealershipName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
