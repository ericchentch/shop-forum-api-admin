import { config } from 'src/common/mysql.common';
import { DataSource } from 'typeorm';

const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dbConfig = config();
      const dataSource = new DataSource({
        type: 'mysql',
        host: dbConfig.host,
        port: 3306,
        username: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        ssl: dbConfig.ssl,
      });

      return dataSource.initialize();
    },
  },
];

import { Module } from '@nestjs/common';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
