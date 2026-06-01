import { ConflictException, Injectable } from '@nestjs/common';

import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RoleEntity } from './entities/role.entity';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  findAll(): Promise<RoleEntity[]> {
    return this.rolesRepository.findAll();
  }

  findOne(id: string): Promise<RoleEntity> {
    return this.rolesRepository.findById(id);
  }

  async create(dto: CreateRoleDto): Promise<RoleEntity> {
    const existing = await this.rolesRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException('El rol ya existe');
    }

    return this.rolesRepository.save(this.rolesRepository.createEntity(dto));
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findOne(id);
    if (dto.name && dto.name !== role.name) {
      const existing = await this.rolesRepository.findByName(dto.name);
      if (existing) {
        throw new ConflictException('El rol ya existe');
      }
    }
    Object.assign(role, dto);
    return this.rolesRepository.save(role);
  }

  remove(id: string): Promise<void> {
    return this.rolesRepository.softDelete(id);
  }
}
