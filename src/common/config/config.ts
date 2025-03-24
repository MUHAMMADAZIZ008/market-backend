import { ConfigService } from '@nestjs/config';
export type ConfigType = {
  APP_PORT: string;
  ACCESS_TOKEN_KEY: string;
  ACCESS_TOKEN_TIME: string;
  REFRESH_TOKEN_KEY: string;
  REFRESH_TOKEN_TIME: string;
  MONGO_URL: string;
  EMAIL_PORT: string
  EMAIL_HOST: string;
  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
};
export const config = (): ConfigType => {
  const configService = new ConfigService();
  return {
    APP_PORT: configService.get<string>('APP_PORT', '3000'),
    ACCESS_TOKEN_KEY: configService.get<string>(
      'ACCESS_TOKEN_KEY',
      'QWERTYUIOP',
    ),
    ACCESS_TOKEN_TIME: configService.get<string>('ACCESS_TOKEN_TIME', '5d'),
    REFRESH_TOKEN_KEY: configService.get<string>(
      'REFRESH_TOKEN_KEY',
      'QWERTYUIOP123456',
    ),
    REFRESH_TOKEN_TIME: configService.get<string>('REFRESH_TOKEN_TIME', '10d'),
    MONGO_URL: configService.get<string>(
      'MONGO_URL',
      'mongodb://localhost:27017/market-app',
    ),
    EMAIL_HOST: configService.get<string>('EMAIL_HOST', ''),
    EMAIL_PORT: configService.get<string>('EMAIL_PORT', ''),
    EMAIL_USERNAME: configService.get<string>('EMAIL_USERNAME', ''),
    EMAIL_PASSWORD: configService.get<string>('EMAIL_PASSWORD', ''),
  };
};
