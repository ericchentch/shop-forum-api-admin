import { ConfigService } from '@nestjs/config';

/*


 config for connection db and execute query
 author: @ericchentch
*/

export const config = () => {
  const configGlobal = new ConfigService();
  const DB_HOST = configGlobal.get<string>('DB_HOST');
  const DB_USERNAME = configGlobal.get<string>('DB_USERNAME');
  const DB_PASSWORD = configGlobal.get<string>('DB_PASSWORD');
  const DB_DATABASE_NAME = configGlobal.get<string>('DB_DATABASE_NAME');
  return {
    host: DB_HOST || '',
    user: DB_USERNAME || '',
    password: DB_PASSWORD || '',
    database: DB_DATABASE_NAME || '',
    ssl: {},
  };
};
