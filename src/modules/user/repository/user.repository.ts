import { Inject, Injectable } from '@nestjs/common';
import { BaseRepositorySql } from 'src/modules/shared/base.repository';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

export const UserRepositoryProvide = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];

export const ID_FIELD_USER = 'userId';

@Injectable()
export class UserRepository extends BaseRepositorySql<User> {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {
    super();
    this.typeOrmRepository = this.userRepository;
    this.fieldId = ID_FIELD_USER;
    this.entity = User;
    this.modified = 'modified';
  }
}
