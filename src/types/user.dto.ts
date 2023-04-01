export class UserResponse {
  userId: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  created: string;
  modified: string;
  active: boolean;

  constructor() {
    this.userId = '';
    this.name = '';
    (this.username = ''), (this.phone = ''), (this.email = '');
    (this.created = ''), (this.modified = ''), (this.active = true);
  }
}

export interface UserRequest {
  userId: string;
  name: string;
  username: string;
  phone: string;
  email: string;
}
