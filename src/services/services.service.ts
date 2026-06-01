import { Injectable, NotFoundException } from '@nestjs/common';

import { CompaniesRepository } from '../companies/companies.repository';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { ServiceEntity } from './entities/service.entity';
import { ServicesRepository } from './services.repository';

@Injectable()
export class ServicesService {
  constructor(
    private readonly servicesRepository: ServicesRepository,
    private readonly companiesRepository: CompaniesRepository,
  ) {}

  findAll(companyId?: string): Promise<ServiceEntity[]> {
    return this.servicesRepository.findAll({ where: companyId ? { companyId } : undefined });
  }

  findOne(id: string): Promise<ServiceEntity> {
    return this.servicesRepository.findById(id);
  }

  async create(dto: CreateServiceDto): Promise<ServiceEntity> {
    await this.ensureCompanyExists(dto.companyId);
    return this.servicesRepository.save(
      this.servicesRepository.createEntity({
        ...dto,
        active: dto.active ?? true,
      }),
    );
  }

  async update(id: string, dto: UpdateServiceDto): Promise<ServiceEntity> {
    const service = await this.findOne(id);
    if (dto.companyId) {
      await this.ensureCompanyExists(dto.companyId);
    }
    Object.assign(service, dto);
    return this.servicesRepository.save(service);
  }

  remove(id: string): Promise<void> {
    return this.servicesRepository.softDelete(id);
  }

  private async ensureCompanyExists(companyId: string): Promise<void> {
    const company = await this.companiesRepository.findById(companyId).catch(() => null);
    if (!company) {
      throw new NotFoundException('La empresa no existe');
    }
  }
}
