import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CriteriaService } from 'src/criteria/criteria.service';
import { AuditService } from 'src/audit/audit.service';
import { Evidence } from './entities/evidence.entity';

@Controller('api/evidence')
export class EvidenceController {
  constructor(
    private readonly evidenceService: EvidenceService,
    private readonly criteriaService: CriteriaService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'images',
        filename: (req, file, callback) => {
          const uniqueName = uuidv4();
          const extension = extname(file.originalname);
          const filename = `${uniqueName}${extension}`;

          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() createEvidenceDto: CreateEvidenceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const fileName: string = file.filename;
    const criterionID: number = createEvidenceDto.criterionID;
    const auditID: number = createEvidenceDto.auditID;

    if (!criterionID) {
      throw new HttpException('No criterionID given', HttpStatus.BAD_REQUEST);
    }
    if (!auditID) {
      throw new HttpException('No auditID given', HttpStatus.BAD_REQUEST);
    }

    // Get criterion
    const criterion = await this.criteriaService.findOne(criterionID);
    if (!criterion) {
      throw new HttpException('Criterion not found', HttpStatus.NOT_FOUND);
    }

    // Get audit
    const audit = await this.auditService.findOneWithEvidence(auditID);
    if (!audit) {
      throw new HttpException('Criterion not found', HttpStatus.NOT_FOUND);
    }

    return await this.evidenceService.create(fileName, criterion, audit);
  }

  @Patch('override-verdict/:verdict/selected-image/:id') //function to update data :)
  overrideVerdict(
    @Param('id') imageID: number,
    @Param('verdict') verdict: string,
  ) {
    return this.evidenceService.overrideVerdict(imageID, verdict);
  }

  @Get('selected-audit/:auditID')
  findAudit(@Param('auditID') auditID: any): Promise<Evidence[]> {
    return this.evidenceService.findAudit(auditID);
  }

  @Get()
  findAll() {
    return this.evidenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evidenceService.findOne(id);
  }

  @Patch(':fileName')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'images',
        filename: (req, file, callback) => {
          const uniqueName = uuidv4();
          const extension = extname(file.originalname);
          const filename = `${uniqueName}${extension}`;

          callback(null, filename);
        },
      }),
    }),
  )
  async update(
    @Param('fileName') fileName: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const evidence = await this.evidenceService.findOne(fileName);
    if (!evidence) {
      throw new HttpException('Evidence image not found', HttpStatus.NOT_FOUND);
    }

    // Get criterion
    const criterion = await this.criteriaService.findOne(
      evidence.criterion.criteriaID,
    );
    if (!criterion) {
      throw new HttpException('Criterion not found', HttpStatus.NOT_FOUND);
    }

    return this.evidenceService.update(evidence, criterion, file.filename);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evidenceService.remove(+id);
  }
}
