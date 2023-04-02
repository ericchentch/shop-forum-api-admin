import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryColumn({ type: 'varchar', length: 150 })
  permissionId: string;

  @Column({ type: 'varchar', length: 100 })
  permissionName: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  modified: Date;

  @Column('tinyint', { default: 1 })
  active: number;

  constructor() {
    this.active = 1;
    this.created = new Date();
    this.modified = new Date();
    this.permissionId = '';
    this.permissionName = '';
  }
}
