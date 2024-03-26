import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Images } from './entities/image.entity';
import { Audit } from '../audit/entities/audit.entity';
import { DataSource } from 'typeorm';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Images)
    private imageRepository: Repository<Images>,
    private dataSource: DataSource,
  ) {}

  create(createImageDto: CreateImageDto) {
    return 'This action adds a new image';
  }

  async createOne(
    imageName: string,
    update: Date,
    audit: Audit,
  ): Promise<Images> {
    const newImage = await this.imageRepository.save({
      fileName: imageName,
      update,
    });

    audit.images = [...audit.images, newImage];
    await audit.save();

    return newImage;
  }

  async createMany(imageNames: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    // Create image entities
    let images: Images[] = [];
    for (let idx = 0; idx < imageNames.length; ++idx) {
      images[idx];
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let idx = 0; idx < images.length; ++idx) {
        await queryRunner.manager.save(images[idx]);
      }
    } catch (err) {
      // Rollback changes if transaction was not completed
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      console.log('done');
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all image`;
  }

  async findOne(imageName: string) {
    return await this.imageRepository.findOne({
      where: { fileName: imageName },
    });
  }

  async findAudit(auditID: number): Promise<Images> {
    return await this.imageRepository.findOne({
      where: { auditID: auditID },
      select: ['id', 'verdict', 'override', 'criterion'],
    });
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }

  async analyzeImages(fileNames: string[], auditId: number) {
    try {
      // Call audit script with image names list
      const auditScript = spawn('py', [
        '-3.11',
        '../object_detection/audit_image.py',
        JSON.stringify(fileNames),
        auditId.toString(),
      ]);

      // Script exit event listener
      auditScript.on('close', (code) => {
        console.log(`Audit exited with code: ${code}`);

        if (code === 1) throw new Error('audit_image.py exited with error');

        const results = fs.readFileSync(
          path.resolve(
            __dirname,
            `../../analysis_results/Audit_${auditId}.json`,
          ),
          'utf-8',
        );

        if (!results) {
          throw new Error('Error reading audit results file');
        }

        let resultsObj = JSON.parse(results);

        // Update individual image verdicts
        for (let idx = 0; idx < fileNames.length; ++idx) {
          let verdict = resultsObj[fileNames[idx]];
          this.updateVerdict(fileNames[idx], verdict);
        }
      });
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async updateVerdict(imageName: string, verdict: string) {
    let image = await this.findOne(imageName);

    image.verdict = verdict;
    await image.save();
  }
}
