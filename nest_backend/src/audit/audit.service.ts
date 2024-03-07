import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit } from './entities/audit.entity';
import { Users } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private auditRepository: Repository<Audit>,
  ) {}

  create(createAuditDto: CreateAuditDto) {
    return 'This action adds a new audit';
  }

  async findAll(): Promise<Audit[]> {
    const audits = await this.auditRepository.find({
      select: ['id', 'finalVerdict', 'auditDate', 'dueDate', 'update'], // Specify only required columns
      relations: ['user'], //show user tied to the audit
    });
    return audits;
  }

  findOne(id: number) {
    return `This action returns a #${id} audit`;
  }

  update(id: number, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }
}
