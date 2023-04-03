import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'disable_feature' })
export class DisableFeature {
  @PrimaryColumn({ type: 'varchar', length: 150 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  featureEndpoint: string;

  @Column({ type: 'varchar', length: 100 })
  featureName: string;
}
