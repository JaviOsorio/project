import { Injectable, NotFoundException } from '@nestjs/common';

import { CompaniesRepository } from '../companies/companies.repository';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { ClientEntity } from './entities/client.entity';
import { ClientsRepository } from './clients.repository';

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    private readonly companiesRepository: CompaniesRepository,
  ) {}

  findAll(companyId?: string): Promise<ClientEntity[]> {
    return this.clientsRepository.findAll({ where: companyId ? { companyId } : undefined });
  }

  findOne(id: string): Promise<ClientEntity> {
    return this.clientsRepository.findById(id);
  }

  async create(dto: CreateClientDto): Promise<ClientEntity> {
    await this.ensureCompanyExists(dto.companyId);
    return this.clientsRepository.save(this.clientsRepository.createEntity(dto));
  }

  async update(id: string, dto: UpdateClientDto): Promise<ClientEntity> {
    const client = await this.findOne(id);
    if (dto.companyId) {
      await this.ensureCompanyExists(dto.companyId);
    }
    Object.assign(client, dto);
    return this.clientsRepository.save(client);
  }

  remove(id: string): Promise<void> {
    return this.clientsRepository.softDelete(id);
  }

  private async ensureCompanyExists(companyId: string): Promise<void> {
    const company = await this.companiesRepository.findById(companyId).catch(() => null);
    if (!company) {
      throw new NotFoundException('La empresa no existe');
    }
  }
}
