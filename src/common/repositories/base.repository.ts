import { NotFoundException } from '@nestjs/common';
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

export abstract class BaseRepository<T extends { id: string }> {
  protected constructor(protected readonly repository: Repository<T>) {}

  createEntity(payload: DeepPartial<T>): T {
    return this.repository.create(payload);
  }

  save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity as T);
  }

  findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOneOrFail(options: FindOneOptions<T>): Promise<T> {
    const entity = await this.repository.findOne(options);
    if (!entity) {
      throw new NotFoundException('Recurso no encontrado');
    }
    return entity;
  }

  async findById(id: string, relations: FindOneOptions<T>['relations'] = []): Promise<T> {
    return this.findOneOrFail({ where: { id } as FindOptionsWhere<T>, relations });
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
