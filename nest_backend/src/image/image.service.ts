import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Images } from './entities/image.entity';
import { Audit } from '../audit/entities/audit.entity'
import { DataSource } from 'typeorm';
import { spawn } from "child_process";
import  * as fs from 'fs'
import * as path from 'path';
import { AuditService } from 'src/audit/audit.service';
import { Criterion } from 'src/criteria/entities/criterion.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Images)
    private imageRepository: Repository<Images>,
    private dataSource: DataSource
  ) {}

  async create(
    fileName: string,
    criterion: Criterion,
    audit: Audit
    ): Promise<Images> {

    // Temporary random verdict
    let verdict: string;
    if(Math.round(Math.random())) {
      verdict = 'Passed';
    }
    else {
      verdict = 'Failed';
    }
    
    return await this.imageRepository.save({fileName, criterion, audit, verdict});
  }

  async createOne(imageName: string, update: Date, audit: Audit): Promise<Images> {
    const newImage = await this.imageRepository.save({fileName: imageName, update});

    audit.images = [...audit.images, newImage];
    await audit.save();

    return newImage
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

  async findOne(imageName: string) {
    return await this.imageRepository.findOne({
      where: {fileName: imageName}
    });
  }

  async update(id: number, fileName: string): Promise<Images> {
    const image = await this.imageRepository.findOne({
      where: {id: id}
    })
    if(!image) {
      throw new HttpException('Evidence image not found', HttpStatus.NOT_FOUND);
    }

    const oldFileName = image.fileName;
    image.fileName = fileName;
    await image.save();

    fs.unlink(path.resolve(__dirname, `../../images/${oldFileName}`), (err) => {
      if(err) {
        console.log('Could not delete previous image: ' + err);
      };
    });

    return image;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }

  async analyzeImage(evidenceName: string, criterionName: string): Promise<string> {
    let result: string;
    try {
      // Call audit script with evidence and criterion image names
      const auditScript = spawn("py", ["-3.11", "../object_detection/audit_image.py", evidenceName, criterionName]);
      
      // Script error event listener
      auditScript.on("error", (err) => {
        console.log("Audit Script Error: " + err);
      })

      // Script exit event listener
      auditScript.on("close", (code) => {
        
        console.log(`Audit Script exited with code: ${code}`);

        if(code === 1) {
          throw new Error("audit_image.py exited with error");
        }

        // Read analysis results
        const evidenceBaseName = path.posix.basename(evidenceName, path.extname(evidenceName));
        const resultPath = path.resolve(__dirname, `../../../object_detection/${evidenceBaseName}.json`);
        result = fs.readFileSync(resultPath, 'utf-8');
          
        if(!result) {
          throw new Error("Error reading audit results file");
        }
        
        fs.unlink(resultPath, (err) => {
          if (err) throw err;
        });
      });
    }
    catch (err) {
      console.log(err.message);
      throw err;
    }

    return result;
  }

  async updateVerdict(imageName: string, verdict: string) {
    let image = await this.findOne(imageName);

    image.verdict = verdict;
    await image.save();
  }
}
