import { Injectable, NotFoundException } from '@nestjs/common';

import { CompaniesRepository } from '../companies/companies.repository';
import { EntityStatus } from '../common/enums/entity-status.enum';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { BranchEntity } from './entities/branch.entity';
import { BranchesRepository } from './branches.repository';

@Injectable()
export class BranchesService {
  constructor(
    private readonly branchesRepository: BranchesRepository,
    private readonly companiesRepository: CompaniesRepository,
  ) {}

  findAll(companyId?: string): Promise<BranchEntity[]> {
    return this.branchesRepository.findAll({
      where: companyId ? { companyId } : undefined,
    });
  }

  findOne(id: string): Promise<BranchEntity> {
    return this.branchesRepository.findById(id);
  }

  async create(dto: CreateBranchDto): Promise<BranchEntity> {
    await this.ensureCompanyExists(dto.companyId);
    return this.branchesRepository.save(
      this.branchesRepository.createEntity({
        ...dto,
        status: EntityStatus.ACTIVE,
      }),
    );
  }

  async update(id: string, dto: UpdateBranchDto): Promise<BranchEntity> {
    const branch = await this.findOne(id);
    if (dto.companyId) {
      await this.ensureCompanyExists(dto.companyId);
    }
    Object.assign(branch, dto);
    return this.branchesRepository.save(branch);
  }

  remove(id: string): Promise<void> {
    return this.branchesRepository.softDelete(id);
  }

  private async ensureCompanyExists(companyId: string): Promise<void> {
    const company = await this.companiesRepository.findById(companyId).catch(() => null);
    if (!company) {
      throw new NotFoundException('La empresa no existe');
    }
  }
}
