import { IsString, Length } from 'class-validator';

export class DisableFeatureRes {
  id: string;
  featureEndpoint: string;
  featureName: string;

  constructor() {
    this.id = '';
    this.featureEndpoint = '';
    this.featureName = '';
  }
}

export class DisableFeatureReq {
  @IsString({
    message: 'name must be string',
  })
  @Length(5, undefined, {
    message: 'name must be at least 5 characters',
  })
  featureEndpoint: string;

  @IsString({
    message: 'name must be string',
  })
  @Length(5, undefined, {
    message: 'name must be at least 5 characters',
  })
  featureName: string;
}
