import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentServiceEntity } from '../appointments/entities/appointment-service.entity';
import { AppointmentEntity } from '../appointments/entities/appointment.entity';
import { BranchEntity } from '../branches/entities/branch.entity';
import { ClientEntity } from '../clients/entities/client.entity';
import { CompanyEntity } from '../companies/entities/company.entity';
import { RoleEntity } from '../roles/entities/role.entity';
import { ScheduleEntity } from '../schedules/entities/schedule.entity';
import { ServiceEntity } from '../services/entities/service.entity';
import { UserEntity } from '../users/entities/user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [
          CompanyEntity,
          BranchEntity,
          RoleEntity,
          UserEntity,
          ClientEntity,
          ServiceEntity,
          ScheduleEntity,
          AppointmentEntity,
          AppointmentServiceEntity,
        ],
        synchronize: configService.get<boolean>('db.synchronize') ?? false,
        logging: configService.get<boolean>('db.logging') ?? false,
        autoLoadEntities: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
