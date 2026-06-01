import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  const usersRepository = {
    findAll: jest.fn(),
    findByIdWithRelations: jest.fn(),
    findByEmail: jest.fn(),
    createEntity: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  } as any;
  const rolesRepository = { findAll: jest.fn() } as any;
  const branchesRepository = { findAll: jest.fn(), findById: jest.fn() } as any;
  const companiesRepository = { findById: jest.fn() } as any;
  const configService = { get: jest.fn().mockReturnValue(12) } as unknown as ConfigService;

  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(usersRepository, rolesRepository, branchesRepository, companiesRepository, configService);
  });

  it('creates a user with hashed password', async () => {
    usersRepository.findByEmail.mockResolvedValue(null);
    companiesRepository.findById.mockResolvedValue({ id: 'c1' });
    rolesRepository.findAll.mockResolvedValue([{ id: 'r1', name: 'ADMIN' }]);
    branchesRepository.findAll.mockResolvedValue([{ id: 'b1' }]);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    usersRepository.createEntity.mockReturnValue({ id: 'u1' });
    usersRepository.save.mockResolvedValue({ id: 'u1' });

    const result = await service.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@barber.com',
      password: 'secret123',
      companyId: 'c1',
      roleIds: ['r1'],
      branchIds: ['b1'],
    });

    expect(result.id).toBe('u1');
    expect(usersRepository.save).toHaveBeenCalled();
  });
});
