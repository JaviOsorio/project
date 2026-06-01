import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from '../common/repositories/base.repository';
import { BranchEntity } from './entities/branch.entity';

@Injectable()
export class BranchesRepository extends BaseRepository<BranchEntity> {
  constructor(@InjectRepository(BranchEntity) repository: Repository<BranchEntity>) {
    super(repository);
  }
}
