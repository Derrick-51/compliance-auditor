import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path'

@Controller('')
export class PhotoController {

    // Files will be named with dealer id with sequential numbering
    @Post('dealer/:id/upload-photo')
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: './uploaded-photos',
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