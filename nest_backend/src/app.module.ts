import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './modules/upload/upload.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Users } from './user/entities/user.entity';
import { AuditModule } from './audit/audit.module';
import { Audit } from './audit/entities/audit.entity';
import { ImageModule } from './image/image.module';
import { Image } from './image/entities/image.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { LatestAuditModule } from './latest-audit/latest-audit.module';
import { FailedImagesModule } from './failed-images/failed-images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GuidelinesModule } from './guidelines/guidelines.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'admin',
      password: 'admin123',
      database: 'compliance-auditor',
      synchronize: true, //REMOVE THIS IN PRODUCTION
      entities: [Users, Audit, Image],
      options: { encrypt: false }, //bypasses self-signed certificate, may need to change this later since this can be exploited in a cyber attack
    }),
    UploadModule,
    AuthModule,
    PassportModule,
    UserModule,
    AuditModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
