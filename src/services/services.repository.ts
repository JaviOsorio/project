import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from '../common/repositories/base.repository';
import { ServiceEntity } from './entities/service.entity';

@Injectable()
export class ServicesRepository extends BaseRepository<ServiceEntity> {
  constructor(@InjectRepository(ServiceEntity) repository: Repository<ServiceEntity>) {
    super(repository);
  }
}
