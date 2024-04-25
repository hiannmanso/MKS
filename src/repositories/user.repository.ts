import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserBody } from 'src/interfaces/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserBody[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<UserBody> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }
  async create(user: UserBody): Promise<UserBody> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }
}
