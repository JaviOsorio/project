import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret') as string,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.usersService.findOne(payload.sub);
      if (!user.active) {
        throw new UnauthorizedException();
      }
      return {
        id: user.id,
        email: user.email,
        roles: user.roles?.map((role) => role.name) ?? payload.roles,
        companyId: user.companyId ?? payload.companyId,
        refreshToken: true,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
