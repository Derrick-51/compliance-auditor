import { Injectable } from "@nestjs/common";
import { spawn } from "child_process"


@Injectable()
export class UploadService {
    uploadFile(accountId: String, fileName: String) {
        const filePath = `./images/${fileName}`

        // Call audit script with image path
        const auditScript = spawn("py", ["-3.11", "../object_detection/audit_image.py", filePath])

        var auditResult: String = ""
        var exitCode: Number = -1

        // Audit Results
        auditScript.stdout.on("data", (data) => {
            auditResult = data
            console.log(`Account ID: ${accountId}, File Name: ${fileName}, Audit Result: ${auditResult}`)
        })
        
        // Script exit code
        auditScript.on("close", (code) =>{
            exitCode = code
            console.log(`exited with code: ${code}`)
        })        
    }
}