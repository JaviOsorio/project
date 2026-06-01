import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleName } from '../common/enums/role-name.enum';
import { CreateServiceDto, ServiceResponseDto, UpdateServiceDto } from './dto/service.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOkResponse({ type: [ServiceResponseDto] })
  findAll(@Query('companyId') companyId?: string) {
    return this.servicesService.findAll(companyId);
  }

  @Get(':id')
  @ApiOkResponse({ type: ServiceResponseDto })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiCreatedResponse({ type: ServiceResponseDto })
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiOkResponse({ type: ServiceResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
