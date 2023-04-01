import { Logger } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { defaultCommonResponse } from 'src/constants/default.value';
import { HttpExceptionFilter, InvalidRequest } from 'src/exception';
import { formatDate, isNumber, isValidDate } from 'src/libs';
import { CommonResponse } from 'src/types/common.type';
import { FindManyOptions } from 'typeorm';

export class BaseService<T> {
  protected repository: T;
  protected idField = '';

  private readonly logger = new Logger(HttpExceptionFilter.name);

  /*
  author: @ericchentch
  validate req
*/
  protected async validateRequest<E extends ClassConstructor<any>>(
    dto: E,
    input: object,
  ) {
    const instance = plainToClass(dto, input);
    const errors = await validate(instance, {
      validationError: { target: false },
    });
    if (errors && errors.length > 0) {
      this.logger.verbose(errors);
      let error = {};
      errors.forEach((err) => {
        error = {
          ...error,
          [err.property]: err.constraints[Object.keys(err.constraints)[0]],
        };
      });
      throw new InvalidRequest('invalid request', error);
    }
  }

  /*

  author: @ericchentch
  get page, pageSize
*/
  protected getPagePageSize = (
    req: Request,
  ): { page: number; perPage: number } => {
    const query = req.query;
    if (
      query.page &&
      query.size &&
      isNumber(query.page) &&
      isNumber(query.size)
    )
      return {
        page: Number(query.page),
        perPage: Number(query.size),
      };
    return {
      page: 1,
      perPage: 10,
    };
  };

  /*

  author: @ericchentch
  switch value for mapper
*/
  protected convertParamsToObjectCondition = <T>(
    req: Request,
    entity: T,
  ): FindManyOptions<T> => {
    const query = req.query;
    const queryKeys = Object.keys(query);
    let where = {};
    const keysEntity = Object.keys(entity);
    queryKeys.forEach((key) => {
      if (keysEntity.find((eKey) => eKey === key)) {
        const values = query[key].toString().split(',');
        if (values.length) {
          where = { ...where, [key]: values[0] };
        }
      }
    });
    let skip = 1;
    let take = 10;
    if (
      query.page &&
      query.size &&
      isNumber(query.page) &&
      isNumber(query.size)
    ) {
      skip = (Number(query.page) - 1) * Number(query.size);
      take = Number(query.size);
    }
    let order = {};
    if (
      query.orderField &&
      query.orderKey &&
      keysEntity.find((eKey) => eKey == query.orderField)
    ) {
      order = { [String(query.orderField)]: query.orderKey };
    } else {
      order = { [this.idField]: 'DESC' };
    }
    return { where, skip, take, order };
  };

  /*

  author: @ericchentch
  switch value for mapper
*/
  protected mapperConvertValue = (value: any, targetType: any): any => {
    if (!value) {
      switch (targetType) {
        case 'string':
          return '';
        case 'number':
          return 0;
        case 'boolean':
          return false;
      }
    }
    if (typeof value === targetType) {
      return value;
    }
    if (isValidDate(value) && targetType === 'string') {
      return formatDate(value, '-');
    }
    if (isNumber(value) && targetType === 'boolean') {
      return Number(value) === 1;
    }
    if (
      typeof value === 'string' &&
      targetType === 'number' &&
      isNumber(value)
    ) {
      return Number(value);
    }
    if (targetType === 'string') {
      return String(value);
    }
    return 'error';
  };

  /*

  author: @ericchentch
  convert value to response
*/
  protected objectMapper = <T extends object, E extends object>(
    source: T,
    target: E,
  ): any => {
    const soKeys = Object.keys(source);
    const taKeys = Object.keys(target);
    let result = {};
    soKeys.forEach((keySource) => {
      taKeys.forEach((keyTarget) => {
        if (keySource === keyTarget) {
          result = {
            ...result,
            [keyTarget]: this.mapperConvertValue(
              source[keySource as keyof typeof source],
              typeof target[keyTarget as keyof typeof target],
            ),
          };
        }
      });
    });
    return result;
  };

  /*
  author: @ericchentch
  render success response
*/
  protected renderSuccessResponse = <T>(
    extendValue: Partial<CommonResponse<T>>,
  ): CommonResponse<T> => {
    return { ...defaultCommonResponse, ...extendValue };
  };
}
