import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordEntity } from './password.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PasswordService {

  constructor(
    @InjectRepository(PasswordEntity) private readonly passwordRepository: Repository<PasswordEntity>
  ) {

  }

  //Function to create password reset entry
  async create(body: any) {
    return this.passwordRepository.save(body);
  }

  //Function to find password reset entry
  async findOne(data: any){
    return this.passwordRepository.findOne({where: data});
  }

}
