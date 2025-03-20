import { UserRoleEnum } from '../enum';

export interface UserPayload {
  id: string;
  username: string;
  email: string;
  role: UserRoleEnum;
}
