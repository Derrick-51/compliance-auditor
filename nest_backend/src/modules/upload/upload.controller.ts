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
                const uniqueName = 'placeholder'
                const extension = extname(file.originalname)
                const filename = `${uniqueName}${extension}`

                callback(null, filename)
            }
        })
    }))
    uploadPhoto(@UploadedFile() photo: Express.Multer.File) {
        console.log('photo upload', photo)
    }
}