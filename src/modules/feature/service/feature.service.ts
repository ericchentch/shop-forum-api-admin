import { Inject, Injectable } from '@nestjs/common';
import { isNumber } from 'class-validator';
import { Request } from 'express';
import { EndpointTree } from 'src/endpoints';
import { InvalidRequest, NotfoundException } from 'src/exception';
import { BaseService } from 'src/modules/shared/base.service';
import {
  CommonListResponse,
  CommonResponse,
  SelectValue,
} from 'src/modules/shared/common.type';
import { DisableFeature } from '../repository/disable_feature.entity';
import { DisableFeatureRepository } from '../repository/disable_feature.repository';
import { DisableFeatureReq, DisableFeatureRes } from './feature.dto';

@Injectable()
export class FeatureService extends BaseService<DisableFeatureRepository> {
  constructor(
    @Inject(DisableFeatureRepository)
    private disableFeatureRepo: DisableFeatureRepository,
  ) {
    super();
    this.repository = disableFeatureRepo;
  }

  async getListFeature(
    page: number,
    perPage: number,
  ): Promise<CommonResponse<CommonListResponse<SelectValue>>> {
    const FeatureList: SelectValue[] = [];
    type tree = typeof EndpointTree;
    Object.keys(EndpointTree).forEach((item) => {
      const keyTree = item as keyof tree;
      const keyTreeE = EndpointTree[keyTree];
      const root = Object.keys(keyTreeE).find((keyR) => keyR.includes('ROOT'));
      Object.keys(keyTreeE).forEach((itemTree) => {
        const keyItem = itemTree as keyof typeof keyTreeE;
        if (!itemTree.includes('ROOT')) {
          FeatureList.push({
            key: itemTree,
            value: `${keyTreeE[root as keyof typeof keyTreeE]}/${
              keyTreeE[keyItem]
            }`,
          });
        }
      });
    });
    if (!isNumber(page) || !isNumber(perPage)) {
      return this.renderSuccessResponse<CommonListResponse<SelectValue>>({
        data: {
          list: FeatureList,
          page: 0,
          perPage: 0,
          total: FeatureList.length,
        },
      });
    }
    const aPage = page ? page - 1 : 0;
    const aPerPage = perPage ? perPage : 10;
    const mulPage = aPage * aPerPage;
    return this.renderSuccessResponse<CommonListResponse<SelectValue>>({
      data: {
        list: FeatureList.filter(
          (item, index) => index >= mulPage && index < mulPage + aPerPage,
        ),
        page,
        perPage,
        total: FeatureList.length,
      },
    });
  }

  async getListDisableFeature(
    req: Request,
  ): Promise<CommonResponse<CommonListResponse<DisableFeatureRes>>> {
    const params = this.convertParamsToObjectCondition<DisableFeature>(
      req,
      new DisableFeature(),
    );
    const { list, total } = await this.repository.findAll(params);
    return this.renderSuccessResponse<CommonListResponse<DisableFeatureRes>>({
      data: {
        list: list.map((item) =>
          this.objectMapper<DisableFeature, DisableFeatureRes>(
            item,
            new DisableFeatureRes(),
          ),
        ),
        ...this.getPagePageSize(req),
        total,
      },
    });
  }

  async addDisableFeature(
    req: DisableFeatureReq,
  ): Promise<CommonResponse<null>> {
    await this.validateRequest(DisableFeatureReq, req);
    type tree = typeof EndpointTree;
    let find = false;
    let findParent = '';
    let findRoot = '';
    Object.keys(EndpointTree).forEach((item) => {
      const keyTree = item as keyof tree;
      const keyTreeE = EndpointTree[keyTree];
      const root = Object.keys(keyTreeE).find((keyR) => keyR.includes('ROOT'));
      const findName = keyTreeE[req.featureName as keyof typeof keyTreeE];
      if (findName) {
        find = true;
        findParent = item;
        findRoot = keyTreeE[root as keyof typeof keyTreeE];
      }
    });
    if (!find) {
      throw new InvalidRequest('invalid request', {
        featureName: 'this is not feature name',
      });
    }
    const endP = EndpointTree[findParent as keyof tree];
    const typeKeyEndP = req.featureName as keyof typeof endP;
    const endpointFind = `${findRoot}/${endP[typeKeyEndP]}`;
    if (endpointFind !== req.featureEndpoint) {
      throw new InvalidRequest('invalid request', {
        featureEndpoint: 'endpoint invalid',
      });
    }
    const findEndpoint = await this.repository.findOne({
      where: {
        featureEndpoint: req.featureEndpoint,
      },
    });
    if (findEndpoint) {
      throw new InvalidRequest('invalid request', {
        featureEndpoint: 'feature existed',
      });
    }
    const findEndpointName = await this.repository.findOne({
      where: {
        featureName: req.featureName,
      },
    });
    if (findEndpointName) {
      throw new InvalidRequest('invalid request', {
        featureName: 'feature name existed',
      });
    }
    const entity = this.objectMapper<DisableFeatureReq, DisableFeature>(
      req,
      new DisableFeature(),
    );
    await this.repository.insertOrUpdate(entity);
    return this.renderSuccessResponse({ message: 'add success' });
  }

  async enableFeature(id: string): Promise<CommonResponse<null>> {
    const find = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!find) {
      throw new NotfoundException('invalid id');
    }
    await this.repository.delete([find]);
    return this.renderSuccessResponse({ message: 'enable success' });
  }
}
