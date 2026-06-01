import { BranchesService } from './branches.service';

describe('BranchesService', () => {
  const branchesRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createEntity: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  } as any;
  const companiesRepository = {
    findById: jest.fn(),
  } as any;

  let service: BranchesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BranchesService(branchesRepository, companiesRepository);
  });

  it('creates a branch when company exists', async () => {
    companiesRepository.findById.mockResolvedValue({ id: 'c1' });
    branchesRepository.createEntity.mockReturnValue({ id: 'b1' });
    branchesRepository.save.mockResolvedValue({ id: 'b1' });

    const result = await service.create({
      companyId: 'c1',
      name: 'Centro',
      address: 'Street 1',
    });

    expect(result.id).toBe('b1');
  });
});
