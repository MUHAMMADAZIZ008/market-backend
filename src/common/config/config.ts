interface ConfigType {
  APP_PORT: string;
  ACCESS_TOKEN_KEY: string;
  ACCESS_TOKEN_TIME: string;
  REFRESH_TOKEN_KEY: string;
  REFRESH_TOKEN_TIME: string;
  MONGO_URL: string;
  EMAIL_HOST: string;
  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
}

export const config: ConfigType = {
  APP_PORT: process.env.APP_PORT || '3000',
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY || 'QWERTYUIOP',
  ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME || '5d',
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY || 'QWERTYUIOP123456',
  REFRESH_TOKEN_TIME: process.env.REFRESH_TOKEN_TIME || '10d',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/market-app',
  EMAIL_HOST: process.env.EMAIL_HOST || '',
  EMAIL_USERNAME: process.env.EMAIL_USERNAME || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
};
