import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from '../common/repositories/base.repository';
import { CompanyEntity } from './entities/company.entity';

@Injectable()
export class CompaniesRepository extends BaseRepository<CompanyEntity> {
  constructor(@InjectRepository(CompanyEntity) repository: Repository<CompanyEntity>) {
    super(repository);
  }

  findByNit(nit: string): Promise<CompanyEntity | null> {
    return this.repository.findOne({ where: { nit } });
  }
}
