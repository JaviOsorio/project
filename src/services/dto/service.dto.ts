import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString, IsUUID, Min, MaxLength } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  @MaxLength(180)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @ApiProperty()
  @IsNumberString()
  price!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty()
  @IsUUID()
  companyId!: string;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class ServiceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  durationMinutes!: number;
}
