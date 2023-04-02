import { Module } from '@nestjs/common';
import { DatabaseModule } from '../data_source/database.module';
import { PermissionController } from './controller/permission.controller';
import {
  PermissionRepository,
  PermissionRepositoryProvide,
} from './repository/permission.repository';
import { PermissionService } from './service/permission.service';

@Module({
  controllers: [PermissionController],
  providers: [
    PermissionService,
    PermissionRepository,
    ...PermissionRepositoryProvide,
  ],
  imports: [DatabaseModule],
})
export class PermissionModule {}
