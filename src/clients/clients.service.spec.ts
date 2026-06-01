import { ClientsService } from './clients.service';

describe('ClientsService', () => {
  const clientsRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createEntity: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  } as any;
  const companiesRepository = { findById: jest.fn() } as any;

  let service: ClientsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ClientsService(clientsRepository, companiesRepository);
  });

  it('creates a client', async () => {
    companiesRepository.findById.mockResolvedValue({ id: 'c1' });
    clientsRepository.createEntity.mockReturnValue({ id: 'cl1' });
    clientsRepository.save.mockResolvedValue({ id: 'cl1' });

    const result = await service.create({
      companyId: 'c1',
      document: '123',
      firstName: 'Jane',
      lastName: 'Doe',
    });

    expect(result.id).toBe('cl1');
  });
});
