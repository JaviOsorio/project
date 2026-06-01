import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../shared/entities/base.entity';
import { CompanyEntity } from '../../companies/entities/company.entity';
import { AppointmentServiceEntity } from '../../appointments/entities/appointment-service.entity';

@Entity('services')
export class ServiceEntity extends BaseEntity {
  @ApiProperty()
  @Index()
  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @ApiProperty()
  @Column({ type: 'int' })
  durationMinutes!: number;

  @ApiProperty()
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @ApiProperty()
  @Column({ type: 'uuid' })
  companyId!: string;

  @ManyToOne(() => CompanyEntity, (company) => company.services, { onDelete: 'CASCADE' })
  company!: CompanyEntity;

  @OneToMany(() => AppointmentServiceEntity, (appointmentService) => appointmentService.service)
  appointmentServices?: AppointmentServiceEntity[];
}
