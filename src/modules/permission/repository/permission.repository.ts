import { Inject, Injectable } from '@nestjs/common';
import { BaseRepositorySql } from 'src/modules/shared/base.repository';
import { DataSource, Repository } from 'typeorm';
import { Permission } from './permission.entity';

export const PermissionRepositoryProvide = [
  {
    provide: 'PERMISSION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Permission),
    inject: ['DATA_SOURCE'],
  },
];

export const ID_FIELD_PERMISSION = 'permissionId';

@Injectable()
export class PermissionRepository extends BaseRepositorySql<Permission> {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private permissionRepo: Repository<Permission>,
  ) {
    super();
    this.typeOrmRepository = this.permissionRepo;
    this.fieldId = ID_FIELD_PERMISSION;
    this.entity = Permission;
    this.modified = 'modified';
  }
}
