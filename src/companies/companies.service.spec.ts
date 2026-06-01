import { CompaniesService } from './companies.service';

describe('CompaniesService', () => {
  const companiesRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByNit: jest.fn(),
    createEntity: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  } as any;

  let service: CompaniesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CompaniesService(companiesRepository);
  });

  it('creates a company', async () => {
    companiesRepository.findByNit.mockResolvedValue(null);
    companiesRepository.createEntity.mockReturnValue({ id: 'c1' });
    companiesRepository.save.mockResolvedValue({ id: 'c1' });

    const result = await service.create({ name: 'Barber', nit: '900', phone: '123' });

    expect(result.id).toBe('c1');
    expect(companiesRepository.save).toHaveBeenCalled();
  });
});
