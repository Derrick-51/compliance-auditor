import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('')
export class PhotosController {

    // Files will be named with dealer id with sequential numbering
    @Post('dealer/:id/upload-photos')
    @UseInterceptors(FilesInterceptor('photo'))
    uploadPhotos(@UploadedFiles() photos: Array<Express.Multer.File>): any {
        console.log('upload photos')
    }
}