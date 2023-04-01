import { DataSource } from 'typeorm';

const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const configGlobal = new ConfigService();
      const DB_HOST = configGlobal.get<string>('DB_HOST');
      const DB_USERNAME = configGlobal.get<string>('DB_USERNAME');
      const DB_PASSWORD = configGlobal.get<string>('DB_PASSWORD');
      const DB_DATABASE_NAME = configGlobal.get<string>('DB_DATABASE_NAME');
      const dataSource = new DataSource({
        type: 'mysql',
        host: DB_HOST,
        port: 3306,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        ssl: {},
      });

      return dataSource.initialize();
    },
  },
];

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
