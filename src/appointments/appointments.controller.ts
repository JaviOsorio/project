import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleName } from '../common/enums/role-name.enum';
import { AppointmentResponseDto, CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { AppointmentsService } from './appointments.service';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOkResponse({ type: [AppointmentResponseDto] })
  findAll(@Query('companyId') companyId?: string) {
    return this.appointmentsService.findAll(companyId);
  }

  @Get(':id')
  @ApiOkResponse({ type: AppointmentResponseDto })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.EMPLOYEE, RoleName.CLIENT)
  @ApiCreatedResponse({ type: AppointmentResponseDto })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Patch(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.EMPLOYEE)
  @ApiOkResponse({ type: AppointmentResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
