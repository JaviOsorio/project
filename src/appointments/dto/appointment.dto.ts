import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsUUID, Matches, Min, ValidateNested } from 'class-validator';

import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

export class AppointmentServiceItemDto {
  @ApiProperty()
  @IsUUID()
  serviceId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateAppointmentDto {
  @ApiProperty()
  @IsUUID()
  clientId!: string;

  @ApiProperty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty()
  @IsUUID()
  branchId!: string;

  @ApiProperty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  appointmentDate!: string;

  @ApiProperty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  startTime!: string;

  @ApiProperty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  endTime!: string;

  @ApiPropertyOptional({ type: [AppointmentServiceItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppointmentServiceItemDto)
  services?: AppointmentServiceItemDto[];

  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  companyId?: string;
}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}

export class AppointmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  clientId!: string;

  @ApiProperty()
  employeeId!: string;

  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  total!: string;
}
