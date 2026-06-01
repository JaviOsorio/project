import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleName } from '../common/enums/role-name.enum';
import { BranchResponseDto, CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { BranchesService } from './branches.service';

@ApiTags('branches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  @ApiOkResponse({ type: [BranchResponseDto] })
  findAll(@Query('companyId') companyId?: string) {
    return this.branchesService.findAll(companyId);
  }

  @Get(':id')
  @ApiOkResponse({ type: BranchResponseDto })
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiCreatedResponse({ type: BranchResponseDto })
  create(@Body() dto: CreateBranchDto) {
    return this.branchesService.create(dto);
  }

  @Patch(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiOkResponse({ type: BranchResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.branchesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }
}
