import { Module } from '@nestjs/common';
import { DatabaseModule } from '../data_source/database.module';
import { UserController } from './controller/user.controller';
import {
  UserRepository,
  UserRepositoryProvide,
} from './repository/user.repository';
import { UserService } from './service/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, ...UserRepositoryProvide],
  imports: [DatabaseModule],
})
export class UserModule {}
