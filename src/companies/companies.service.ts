import { ConflictException, Injectable } from '@nestjs/common';

import { EntityStatus } from '../common/enums/entity-status.enum';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { CompanyEntity } from './entities/company.entity';
import { CompaniesRepository } from './companies.repository';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  findAll(): Promise<CompanyEntity[]> {
    return this.companiesRepository.findAll();
  }

  findOne(id: string): Promise<CompanyEntity> {
    return this.companiesRepository.findById(id);
  }

  async create(dto: CreateCompanyDto): Promise<CompanyEntity> {
    const existing = await this.companiesRepository.findByNit(dto.nit);
    if (existing) {
      throw new ConflictException('La empresa ya existe');
    }

    const company = this.companiesRepository.createEntity({
      ...dto,
      status: EntityStatus.ACTIVE,
    });
    return this.companiesRepository.save(company);
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<CompanyEntity> {
    const company = await this.findOne(id);
    if (dto.nit && dto.nit !== company.nit) {
      const existing = await this.companiesRepository.findByNit(dto.nit);
      if (existing) {
        throw new ConflictException('El NIT ya existe');
      }
    }
    Object.assign(company, dto);
    return this.companiesRepository.save(company);
  }

  remove(id: string): Promise<void> {
    return this.companiesRepository.softDelete(id);
  }
}
