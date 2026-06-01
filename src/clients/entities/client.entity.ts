import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../shared/entities/base.entity';
import { CompanyEntity } from '../../companies/entities/company.entity';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';

@Entity('clients')
export class ClientEntity extends BaseEntity {
  @ApiProperty()
  @Index()
  @Column({ type: 'varchar', length: 50 })
  document!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'varchar', length: 180, nullable: true })
  email?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @ApiProperty()
  @Column({ type: 'uuid' })
  companyId!: string;

  @ManyToOne(() => CompanyEntity, (company) => company.clients, { onDelete: 'CASCADE' })
  company!: CompanyEntity;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.client)
  appointments?: AppointmentEntity[];
}
