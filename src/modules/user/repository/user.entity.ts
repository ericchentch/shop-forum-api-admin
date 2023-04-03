import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryColumn({ type: 'varchar', length: 150 })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ unique: true, length: 21, type: 'varchar' })
  username: string;

  @Column({ length: 150, type: 'varchar' })
  password: string;

  @Column({ unique: true, length: 20, type: 'varchar' })
  phone: string;

  @Column({ unique: true, length: 100, type: 'varchar' })
  email: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  modified: Date;

  @Column('tinyint', { default: 1 })
  active: number;

  constructor() {
    this.active = 1;
    this.created = new Date();
    this.email = '';
    this.modified = new Date();
    this.name = '';
    this.password = '';
    this.phone = '';
    this.userId = '';
    this.username = '';
  }
}
