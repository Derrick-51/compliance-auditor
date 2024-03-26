import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, HttpException, HttpStatus, UploadedFile } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {v4 as uuidv4} from "uuid";
import { CriteriaService } from 'src/criteria/criteria.service';
import { AuditService } from 'src/audit/audit.service';

@Controller('image')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly criteriaService: CriteriaService,
    private readonly auditService: AuditService
    ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: 'images',
      filename: (req, file, callback) => {
        const uniqueName = uuidv4()
        const extension = extname(file.originalname)
        const filename = `${uniqueName}${extension}`

        callback(null, filename)
      }
    })
  }))
  async create(@Body() createImageDto: CreateImageDto, @UploadedFile() file: Express.Multer.File) {
    const fileName: string = file.filename;
    const criterionID: number = createImageDto.criterionID;
    const auditID: number = createImageDto.auditID;

    if(!criterionID) {
      throw new HttpException('No criterionID given', HttpStatus.BAD_REQUEST);
    }
    if(!auditID) {
      throw new HttpException('No auditID given', HttpStatus.BAD_REQUEST);
    }

    // Get criterion
    const criterion = await this.criteriaService.findOne(criterionID);
    if(!criterion) {
      throw new HttpException('Criterion not found', HttpStatus.NOT_FOUND)
    }

    // Get audit
    const audit = await this.auditService.findOneWithImages(auditID);
    if(!audit) {
      throw new HttpException('Criterion not found', HttpStatus.NOT_FOUND)
    }

    return await this.imageService.create(fileName, criterion, audit);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
