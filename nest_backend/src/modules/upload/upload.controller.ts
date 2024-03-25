import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Req } from '@nestjs/common';
import { Request } from 'express'
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { UserService } from 'src/user/user.service';
import {v4 as uuidv4} from "uuid";

@Controller('api')
export class UploadController {
    constructor(
        private uploadService: UploadService
    ) {}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('images', undefined, {
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
    uploadFiles(@Req() request: Request, @UploadedFiles() files: Array<Express.Multer.File>) {

        // Extract file names
        let fileNames: string[] = [];
        for(let idx = 0; idx < files.length; ++idx) {
            fileNames.push(files[idx].filename);
        }

        return this.uploadService.uploadFiles(request, fileNames)
    }
}