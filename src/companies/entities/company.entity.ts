import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '../../shared/entities/base.entity';
import { BranchEntity } from '../../branches/entities/branch.entity';
import { ClientEntity } from '../../clients/entities/client.entity';
import { EntityStatus } from '../../common/enums/entity-status.enum';
import { ServiceEntity } from '../../services/entities/service.entity';
import { ScheduleEntity } from '../../schedules/entities/schedule.entity';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('companies')
export class CompanyEntity extends BaseEntity {
  @ApiProperty()
  @Index()
  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  nit!: string;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'varchar', length: 180, nullable: true })
  email?: string | null;

  @ApiProperty({ enum: EntityStatus })
  @Column({ type: 'enum', enum: EntityStatus, default: EntityStatus.ACTIVE })
  status!: EntityStatus;

  @OneToMany(() => BranchEntity, (branch) => branch.company)
  branches?: BranchEntity[];

  @OneToMany(() => UserEntity, (user) => user.company)
  users?: UserEntity[];

  @OneToMany(() => ClientEntity, (client) => client.company)
  clients?: ClientEntity[];

  @OneToMany(() => ServiceEntity, (service) => service.company)
  services?: ServiceEntity[];

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.company)
  schedules?: ScheduleEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.company)
  appointments?: AppointmentEntity[];
}
