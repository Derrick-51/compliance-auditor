import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path'
import { UploadService } from './upload.service';

@Controller('')
export class UploadController {
    constructor(private uploadService: UploadService) {}

    // Files will be named with dealer id with sequential numbering
    @Post('upload')
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: 'photos',
            filename: (req, file, callback) => {
                const uniqueName = `${Date.now()}` // DATE.NOW IS A PLACEHOLDER
                const extension = extname(file.originalname)
                const filename = `${uniqueName}${extension}`

                callback(null, filename)
            }
        })
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file)
        this.uploadService.uploadFile("12345", file.filename)
    }
}