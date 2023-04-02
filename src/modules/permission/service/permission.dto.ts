import { IsString, Length } from 'class-validator';

export class PermissionResponse {
  permissionId: string;
  permissionName: string;
  created: string;
  modified: string;
  active: boolean;

  constructor() {
    this.active = true;
    this.created = '';
    this.modified = '';
    this.permissionId = '';
    this.permissionName = '';
  }
}

export class PermissionRequest {
  @IsString({
    message: 'name must be string',
  })
  @Length(10, undefined, {
    message: 'name must be at least 10 characters',
  })
  permissionName: string;
}
