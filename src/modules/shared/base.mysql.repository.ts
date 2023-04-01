import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/exception';
import { FindManyOptions, Repository } from 'typeorm';

export class BaseRepositorySql<T> {
  protected typeOrmRepository: Repository<T>;

  private readonly logger = new Logger(HttpExceptionFilter.name);

  async findAll(
    params: FindManyOptions<T>,
  ): Promise<{ total: number; list: T[] }> {
    try {
      this.logger.debug(params);
      const [list, count] = await this.typeOrmRepository.findAndCount({
        ...params,
        cache: true,
      });
      this.logger.verbose(list);
      return {
        total: count,
        list,
      };
    } catch (err: any) {
      this.logger.error(err);
      return {
        total: 0,
        list: [],
      };
    }
  }

  async findOne(params: FindManyOptions<T>): Promise<T | null> {
    const result = await this.findAll(params);
    if (result.list.length) {
      return result.list[0];
    }
    return null;
  }
}
