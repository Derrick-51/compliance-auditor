import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Req } from '@nestjs/common';
import { Request } from 'express'
import { diskStorage } from 'multer';
import { extname } from 'path';
import {v4 as uuidv4} from "uuid";

@Controller('criteria')
export class CriteriaController {
  constructor(private readonly criteriaService: CriteriaService) {}

  @Post()
  create(@Body() createCriterionDto: CreateCriterionDto) {
    return this.criteriaService.create(createCriterionDto);
  }
  
  @Post('create')
  @UseInterceptors(FileInterceptor('image', {
      storage: diskStorage({
          destination: 'posters',
          filename: (req, file, callback) => {
              const uniqueName = uuidv4()
              const extension = extname(file.originalname)
              const filename = `${uniqueName}${extension}`

              callback(null, filename)
          }
      })
  }))
  createCriteria(@Req() request: Request, @UploadedFile() file: Express.Multer.File) {

      const fileName: string = file.filename
      const name: string = request.body.name
      const description: string = request.body.description

      this.criteriaService.createCriteria(fileName, name, description)

      return JSON.stringify({FileName: fileName, Criteria: name, Description: description})
  }

  @Get()
  findAll() {
    return this.criteriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.criteriaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCriterionDto: UpdateCriterionDto) {
    return this.criteriaService.update(+id, updateCriterionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.criteriaService.remove(+id);
  }
}
