import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, Index } from 'typeorm';

import { BranchEntity } from '../../branches/entities/branch.entity';
import { ClientEntity } from '../../clients/entities/client.entity';
import { CompanyEntity } from '../../companies/entities/company.entity';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';
import { BaseEntity } from '../../shared/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { AppointmentServiceEntity } from './appointment-service.entity';

@Entity('appointments')
@Index(['employeeId', 'appointmentDate', 'startTime', 'endTime'])
export class AppointmentEntity extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  clientId!: string;

  @ManyToOne(() => ClientEntity, (client) => client.appointments, { onDelete: 'CASCADE' })
  client!: ClientEntity;

  @ApiProperty()
  @Column({ type: 'uuid' })
  employeeId!: string;

  @ManyToOne(() => UserEntity, (user) => user.appointments, { onDelete: 'CASCADE' })
  employee!: UserEntity;

  @ApiProperty()
  @Column({ type: 'uuid' })
  branchId!: string;

  @ManyToOne(() => BranchEntity, { onDelete: 'CASCADE' })
  branch!: BranchEntity;

  @ApiProperty()
  @Column({ type: 'date' })
  appointmentDate!: string;

  @ApiProperty()
  @Column({ type: 'time' })
  startTime!: string;

  @ApiProperty()
  @Column({ type: 'time' })
  endTime!: string;

  @ApiProperty({ type: Number })
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  total!: string;

  @ApiProperty({ enum: AppointmentStatus })
  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  status!: AppointmentStatus;

  @ApiProperty()
  @Column({ type: 'uuid' })
  companyId!: string;

  @ManyToOne(() => CompanyEntity, (company) => company.appointments, { onDelete: 'CASCADE' })
  company!: CompanyEntity;

  @OneToMany(() => AppointmentServiceEntity, (appointmentService) => appointmentService.appointment, {
    cascade: true,
    eager: true,
  })
  appointmentServices!: AppointmentServiceEntity[];
}
