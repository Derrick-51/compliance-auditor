import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('')
export class PhotoController {

    // Files will be named with dealer id with sequential numbering
    @Post('dealer/:id/upload-photo')
    @UseInterceptors(FileInterceptor('photo'))
    uploadPhotos(@UploadedFile() photo: Express.Multer.File): any {
        console.log('upload photo')
    }
}