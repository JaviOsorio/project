import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, ManyToOne, ManyToMany } from 'typeorm';

import { BaseEntity } from '../../shared/entities/base.entity';
import { CompanyEntity } from '../../companies/entities/company.entity';
import { EntityStatus } from '../../common/enums/entity-status.enum';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('branches')
export class BranchEntity extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  companyId!: string;

  @ManyToOne(() => CompanyEntity, (company) => company.branches, { onDelete: 'CASCADE' })
  company!: CompanyEntity;

  @ApiProperty()
  @Index()
  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  address!: string;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string | null;

  @ApiProperty({ enum: EntityStatus })
  @Column({ type: 'enum', enum: EntityStatus, default: EntityStatus.ACTIVE })
  status!: EntityStatus;

  @ManyToMany(() => UserEntity, (user) => user.branches)
  users?: UserEntity[];
}
