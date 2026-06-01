import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleName } from '../common/enums/role-name.enum';
import { ClientResponseDto, CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { ClientsService } from './clients.service';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOkResponse({ type: [ClientResponseDto] })
  findAll(@Query('companyId') companyId?: string) {
    return this.clientsService.findAll(companyId);
  }

  @Get(':id')
  @ApiOkResponse({ type: ClientResponseDto })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.EMPLOYEE)
  @ApiCreatedResponse({ type: ClientResponseDto })
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Patch(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.EMPLOYEE)
  @ApiOkResponse({ type: ClientResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
