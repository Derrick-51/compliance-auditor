import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service';
import { ImageModule } from 'src/image/image.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UserModule, ImageModule, JwtModule],
    controllers: [UploadController],
    providers: [UploadService]
})

export class UploadModule {}