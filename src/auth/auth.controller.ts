import { Body, Controller, Get, Headers, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RefreshJwtGuard } from '../common/guards/refresh-jwt.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthResponseDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  @ApiOkResponse({ type: AuthResponseDto })
  refresh(@Req() req: any, @Headers('authorization') authorization?: string) {
    return this.authService.refresh(req.user.id, authorization?.replace('Bearer ', '') ?? '');
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  profile(@CurrentUser() user: any) {
    return this.authService.profile(user);
  }
}
