import {
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthBody } from 'src/decorator/custom.body';
import { AuthParamOne } from 'src/decorator/custom.param.one';
import { AuthRequest } from 'src/decorator/custom.request';
import { EndpointTree } from 'src/endpoints';
import { HttpExceptionFilter } from 'src/exception';
import { BaseController } from 'src/modules/shared/base.controller';
import {
  CommonListResponse,
  CommonResponse,
  SelectValue,
} from 'src/modules/shared/common.type';
import { DisableFeatureReq, DisableFeatureRes } from '../service/feature.dto';
import { FeatureService } from '../service/feature.service';

@UseFilters(new HttpExceptionFilter())
@Controller(EndpointTree.FEATURE.FEATURE_ROOT)
export class FeatureController extends BaseController<FeatureService> {
  constructor(
    @Inject(FeatureService)
    private featureService: FeatureService,
  ) {
    super();
    this.service = featureService;
  }

  @Get(EndpointTree.FEATURE.FEATURE_LIST)
  async getFeatureList(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<CommonResponse<CommonListResponse<SelectValue>>> {
    return await this.service.getListFeature(page, perPage);
  }

  @Get(EndpointTree.FEATURE.DISABLE_FEATURE_LIST)
  async getDisableFeatureList(
    @AuthRequest() req: Request,
  ): Promise<CommonResponse<CommonListResponse<DisableFeatureRes>>> {
    return await this.service.getListDisableFeature(req);
  }

  @Post(EndpointTree.FEATURE.ADD_DISABLE_FEATURE)
  async addDisableFeature(
    @AuthBody() req: DisableFeatureReq,
  ): Promise<CommonResponse<null>> {
    return await this.service.addDisableFeature(req);
  }

  @Get(EndpointTree.FEATURE.ENABLE_FEATURE)
  async enableFeature(
    @AuthParamOne('id') id: string,
  ): Promise<CommonResponse<null>> {
    return await this.service.enableFeature(id);
  }
}
