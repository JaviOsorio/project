import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { BranchesModule } from './branches/branches.module';
import { ClientsModule } from './clients/clients.module';
import { CompaniesModule } from './companies/companies.module';
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { SchedulesModule } from './schedules/schedules.module';
import { ServicesModule } from './services/services.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    CommonModule,
    AuthModule,
    RolesModule,
    CompaniesModule,
    BranchesModule,
    UsersModule,
    ClientsModule,
    ServicesModule,
    SchedulesModule,
    AppointmentsModule,
  ],
})
export class AppModule {}
