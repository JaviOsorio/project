import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BranchesModule } from '../branches/branches.module';
import { ClientsModule } from '../clients/clients.module';
import { CompaniesModule } from '../companies/companies.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { ServicesModule } from '../services/services.module';
import { UsersModule } from '../users/users.module';
import { AppointmentServiceEntity } from './entities/appointment-service.entity';
import { AppointmentEntity } from './entities/appointment.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentEntity, AppointmentServiceEntity]),
    ClientsModule,
    UsersModule,
    BranchesModule,
    ServicesModule,
    SchedulesModule,
    CompaniesModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepository],
  exports: [AppointmentsService, AppointmentsRepository],
})
export class AppointmentsModule {}
