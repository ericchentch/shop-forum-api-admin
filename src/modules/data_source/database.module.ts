import { DataSource } from 'typeorm';

const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const { DB_DATABASE_NAME, DB_HOST, DB_USERNAME, DB_PASSWORD, ENV } =
        env();
      const dataSource = new DataSource({
        type: 'mysql',
        host: DB_HOST,
        port: 3306,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: ENV === 'DEVELOPMENT',
        ssl: {},
        dropSchema: true,
      });

      return dataSource.initialize();
    },
  },
];

import { Module } from '@nestjs/common';
import { env } from 'src/constants/environment';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
