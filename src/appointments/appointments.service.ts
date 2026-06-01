import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BranchesRepository } from '../branches/branches.repository';
import { ClientsRepository } from '../clients/clients.repository';
import { CompaniesRepository } from '../companies/companies.repository';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';
import { DayOfWeek } from '../common/enums/day-of-week.enum';
import { rangesOverlap, timeToMinutes } from '../shared/utils/time-range.util';
import { SchedulesRepository } from '../schedules/schedules.repository';
import { ServicesRepository } from '../services/services.repository';
import { UsersRepository } from '../users/users.repository';
import { AppointmentServiceEntity } from './entities/appointment-service.entity';
import { AppointmentEntity } from './entities/appointment.entity';
import { AppointmentsRepository } from './appointments.repository';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentServiceEntity)
    private readonly appointmentServicesRepository: Repository<AppointmentServiceEntity>,
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly clientsRepository: ClientsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly branchesRepository: BranchesRepository,
    private readonly servicesRepository: ServicesRepository,
    private readonly schedulesRepository: SchedulesRepository,
    private readonly companiesRepository: CompaniesRepository,
  ) {}

  findAll(companyId?: string): Promise<AppointmentEntity[]> {
    return this.appointmentsRepository.findAll({ where: companyId ? { companyId } : undefined });
  }

  findOne(id: string): Promise<AppointmentEntity> {
    return this.appointmentsRepository.findById(id);
  }

  async create(dto: CreateAppointmentDto): Promise<AppointmentEntity> {
    await this.ensureRelations(dto.clientId, dto.employeeId, dto.branchId);
    await this.ensureAvailability(dto.employeeId, dto.branchId, dto.appointmentDate, dto.startTime, dto.endTime);

    const appointmentServices = await this.buildAppointmentServices(dto.services ?? []);
    const total = appointmentServices.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const inferredCompanyId = await this.inferCompanyId(dto.clientId, dto.employeeId, dto.branchId);
    if (dto.companyId && dto.companyId !== inferredCompanyId) {
      throw new BadRequestException('La empresa de la cita no coincide con las relaciones del cliente, empleado y sucursal');
    }

    const appointment = this.appointmentsRepository.createEntity({
      clientId: dto.clientId,
      employeeId: dto.employeeId,
      branchId: dto.branchId,
      appointmentDate: dto.appointmentDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: dto.status ?? AppointmentStatus.PENDING,
      total: total.toFixed(2),
      companyId: dto.companyId ?? inferredCompanyId,
    });
    const savedAppointment = await this.appointmentsRepository.save(appointment);

    if (appointmentServices.length > 0) {
      const rows = appointmentServices.map((item) => ({
        ...item,
        appointmentId: savedAppointment.id,
        appointment: savedAppointment,
      }));
      savedAppointment.appointmentServices = await this.appointmentServicesRepository.save(rows);
    }

    return savedAppointment;
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<AppointmentEntity> {
    const appointment = await this.findOne(id);
    const employeeId = dto.employeeId ?? appointment.employeeId;
    const branchId = dto.branchId ?? appointment.branchId;
    const appointmentDate = dto.appointmentDate ?? appointment.appointmentDate;
    const startTime = dto.startTime ?? appointment.startTime;
    const endTime = dto.endTime ?? appointment.endTime;

    await this.ensureRelations(dto.clientId ?? appointment.clientId, employeeId, branchId);
    await this.ensureAvailability(employeeId, branchId, appointmentDate, startTime, endTime, id);
    const inferredCompanyId = await this.inferCompanyId(dto.clientId ?? appointment.clientId, employeeId, branchId);
    if (dto.companyId && dto.companyId !== inferredCompanyId) {
      throw new BadRequestException('La empresa de la cita no coincide con las relaciones del cliente, empleado y sucursal');
    }

    Object.assign(appointment, {
      clientId: dto.clientId ?? appointment.clientId,
      employeeId,
      branchId,
      appointmentDate,
      startTime,
      endTime,
      status: dto.status ?? appointment.status,
      companyId: dto.companyId ?? inferredCompanyId,
    });

    if (dto.services) {
      const appointmentServices = await this.buildAppointmentServices(dto.services);
      const total = appointmentServices.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
      appointment.total = total.toFixed(2);
      const savedAppointment = await this.appointmentsRepository.save(appointment);
      const rows = appointmentServices.map((item) => ({
        ...item,
        appointmentId: savedAppointment.id,
        appointment: savedAppointment,
      }));
      savedAppointment.appointmentServices = await this.appointmentServicesRepository.save(rows);
      return savedAppointment;
    }

    return this.appointmentsRepository.save(appointment);
  }

  remove(id: string): Promise<void> {
    return this.appointmentsRepository.softDelete(id);
  }

  private async ensureRelations(clientId: string, employeeId: string, branchId: string): Promise<void> {
    const [client, employee, branch] = await Promise.all([
      this.clientsRepository.findById(clientId).catch(() => null),
      this.usersRepository.findByIdWithRelations(employeeId).catch(() => null),
      this.branchesRepository.findById(branchId).catch(() => null),
    ]);

    if (!client || !employee || !branch) {
      throw new NotFoundException('Cliente, empleado o sucursal no encontrados');
    }

    const belongsToBranch = employee.branches?.some((employeeBranch) => employeeBranch.id === branch.id);
    if (!belongsToBranch) {
      throw new BadRequestException('El empleado no pertenece a la sucursal');
    }

    if (client.companyId !== branch.companyId || employee.companyId !== branch.companyId) {
      throw new BadRequestException('Cliente, empleado y sucursal deben pertenecer a la misma empresa');
    }
  }

  private async ensureAvailability(
    employeeId: string,
    branchId: string,
    appointmentDate: string,
    startTime: string,
    endTime: string,
    ignoreId?: string,
  ): Promise<void> {
    if (startTime >= endTime) {
      throw new BadRequestException('La hora de inicio debe ser menor que la hora fin');
    }

    const dayOfWeek = new Date(`${appointmentDate}T00:00:00`).getDay() as DayOfWeek;
    const schedules = await this.schedulesRepository.findAll({
      where: { employeeId, branchId, dayOfWeek },
    });

    if (!schedules.length) {
      throw new BadRequestException('El empleado no tiene horario disponible en esa fecha');
    }

    const isWithinSchedule = schedules.some(
      (schedule) =>
        timeToMinutes(startTime) >= timeToMinutes(schedule.startTime) &&
        timeToMinutes(endTime) <= timeToMinutes(schedule.endTime),
    );

    if (!isWithinSchedule) {
      throw new BadRequestException('La cita esta fuera del horario disponible');
    }

    const overlappingAppointments = await this.appointmentsRepository.findAll({
      where: { employeeId, appointmentDate },
    });

    const hasOverlap = overlappingAppointments.some(
      (appointment) =>
        appointment.id !== ignoreId &&
        appointment.status !== AppointmentStatus.CANCELLED &&
        rangesOverlap(appointment.startTime, appointment.endTime, startTime, endTime),
    );

    if (hasOverlap) {
      throw new BadRequestException('La cita se traslapa con otra existente');
    }
  }

  private async buildAppointmentServices(
    services: Array<{ serviceId: string; quantity: number }>,
  ): Promise<AppointmentServiceEntity[]> {
    const result: AppointmentServiceEntity[] = [];

    for (const item of services) {
      const service = await this.servicesRepository.findById(item.serviceId);
      if (!service.active) {
        throw new BadRequestException(`El servicio ${service.name} esta inactivo`);
      }

      const appointmentService = new AppointmentServiceEntity();
      appointmentService.serviceId = service.id;
      appointmentService.quantity = item.quantity;
      appointmentService.price = service.price;
      result.push(appointmentService);
    }

    return result;
  }

  private async inferCompanyId(clientId: string, employeeId: string, branchId: string): Promise<string> {
    const [client, employee, branch] = await Promise.all([
      this.clientsRepository.findById(clientId),
      this.usersRepository.findById(employeeId),
      this.branchesRepository.findById(branchId),
    ]);

    const companyId = client.companyId ?? employee.companyId ?? branch.companyId;
    if (!companyId) {
      throw new NotFoundException('No fue posible determinar la empresa');
    }

    const company = await this.companiesRepository.findById(companyId).catch(() => null);
    if (!company) {
      throw new NotFoundException('La empresa no existe');
    }
    return company.id;
  }
}
