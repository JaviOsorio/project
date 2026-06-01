import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, Index } from 'typeorm';

import { BaseEntity } from '../../shared/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @ApiProperty()
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users?: UserEntity[];
}
