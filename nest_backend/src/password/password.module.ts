import { MaxFileSizeValidator, Module } from '@nestjs/common';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordEntity } from './password.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordEntity]),
    MailerModule.forRoot({
      transport: { //Im using mailhog for an email service, this must be changed in production
        host: '0.0.0.0',
        port: 1025,
      },
      defaults: {
        from: 'admin@dca.com'
      },

    }),
  ],
  controllers: [PasswordController],
  providers: [PasswordService]
})
export class PasswordModule { }
