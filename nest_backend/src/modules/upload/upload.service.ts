import { Injectable } from "@nestjs/common";


@Injectable()
export class UploadService {
    uploadFile(accountId: String, fileName: String) {
        console.log(`Account ID: ${accountId}, File Name: ${fileName}`)
    }
}