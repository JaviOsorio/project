import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BranchesModule } from '../branches/branches.module';
import { CompaniesModule } from '../companies/companies.module';
import { UsersModule } from '../users/users.module';
import { ScheduleEntity } from './entities/schedule.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesRepository } from './schedules.repository';
import { SchedulesService } from './schedules.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEntity]), UsersModule, BranchesModule, CompaniesModule],
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulesRepository],
  exports: [SchedulesService, SchedulesRepository],
})
export class SchedulesModule {}
