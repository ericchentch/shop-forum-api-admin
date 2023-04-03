import { Inject, Injectable } from '@nestjs/common';
import { BaseRepositorySql } from 'src/modules/shared/base.repository';
import { DataSource, Repository } from 'typeorm';
import { DisableFeature } from './disable_feature.entity';

export const DisFeatureRepoProvide = [
  {
    provide: 'DISABLE_FEATURE',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DisableFeature),
    inject: ['DATA_SOURCE'],
  },
];

export const ID_FIELD_DISABLE_FEATURE = 'id';

@Injectable()
export class DisableFeatureRepository extends BaseRepositorySql<DisableFeature> {
  constructor(
    @Inject('DISABLE_FEATURE')
    private disableFeatureRepo: Repository<DisableFeature>,
  ) {
    super();
    this.typeOrmRepository = this.disableFeatureRepo;
    this.fieldId = ID_FIELD_DISABLE_FEATURE;
    this.entity = DisableFeature;
    this.modified = 'modified';
  }
}
