import { ConfigService } from '@nestjs/config';

export const env = () => {
  const configGlobal = new ConfigService();
  const DB_HOST = configGlobal.get<string>('DB_HOST');
  const DB_USERNAME = configGlobal.get<string>('DB_USERNAME');
  const DB_PASSWORD = configGlobal.get<string>('DB_PASSWORD');
  const DB_DATABASE_NAME = configGlobal.get<string>('DB_DATABASE_NAME');
  const DEFAULT_PASSWORD = configGlobal.get<string>('DEFAULT_PASSWORD');
  const NEXT_PUBLIC_SECRET_JWT_KEY = configGlobal.get<string>(
    'NEXT_PUBLIC_SECRET_JWT_KEY',
  );

  return {
    DB_DATABASE_NAME,
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DEFAULT_PASSWORD,
    NEXT_PUBLIC_SECRET_JWT_KEY,
  };
};
