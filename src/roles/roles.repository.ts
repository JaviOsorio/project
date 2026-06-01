import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from '../common/repositories/base.repository';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesRepository extends BaseRepository<RoleEntity> {
  constructor(@InjectRepository(RoleEntity) repository: Repository<RoleEntity>) {
    super(repository);
  }

  findByName(name: string): Promise<RoleEntity | null> {
    return this.repository.findOne({ where: { name } });
  }
}
