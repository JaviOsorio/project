import { Global, Module } from '@nestjs/common';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { RolesGuard } from './guards/roles.guard';

@Global()
@Module({
  providers: [JwtAuthGuard, RefreshJwtGuard, RolesGuard],
  exports: [JwtAuthGuard, RefreshJwtGuard, RolesGuard],
})
export class CommonModule {}
