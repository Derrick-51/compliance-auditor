import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Images } from './entities/image.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Images)
    private imageRepository: Repository<Images>,
    private dataSource: DataSource
  ) {}

  create(createImageDto: CreateImageDto) {
    return 'This action adds a new image';
  }

  async createMany(imageNames: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    // Create image entities
    let images: Images[] = [];
    for(let idx = 0; idx < imageNames.length; ++idx) {
      images[idx]
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for(let idx = 0; idx < images.length; ++idx) {
        await queryRunner.manager.save(images[idx]);
      }

    } catch (err) {
      // Rollback changes if transaction was not completed
      console.log(err)
      await queryRunner.rollbackTransaction();

    } finally {
      console.log('done')
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
