import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  const appointmentServicesRepository = {
    save: jest.fn(),
  } as any;
  const appointmentsRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createEntity: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  } as any;
  const clientsRepository = { findById: jest.fn() } as any;
  const usersRepository = { findByIdWithRelations: jest.fn(), findById: jest.fn() } as any;
  const branchesRepository = { findById: jest.fn() } as any;
  const servicesRepository = { findById: jest.fn() } as any;
  const schedulesRepository = { findAll: jest.fn() } as any;
  const companiesRepository = { findById: jest.fn() } as any;

  let service: AppointmentsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AppointmentsService(
      appointmentServicesRepository,
      appointmentsRepository,
      clientsRepository,
      usersRepository,
      branchesRepository,
      servicesRepository,
      schedulesRepository,
      companiesRepository,
    );
  });

  it('creates an appointment and calculates total', async () => {
    clientsRepository.findById.mockResolvedValue({ id: 'cl1', companyId: 'c1' });
    usersRepository.findByIdWithRelations.mockResolvedValue({ id: 'u1', companyId: 'c1', branches: [{ id: 'b1' }] });
    usersRepository.findById.mockResolvedValue({ id: 'u1', companyId: 'c1' });
    branchesRepository.findById.mockResolvedValue({ id: 'b1', companyId: 'c1' });
    schedulesRepository.findAll.mockResolvedValue([{ startTime: '09:00', endTime: '18:00' }]);
    appointmentsRepository.findAll.mockResolvedValue([]);
    servicesRepository.findById.mockResolvedValue({ id: 's1', active: true, price: '20.00', name: 'Corte' });
    companiesRepository.findById.mockResolvedValue({ id: 'c1' });
    appointmentsRepository.createEntity.mockReturnValue({ id: 'a1' });
    appointmentsRepository.save.mockResolvedValue({ id: 'a1', total: '20.00' });
    appointmentServicesRepository.save.mockResolvedValue([{ id: 'as1' }]);

    const result = await service.create({
      clientId: 'cl1',
      employeeId: 'u1',
      branchId: 'b1',
      appointmentDate: '2026-06-01',
      startTime: '10:00',
      endTime: '10:30',
      services: [{ serviceId: 's1', quantity: 1 }],
    });

    expect(result.id).toBe('a1');
  });
});
