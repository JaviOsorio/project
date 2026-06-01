import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BranchEntity } from '../../branches/entities/branch.entity';
import { CompanyEntity } from '../../companies/entities/company.entity';
import { BaseEntity } from '../../shared/entities/base.entity';
import { RoleEntity } from '../../roles/entities/role.entity';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';
import { ScheduleEntity } from '../../schedules/entities/schedule.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 180, unique: true })
  email!: string;

  @Exclude()
  @ApiProperty({ writeOnly: true })
  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string | null;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Exclude()
  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'text', nullable: true })
  refreshTokenHash?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'uuid', nullable: true })
  companyId?: string | null;

  @ManyToOne(() => CompanyEntity, (company) => company.users, { nullable: true, onDelete: 'SET NULL' })
  company?: CompanyEntity | null;

  @ManyToMany(() => RoleEntity, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles!: RoleEntity[];

  @ManyToMany(() => BranchEntity, (branch) => branch.users, { eager: true })
  @JoinTable({
    name: 'user_branches',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'branch_id', referencedColumnName: 'id' },
  })
  branches!: BranchEntity[];

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.employee)
  schedules?: ScheduleEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.employee)
  appointments?: AppointmentEntity[];
}
