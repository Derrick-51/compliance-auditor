import { Inject, Injectable } from "@nestjs/common";
import { spawn } from "child_process"
import { ImageService } from "src/image/image.service";


@Injectable()
export class UploadService {
    @Inject(ImageService)
    private readonly imageService: ImageService

    async uploadFiles(accountId: string, fileNames: string[]) {

        // // WIP //////////////////////////
        // const audit = this.auditService.createOne();
        // this.imageService.createMany(audit, fileNames);
        // /////////////////////////////////

        // // Call audit script with image path
        // const auditScript = spawn("py", ["-3.11", "../object_detection/audit_image.py", filePath])

        // var auditResult: String = ""
        // var exitCode: Number = -1

        // // Audit Results
        // auditScript.stdout.on("data", (data) => {
        //     auditResult = data
        //     console.log(`Account ID: ${accountId}, File Name: ${fileName}, Audit Result: ${auditResult}`)
        // })
        
        // // Script exit code
        // auditScript.on("close", (code) =>{
        //     exitCode = code
        //     console.log(`exited with code: ${code}`)
        // })      
        
        return 'Success'
    }
}