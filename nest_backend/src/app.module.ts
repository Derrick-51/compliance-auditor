import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Users } from './user/entities/user.entity';
import { AuditModule } from './audit/audit.module';
import { Audit } from './audit/entities/audit.entity';
import { EvidenceModule } from './evidence/evidence.module';
import { Evidence } from './evidence/entities/evidence.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { CampaignModule } from './campaign/campaign.module';
import { CriteriaModule } from './criteria/criteria.module';
import { Campaign } from './campaign/entities/campaign.entity';
import { Criterion } from './criteria/entities/criterion.entity';
import { PasswordModule } from './password/password.module';
import { PasswordEntity } from './password/password.entity';
import { UserService } from './user/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql', //postgres for Zwar
      host: 'localhost',
      port: 1433,
      username: 'admin',
      password: 'admin123',
      database: 'compliance-auditor',
      synchronize: true, //REMOVE THIS IN PRODUCTION
      entities: [Users, Audit, Evidence, Campaign, Criterion, PasswordEntity],
      options: { encrypt: false }, //Make sure to comment this out when working with postgres //bypasses self-signed certificate, may need to change this later since this can be exploited in a cyber attack
    }),
    // Serve files from the 'images' folder
    ServeStaticModule.forRoot({
      serveRoot: '/images',
      rootPath: join(__dirname, '..', 'images'),
    }),
    // Serve files from the 'posters' folder
    ServeStaticModule.forRoot({
      serveRoot: '/posters',
      rootPath: join(__dirname, '..', 'posters'),
    }),
    // Serve files from the 'extracted_posters' folder
    ServeStaticModule.forRoot({
      serveRoot: '/extracted_posters',
      rootPath: join(__dirname, '..', 'extracted_posters'),
    }),
    AuthModule,
    PassportModule,
    UserModule,
    AuditModule,
    EvidenceModule,
    CampaignModule,
    CriteriaModule,
    PasswordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
