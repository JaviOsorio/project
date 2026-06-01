import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { In } from 'typeorm';

import { CompaniesRepository } from '../companies/companies.repository';
import { BranchesRepository } from '../branches/branches.repository';
import { RolesRepository } from '../roles/roles.repository';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly branchesRepository: BranchesRepository,
    private readonly companiesRepository: CompaniesRepository,
    private readonly configService: ConfigService,
  ) {}

  findAll(companyId?: string): Promise<UserEntity[]> {
    return this.usersRepository.findAll({
      where: companyId ? { companyId } : undefined,
    });
  }

  findOne(id: string): Promise<UserEntity> {
    return this.usersRepository.findByIdWithRelations(id);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findByEmail(email);
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El usuario ya existe');
    }

    if (dto.companyId) {
      await this.ensureCompanyExists(dto.companyId);
    }

    const roles = dto.roleIds?.length ? await this.rolesRepository.findAll({ where: { id: In(dto.roleIds) } }) : [];
    const branches = dto.branchIds?.length
      ? await this.branchesRepository.findAll({ where: { id: In(dto.branchIds) } })
      : [];

    const user = this.usersRepository.createEntity({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: await bcrypt.hash(dto.password, this.configService.get<number>('bcryptSaltRounds') ?? 12),
      phone: dto.phone,
      active: dto.active ?? true,
      companyId: dto.companyId ?? null,
      roles,
      branches,
    });

    return this.usersRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    if (dto.email && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException('El email ya existe');
      }
    }

    if (dto.companyId) {
      await this.ensureCompanyExists(dto.companyId);
    }

    if (dto.roleIds) {
      user.roles = await this.rolesRepository.findAll({ where: { id: In(dto.roleIds) } });
    }

    if (dto.branchIds) {
      user.branches = await this.branchesRepository.findAll({ where: { id: In(dto.branchIds) } });
    }

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, this.configService.get<number>('bcryptSaltRounds') ?? 12);
    }

    Object.assign(user, {
      firstName: dto.firstName ?? user.firstName,
      lastName: dto.lastName ?? user.lastName,
      email: dto.email ?? user.email,
      phone: dto.phone ?? user.phone,
      active: dto.active ?? user.active,
      companyId: dto.companyId ?? user.companyId,
    });

    return this.usersRepository.save(user);
  }

  remove(id: string): Promise<void> {
    return this.usersRepository.softDelete(id);
  }

  async setRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    const user = await this.findOne(userId);
    user.refreshTokenHash = refreshToken
      ? await bcrypt.hash(refreshToken, this.configService.get<number>('bcryptSaltRounds') ?? 12)
      : null;
    await this.usersRepository.save(user);
  }

  async validatePassword(user: UserEntity, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  private async ensureCompanyExists(companyId: string): Promise<void> {
    const company = await this.companiesRepository.findById(companyId).catch(() => null);
    if (!company) {
      throw new NotFoundException('La empresa no existe');
    }
  }
}
