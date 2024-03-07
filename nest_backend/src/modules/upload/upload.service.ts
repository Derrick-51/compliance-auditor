import { Inject, Injectable } from "@nestjs/common";
import { Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants'
import { ImageService } from "src/image/image.service";
import { UserService } from "src/user/user.service";
import { Users } from "src/user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuditService } from "src/audit/audit.service";


@Injectable()
export class UploadService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private auditService: AuditService,
        private imageService: ImageService
    ) {}


    async uploadFiles(@Req() request: Request, fileNames: string[]) {

        let auditId: number
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

            const audit = await this.auditService.createOne(user, new Date(), new Date());
            auditId = audit.id

            // Need to use findOne to retrieve image field
            const newAudit = await this.auditService.findOne(audit.id)

            for(let idx = 0; idx < fileNames.length; ++idx) {
                await this.imageService.createOne(fileNames[idx], new Date(), newAudit);
            }

        } catch(err) {
            console.error(err.message);
            throw new Error('File upload failure');
        }

        await this.imageService.analyzeImages(fileNames, auditId);

        return 'Upload success'
    }
}