import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from '../common/repositories/base.repository';
import { AppointmentEntity } from './entities/appointment.entity';

@Injectable()
export class AppointmentsRepository extends BaseRepository<AppointmentEntity> {
  constructor(@InjectRepository(AppointmentEntity) repository: Repository<AppointmentEntity>) {
    super(repository);
  }
}
