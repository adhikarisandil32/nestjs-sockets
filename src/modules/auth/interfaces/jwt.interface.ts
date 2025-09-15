import { USER_ROLE } from 'src/modules/users/constants/user.constant';

export interface IJwtUser {
  id: number;
  role: USER_ROLE;
}
