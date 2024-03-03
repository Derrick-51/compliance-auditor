import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FailedImagesController } from './failed-images.controller';
import { FailedImagesService } from './failed-images.service';
import { Images } from 'src/image/entities/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Images]),
  ],
  controllers: [FailedImagesController],
  providers: [FailedImagesService],
})
export class FailedImagesModule {}
