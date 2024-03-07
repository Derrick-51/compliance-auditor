import { Inject, Injectable } from "@nestjs/common";
import { Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants'
import { spawn } from "child_process"
import { ImageService } from "src/image/image.service";
import { UserService } from "src/user/user.service";
import { Users } from "src/user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuditService } from "src/audit/audit.service";
import { DefaultDeserializer } from "v8";


@Injectable()
export class UploadService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private auditService: AuditService,
        private imageService: ImageService
    ) {}


    async uploadFiles(@Req() request: Request, fileNames: string[]) {


        try {
            const cookie = request.cookies['jwt'];
            if(!cookie) {
                throw new Error('JWT cookie not found');
            }

            const data = await this.jwtService.verifyAsync(cookie, {
                secret: jwtConstants.secret
            });
            if(!data) {
                throw new UnauthorizedException();
            }

            const user = await this.userService.findID(Number(data['id']));

            // // WIP //////////////////////////
            const audit = await this.auditService.createOne(user, new Date(), new Date());
            const newAudit = await this.auditService.findOne(audit.id)

            for(let idx = 0; idx < fileNames.length; ++idx) {
                await this.imageService.createOne(fileNames[idx], new Date(), newAudit);
            }
            // /////////////////////////////////

        } catch(err) {
            console.error(err.message);
            throw new Error('File upload failure');
        }


        

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
        
        return 'Done'
    }
}