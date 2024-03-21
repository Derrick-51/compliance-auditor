import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service';
import { ImageModule } from 'src/image/image.module';
import { AuditModule } from 'src/audit/audit.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UserModule, AuditModule, ImageModule, JwtModule],
    controllers: [UploadController],
    providers: [UploadService]
})

export class UploadModule {}