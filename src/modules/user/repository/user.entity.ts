import { convertToDateTimeSql } from 'src/libs';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
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

  @Column('datetime', { default: convertToDateTimeSql(new Date()) })
  created: Date;

  @Column('datetime', { nullable: true })
  modified: Date | null;

  @Column('tinyint', { default: 1 })
  active: number;

  constructor() {
    (this.active = 1), (this.created = new Date());
    (this.email = ''), (this.modified = null);
    (this.name = ''), (this.password = '');
    this.phone = '';
    (this.userId = ''), (this.username = '');
  }
}
