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
    private auditRepository: Repository<Audit>
  ) {}

  create(createAuditDto: CreateAuditDto) {
    return 'This action adds a new audit';
  }

  async createOne(user: Users, dueDate: Date, update: Date): Promise<Audit> {
    return await this.auditRepository.save({user, dueDate, update});
  }

  async findAll(): Promise<Audit[]> {
    const audits = await this.auditRepository.find({
      select: ['id', 'finalVerdict', 'auditDate', 'dueDate', 'update'], // Specify only required columns
      relations: ['user'],
    });
    return audits;
  }

  async findOne(id: number): Promise<Audit> {
    return await this.auditRepository.findOne({
      where: { id: id },
      relations: { images: true }
    });
  }

  update(id: number, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }

  async updateVerdict(id: number) {
    const audit = await this.findOne(id);
    let auditFailed: boolean;
    for(let idx = 0; idx < audit.images.length; ++idx) {
      if(audit.images[idx].verdict.toString() === 'Failed') {
        console.log("Failed image")
        auditFailed = true;
        break;
      }
    }
    if(auditFailed) {
      audit.finalVerdict = 'Failed';
    }
    else {
      audit.finalVerdict = 'Passed';
    }
    await audit.save();
  }
}
