import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, Index } from 'typeorm';

import { BaseEntity } from '../../shared/entities/base.entity';
import { AppointmentEntity } from './appointment.entity';
import { ServiceEntity } from '../../services/entities/service.entity';

@Entity('appointment_services')
@Index(['appointmentId', 'serviceId'], { unique: false })
export class AppointmentServiceEntity extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  appointmentId!: string;

  @ManyToOne(() => AppointmentEntity, (appointment) => appointment.appointmentServices, { onDelete: 'CASCADE' })
  appointment!: AppointmentEntity;

  @ApiProperty()
  @Column({ type: 'uuid' })
  serviceId!: string;

  @ManyToOne(() => ServiceEntity, (service) => service.appointmentServices, { onDelete: 'RESTRICT' })
  service!: ServiceEntity;

  @ApiProperty()
  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @ApiProperty()
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: string;
}
