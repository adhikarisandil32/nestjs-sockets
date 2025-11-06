import { USER_ROLE } from '../constants/user.constant';

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role: USER_ROLE;
}
