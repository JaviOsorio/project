import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BranchesModule } from '../branches/branches.module';
import { CompaniesModule } from '../companies/companies.module';
import { RolesModule } from '../roles/roles.module';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RolesModule, BranchesModule, CompaniesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
