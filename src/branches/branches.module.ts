import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '../companies/companies.module';
import { BranchEntity } from './entities/branch.entity';
import { BranchesController } from './branches.controller';
import { BranchesRepository } from './branches.repository';
import { BranchesService } from './branches.service';

@Module({
  imports: [TypeOrmModule.forFeature([BranchEntity]), CompaniesModule],
  controllers: [BranchesController],
  providers: [BranchesService, BranchesRepository],
  exports: [BranchesService, BranchesRepository],
})
export class BranchesModule {}
