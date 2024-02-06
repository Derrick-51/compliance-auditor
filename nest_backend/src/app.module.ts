import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, PassportModule],
=======
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [UploadModule],
>>>>>>> development
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
