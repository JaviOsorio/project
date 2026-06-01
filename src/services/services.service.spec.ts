import { ServicesService } from './services.service';

describe('ServicesService', () => {
  const servicesRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createEntity: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  } as any;
  const companiesRepository = { findById: jest.fn() } as any;

  let service: ServicesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ServicesService(servicesRepository, companiesRepository);
  });

  it('creates a service', async () => {
    companiesRepository.findById.mockResolvedValue({ id: 'c1' });
    servicesRepository.createEntity.mockReturnValue({ id: 's1' });
    servicesRepository.save.mockResolvedValue({ id: 's1' });

    const result = await service.create({
      companyId: 'c1',
      name: 'Corte',
      durationMinutes: 30,
      price: '20.00',
    });

    expect(result.id).toBe('s1');
  });
});
