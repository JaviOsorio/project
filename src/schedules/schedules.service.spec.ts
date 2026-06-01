import { SchedulesService } from './schedules.service';

describe('SchedulesService', () => {
  const schedulesRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createEntity: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  } as any;
  const usersRepository = { findByIdWithRelations: jest.fn(), findById: jest.fn() } as any;
  const branchesRepository = { findById: jest.fn() } as any;
  const companiesRepository = { findById: jest.fn() } as any;

  let service: SchedulesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SchedulesService(schedulesRepository, usersRepository, branchesRepository, companiesRepository);
  });

  it('creates a schedule', async () => {
    usersRepository.findByIdWithRelations.mockResolvedValue({ id: 'u1', companyId: 'c1', branches: [{ id: 'b1' }] });
    usersRepository.findById.mockResolvedValue({ id: 'u1', companyId: 'c1' });
    branchesRepository.findById.mockResolvedValue({ id: 'b1', companyId: 'c1' });
    companiesRepository.findById.mockResolvedValue({ id: 'c1' });
    schedulesRepository.findAll.mockResolvedValue([]);
    schedulesRepository.createEntity.mockReturnValue({ id: 'sc1' });
    schedulesRepository.save.mockResolvedValue({ id: 'sc1' });

    const result = await service.create({
      employeeId: 'u1',
      branchId: 'b1',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '18:00',
    });

    expect(result.id).toBe('sc1');
  });
});
