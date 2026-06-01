import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  const usersService = {
    findByEmail: jest.fn(),
    findOne: jest.fn(),
    validatePassword: jest.fn(),
    setRefreshToken: jest.fn(),
  } as any;
  const jwtService = {
    signAsync: jest.fn(),
  } as any;
  const configService = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        'jwt.accessSecret': 'access',
        'jwt.accessExpiresIn': '15m',
        'jwt.refreshSecret': 'refresh',
        'jwt.refreshExpiresIn': '7d',
      };
      return values[key];
    }),
  } as unknown as ConfigService;

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(usersService, jwtService, configService);
  });

  it('login returns tokens', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'admin@barber.com',
      password: 'hashed',
      active: true,
      roles: [{ name: 'ADMIN' }],
      firstName: 'Admin',
      lastName: 'User',
      companyId: 'c1',
    });
    usersService.validatePassword.mockResolvedValue(true);
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    const result = await service.login({ email: 'admin@barber.com', password: 'secret123' });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(usersService.setRefreshToken).toHaveBeenCalledWith('u1', 'refresh-token');
  });

  it('refresh validates stored token', async () => {
    usersService.findOne.mockResolvedValue({
      id: 'u1',
      refreshTokenHash: 'hash',
      active: true,
      roles: [{ name: 'ADMIN' }],
      email: 'admin@barber.com',
      firstName: 'Admin',
      lastName: 'User',
      companyId: 'c1',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    const result = await service.refresh('u1', 'refresh-token');

    expect(result.accessToken).toBe('access-token');
    expect(usersService.setRefreshToken).toHaveBeenCalledWith('u1', 'refresh-token');
  });
});
