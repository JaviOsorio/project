export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  appName: process.env.APP_NAME ?? 'BarberConnect',
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  swaggerPath: process.env.SWAGGER_PATH ?? 'docs',
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'barberconnect',
    synchronize: (process.env.DB_SYNCHRONIZE ?? 'false') === 'true',
    logging: (process.env.DB_LOGGING ?? 'false') === 'true',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'change-me-access',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10),
});
