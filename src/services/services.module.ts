import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '../companies/companies.module';
import { ServiceEntity } from './entities/service.entity';
import { ServicesController } from './services.controller';
import { ServicesRepository } from './services.repository';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity]), CompaniesModule],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService, ServicesRepository],
})
export class ServicesModule {}
