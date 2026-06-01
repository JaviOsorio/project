import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await this.usersService.validatePassword(user, dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.issueTokens(user);
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user.refreshTokenHash) {
      throw new ForbiddenException('Refresh token no válido');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      throw new ForbiddenException('Refresh token no válido');
    }

    return this.issueTokens(user);
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.usersService.setRefreshToken(userId, null);
    return { message: 'Sesión cerrada correctamente' };
  }

  profile(user: UserEntity) {
    return user;
  }

  async validateUser(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.usersService.findOne(payload.sub);
    if (!user?.active) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private async issueTokens(user: UserEntity) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map((role) => role.name) ?? [],
      companyId: user.companyId ?? null,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn') as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') as any,
    });

    await this.usersService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles?.map((role) => role.name) ?? [],
        companyId: user.companyId,
      },
    };
  }
}
