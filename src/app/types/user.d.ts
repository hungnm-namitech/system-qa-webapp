import { USER_ROLE } from '@/app/constants/users.const';

interface User {
  id: string;
  company: string;
  name: string;
  email: string;
  role: USER_ROLE | string;
  gender: string;
  birthday: string;
  joinedAt: string;
}
