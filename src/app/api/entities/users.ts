import { axiosInstance } from '../../../../service/axios-intance';
import { User } from '@/app/types/user';
import { IFormRegister } from '@/app/(auth)/register/page';
import { IFormEditUser } from '@/app/(private-page)/manage/member/edit/page';

const BASE_ENTITY_URL = '/users';

export const getAllMembers = (): Promise<{ data: { users: User[] } }> => {
  return axiosInstance.get(BASE_ENTITY_URL);
};

export const countMembers = (): Promise<{ data: { total: number } }> => {
  return axiosInstance.get(`${BASE_ENTITY_URL}/count`);
};

export const getInvitationRegister = (
  session: string,
  email: string,
): Promise<{ data: { email: string; organization: { name: string } } }> => {
  return axiosInstance.get(`${BASE_ENTITY_URL}/invitations/${session}`, {
    params: {
      email,
    },
  });
};

export const inviteUser = (email: string) =>
  axiosInstance.post(`${BASE_ENTITY_URL}/invite`, { email });

export const acceptInvite = (
  user: Omit<IFormRegister, 'isTerm' | 'isPolicy' | 'confirmPass' | 'company'> & {
    token: string;
  },
) => axiosInstance.post(`${BASE_ENTITY_URL}/invite/accept`, user);

export const deleteUser = (id: string) =>
  axiosInstance.delete(`${BASE_ENTITY_URL}/${id}`);

export const editUser = (id: string, user: IFormEditUser): Promise<{ data: User }> =>
  axiosInstance.put(`${BASE_ENTITY_URL}/${id}`, user);
