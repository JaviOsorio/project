import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

import { EntityStatus } from '../../common/enums/entity-status.enum';

export class CreateBranchDto {
  @ApiProperty()
  @IsUUID()
  companyId!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(180)
  name!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  address!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @ApiPropertyOptional({ enum: EntityStatus })
  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;
}

export class BranchResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  companyId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  address!: string;

  @ApiPropertyOptional()
  phone?: string | null;

  @ApiProperty()
  status!: string;
}
