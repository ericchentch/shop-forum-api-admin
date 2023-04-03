import { Module } from '@nestjs/common';
import { DatabaseModule } from '../data_source/database.module';
import { FeatureController } from './controller/feature.controller';
import {
  DisFeatureRepoProvide,
  DisableFeatureRepository,
} from './repository/disable_feature.repository';
import { FeatureService } from './service/feature.service';

@Module({
  controllers: [FeatureController],
  providers: [
    FeatureService,
    DisableFeatureRepository,
    ...DisFeatureRepoProvide,
  ],
  imports: [DatabaseModule],
})
export class FeatureModule {}
