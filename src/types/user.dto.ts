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

import { IsString, Length, Matches } from 'class-validator';
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  USERNAME_REGEX,
} from 'src/constants/regex.value';
export class UserRequest {
  @IsString({
    message: 'name must be string',
  })
  @Length(10, undefined, {
    message: 'name must be at least 10 characters',
  })
  name: string;

  @Matches(USERNAME_REGEX, { message: 'invalid username' })
  username: string;

  @Matches(PHONE_REGEX, { message: 'invalid phone number' })
  phone: string;

  @Matches(EMAIL_REGEX, { message: 'invalid email' })
  email: string;
}
