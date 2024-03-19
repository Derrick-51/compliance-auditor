import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Req } from '@nestjs/common';
import { Request } from 'express'
import { diskStorage } from 'multer';
import { extname } from 'path';
import {v4 as uuidv4} from "uuid";


@Controller('api/criteria')

export class CriteriaController {
    constructor(
        private criteriaService: CriteriaService
    ) {}

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
}
