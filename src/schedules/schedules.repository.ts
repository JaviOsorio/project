import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from '../common/repositories/base.repository';
import { ScheduleEntity } from './entities/schedule.entity';

@Injectable()
export class SchedulesRepository extends BaseRepository<ScheduleEntity> {
  constructor(@InjectRepository(ScheduleEntity) repository: Repository<ScheduleEntity>) {
    super(repository);
  }
}
