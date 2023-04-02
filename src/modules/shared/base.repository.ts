import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { HttpExceptionFilter } from 'src/exception';
import { convertToDateTimeSql } from 'src/libs';
import { FindManyOptions, ObjectType, Repository } from 'typeorm';

export class BaseRepositorySql<T> {
  protected typeOrmRepository: Repository<T>;
  protected fieldId = '';
  protected modified = '';
  protected entity: ObjectType<T>;

  private readonly logger = new Logger(HttpExceptionFilter.name);

  async findAll(
    params: FindManyOptions<T>,
  ): Promise<{ total: number; list: T[] }> {
    let list: T[] = [];
    let total = 0;
    await this.typeOrmRepository.manager.transaction(async (manager) => {
      const [listEntity, count] = await manager.findAndCount(
        this.entity,
        params,
      );
      this.logger.verbose(listEntity);
      list = listEntity;
      total = count;
    });
    return {
      list,
      total,
    };
  }

  async findOne(params: FindManyOptions<T>): Promise<T | null> {
    const result = await this.findAll(params);
    if (result.list.length) {
      return result.list[0];
    }
    return null;
  }

  async insertOrUpdate(listInsert: T[]): Promise<void> {
    await this.typeOrmRepository.manager.transaction(async (manager) => {
      const listInstance = await Promise.all(
        listInsert.map(async (item) => {
          if (!item[this.fieldId]) {
            return this.typeOrmRepository.create({
              ...item,
              [this.fieldId]: randomUUID(),
            });
          } else {
            return this.typeOrmRepository.create({
              ...item,
              [this.modified]: convertToDateTimeSql(new Date()),
            });
          }
        }),
      );
      await manager.save<T>(listInstance);
    });
  }

  async delete(listDelete: T[]): Promise<void> {
    await this.typeOrmRepository.manager.transaction(async (manager) => {
      const listInstance = await Promise.all(
        listDelete.map(async (item) => {
          return this.typeOrmRepository.create(item);
        }),
      );
      listInstance.forEach(async (item) => {
        manager.remove(item);
      });
    });
  }
}
