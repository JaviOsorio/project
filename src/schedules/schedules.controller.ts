import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleName } from '../common/enums/role-name.enum';
import { CreateScheduleDto, ScheduleResponseDto, UpdateScheduleDto } from './dto/schedule.dto';
import { SchedulesService } from './schedules.service';

@ApiTags('schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiOkResponse({ type: [ScheduleResponseDto] })
  findAll(@Query('companyId') companyId?: string) {
    return this.schedulesService.findAll(companyId);
  }

  @Get(':id')
  @ApiOkResponse({ type: ScheduleResponseDto })
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.EMPLOYEE)
  @ApiCreatedResponse({ type: ScheduleResponseDto })
  create(@Body() dto: CreateScheduleDto) {
    return this.schedulesService.create(dto);
  }

  @Patch(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.EMPLOYEE)
  @ApiOkResponse({ type: ScheduleResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.schedulesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
}
