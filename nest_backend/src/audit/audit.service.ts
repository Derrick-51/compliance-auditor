import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { Audit } from './entities/audit.entity';
import { Users } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private auditRepository: Repository<Audit>,
  ) {}

  create(createAuditDto: CreateAuditDto) {
    return 'This action adds a new audit';
  }

  async createOne(user: Users, dueDate: Date, update: Date): Promise<Audit> {
    return await this.auditRepository.save({ user, dueDate, update });
  }

  async findOne(id: number): Promise<Audit> {
    return await this.auditRepository.findOne({
      where: { auditID: id },
      select: ['auditID', 'finalVerdict', 'submitDate', 'update'],
      relations: ['user'],
    });
  }

  async findAll(): Promise<Audit[]> {
    const audits = await this.auditRepository.find({
      select: ['auditID', 'finalVerdict', 'submitDate', 'update'], // Specify only required columns
      relations: ['user'], //show user tied to the audit
    });
    return audits;
  }

  async findOneWithImages(id: number): Promise<Audit> {
    return await this.auditRepository.findOne({
      where: { auditID: id },
      relations: { images: true },
    });
  }

  update(id: number, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }

  async updateVerdict(id: number) {
    const audit = await this.findOneWithImages(id);

    let auditFailed: boolean = false;
    for (let idx = 0; idx < audit.images.length; ++idx) {
      if (audit.images[idx].verdict.toString() === 'Failed') {
        auditFailed = true;
        break;
      }
    }

    if (auditFailed) {
      audit.finalVerdict = 'Failed';
    } else {
      audit.finalVerdict = 'Passed';
    }
    await audit.save();
  }
}
