import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { BranchesRepository } from '../branches/branches.repository';
import { CompaniesRepository } from '../companies/companies.repository';
import { DayOfWeek } from '../common/enums/day-of-week.enum';
import { rangesOverlap } from '../shared/utils/time-range.util';
import { UsersRepository } from '../users/users.repository';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { ScheduleEntity } from './entities/schedule.entity';
import { SchedulesRepository } from './schedules.repository';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly schedulesRepository: SchedulesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly branchesRepository: BranchesRepository,
    private readonly companiesRepository: CompaniesRepository,
  ) {}

  findAll(companyId?: string): Promise<ScheduleEntity[]> {
    return this.schedulesRepository.findAll({ where: companyId ? { companyId } : undefined });
  }

  findOne(id: string): Promise<ScheduleEntity> {
    return this.schedulesRepository.findById(id);
  }

  async create(dto: CreateScheduleDto): Promise<ScheduleEntity> {
    await this.ensureEmployeeAndBranch(dto.employeeId, dto.branchId);
    await this.ensureNoOverlap(dto.employeeId, dto.branchId, dto.dayOfWeek, dto.startTime, dto.endTime);

    const inferredCompanyId = await this.inferCompanyId(dto.employeeId, dto.branchId);
    if (dto.companyId && dto.companyId !== inferredCompanyId) {
      throw new BadRequestException('La empresa del horario no coincide con las relaciones del empleado y la sucursal');
    }

    return this.schedulesRepository.save(
      this.schedulesRepository.createEntity({
        ...dto,
        companyId: dto.companyId ?? inferredCompanyId,
      }),
    );
  }

  async update(id: string, dto: UpdateScheduleDto): Promise<ScheduleEntity> {
    const schedule = await this.findOne(id);
    const employeeId = dto.employeeId ?? schedule.employeeId;
    const branchId = dto.branchId ?? schedule.branchId;
    const dayOfWeek = dto.dayOfWeek ?? schedule.dayOfWeek;
    const startTime = dto.startTime ?? schedule.startTime;
    const endTime = dto.endTime ?? schedule.endTime;
    await this.ensureEmployeeAndBranch(employeeId, branchId);
    await this.ensureNoOverlap(employeeId, branchId, dayOfWeek, startTime, endTime, id);
    const inferredCompanyId = await this.inferCompanyId(employeeId, branchId);
    if (dto.companyId && dto.companyId !== inferredCompanyId) {
      throw new BadRequestException('La empresa del horario no coincide con las relaciones del empleado y la sucursal');
    }

    Object.assign(schedule, {
      ...dto,
      companyId: dto.companyId ?? inferredCompanyId,
    });
    return this.schedulesRepository.save(schedule);
  }

  remove(id: string): Promise<void> {
    return this.schedulesRepository.softDelete(id);
  }

  private async ensureEmployeeAndBranch(employeeId: string, branchId: string): Promise<void> {
    const [employee, branch] = await Promise.all([
      this.usersRepository.findByIdWithRelations(employeeId).catch(() => null),
      this.branchesRepository.findById(branchId).catch(() => null),
    ]);

    if (!employee || !branch) {
      throw new NotFoundException('Empleado o sucursal no encontrados');
    }

    const belongsToBranch = employee.branches?.some((employeeBranch) => employeeBranch.id === branch.id);
    if (!belongsToBranch) {
      throw new BadRequestException('El empleado no pertenece a la sucursal');
    }

    if (employee.companyId && branch.companyId && employee.companyId !== branch.companyId) {
      throw new BadRequestException('El empleado y la sucursal deben pertenecer a la misma empresa');
    }
  }

  private async ensureNoOverlap(
    employeeId: string,
    branchId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    ignoreId?: string,
  ): Promise<void> {
    if (startTime >= endTime) {
      throw new BadRequestException('La hora de inicio debe ser menor que la hora fin');
    }

    const schedules = await this.schedulesRepository.findAll({
      where: { employeeId, branchId, dayOfWeek },
    });

    const hasOverlap = schedules.some((schedule) => schedule.id !== ignoreId && rangesOverlap(schedule.startTime, schedule.endTime, startTime, endTime));
    if (hasOverlap) {
      throw new BadRequestException('El horario se traslapa con otro existente');
    }
  }

  private async inferCompanyId(employeeId: string, branchId: string): Promise<string> {
    const [employee, branch] = await Promise.all([
      this.usersRepository.findById(employeeId),
      this.branchesRepository.findById(branchId),
    ]);

    const companyId = employee.companyId ?? branch.companyId;
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
