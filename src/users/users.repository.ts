import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from '../common/repositories/base.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<UserEntity> {
  constructor(@InjectRepository(UserEntity) repository: Repository<UserEntity>) {
    super(repository);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { email },
      relations: { roles: true, branches: true, company: true },
    });
  }

  findByIdWithRelations(id: string): Promise<UserEntity> {
    return this.findById(id, { roles: true, branches: true, company: true });
  }
}
