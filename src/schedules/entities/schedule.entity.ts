import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, Index } from 'typeorm';

import { BranchEntity } from '../../branches/entities/branch.entity';
import { CompanyEntity } from '../../companies/entities/company.entity';
import { DayOfWeek } from '../../common/enums/day-of-week.enum';
import { BaseEntity } from '../../shared/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('schedules')
@Index(['employeeId', 'branchId', 'dayOfWeek'], { unique: false })
export class ScheduleEntity extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  employeeId!: string;

  @ManyToOne(() => UserEntity, (user) => user.schedules, { onDelete: 'CASCADE' })
  employee!: UserEntity;

  @ApiProperty()
  @Column({ type: 'uuid' })
  branchId!: string;

  @ManyToOne(() => BranchEntity, { onDelete: 'CASCADE' })
  branch!: BranchEntity;

  @ApiProperty({ enum: DayOfWeek })
  @Column({ type: 'smallint' })
  dayOfWeek!: DayOfWeek;

  @ApiProperty()
  @Column({ type: 'time' })
  startTime!: string;

  @ApiProperty()
  @Column({ type: 'time' })
  endTime!: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  companyId!: string;

  @ManyToOne(() => CompanyEntity, (company) => company.schedules, { onDelete: 'CASCADE' })
  company!: CompanyEntity;
}
