import { Injectable } from "@nestjs/common";


@Injectable()
export class UploadService {
    uploadFile() {
        console.log('upload file')
    }
}