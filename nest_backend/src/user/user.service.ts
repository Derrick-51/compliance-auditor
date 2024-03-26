import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) { }

  async findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }

  async findOne(email: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findID(id: number): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async update(id: number, data: any): Promise<any> {
    return this.userRepository.update(id, data);
  }
  
  async updateUser(id: number, user: Users): Promise<Users> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new Error('User not found');
    }
    await this.userRepository.update(id, user);
    return await this.userRepository.findOne({ where: { id } });
  }
}
