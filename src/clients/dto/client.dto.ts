import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  document!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  lastName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(180)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty()
  @IsUUID()
  companyId!: string;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}

export class ClientResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  document!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;
}
