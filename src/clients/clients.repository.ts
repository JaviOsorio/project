import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from '../common/repositories/base.repository';
import { ClientEntity } from './entities/client.entity';

@Injectable()
export class ClientsRepository extends BaseRepository<ClientEntity> {
  constructor(@InjectRepository(ClientEntity) repository: Repository<ClientEntity>) {
    super(repository);
  }
}
