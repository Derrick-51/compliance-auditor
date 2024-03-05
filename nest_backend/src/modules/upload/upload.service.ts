import { Inject, Injectable } from "@nestjs/common";
import { Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt';
import { spawn } from "child_process"
import { ImageService } from "src/image/image.service";
import { UserService } from "src/user/user.service";
import { Users } from "src/user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class UploadService {
    constructor(
        private jwtService: JwtService,
    ) {}


    async uploadFiles(@Req() request: Request, fileNames: string[]) {


        try {
            const cookie = request.cookies['jwt'];
            if(!cookie) {
                throw new Error('JWT cookie not found');
            }

            const data = await this.jwtService.verifyAsync(cookie);
            if(!data) {
                throw new UnauthorizedException();
            }

            console.log(data['id'])

            // // WIP //////////////////////////
            // const audit = this.auditService.createOne();
            // this.imageService.createMany(audit, fileNames);
            // /////////////////////////////////

        } catch(err) {
            console.error('JWT verification error: ', err.message);
            throw new Error('Invalid JWT token');
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
        
        return 'Success'
    }
}