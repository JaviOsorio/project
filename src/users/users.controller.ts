import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleName } from '../common/enums/role-name.enum';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: [UserResponseDto] })
  findAll(@Query('companyId') companyId?: string) {
    return this.usersService.findAll(companyId);
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiCreatedResponse({ type: UserResponseDto })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiOkResponse({ type: UserResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
