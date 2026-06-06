import 'dotenv/config';
import { DataSource } from 'typeorm';

import { configuration } from '../config/configuration';
import { AppointmentServiceEntity } from '../appointments/entities/appointment-service.entity';
import { AppointmentEntity } from '../appointments/entities/appointment.entity';
import { BranchEntity } from '../branches/entities/branch.entity';
import { ClientEntity } from '../clients/entities/client.entity';
import { CompanyEntity } from '../companies/entities/company.entity';
import { RoleEntity } from '../roles/entities/role.entity';
import { ScheduleEntity } from '../schedules/entities/schedule.entity';
import { ServiceEntity } from '../services/entities/service.entity';
import { UserEntity } from '../users/entities/user.entity';

const config = configuration();

console.log('DB Config:', {
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
});

export default new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,

  ssl: {
    rejectUnauthorized: false,
  },

  synchronize: false,
  logging: config.db.logging,

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

  migrations: ['src/database/migrations/*.ts'],
});