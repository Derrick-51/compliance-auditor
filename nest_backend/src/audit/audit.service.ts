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

  async createOne(user: Users, dueDate: Date, update: Date): Promise<Audit> {
    return await this.auditRepository.save({user, dueDate, update});
  }

  create(createAuditDto: CreateAuditDto) {
    return 'This action adds a new audit';
  }

  findAll() {
    return `This action returns all audit`;
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
}
