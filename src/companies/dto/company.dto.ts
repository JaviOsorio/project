import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @MaxLength(180)
  name!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nit!: string;

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
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}

export class CompanyResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  nit!: string;

  @ApiPropertyOptional()
  phone?: string | null;

  @ApiPropertyOptional()
  email?: string | null;

  @ApiProperty()
  status!: string;
}
