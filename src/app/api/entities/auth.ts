import { IFormRegister } from '@/app/(auth)/register/page';
import { axiosInstance } from '../../../../service/axios-intance';

const BASE_ENTITY_URL = '/auth';

export const login = (body: BodyInit | null | undefined) =>
  axiosInstance.post(`${BASE_ENTITY_URL}/login`, body);

export const register = (
  user: Omit<IFormRegister, 'isTerm' | 'isPolicy' | 'confirmPass'>,
) => {
  return axiosInstance.post(`${BASE_ENTITY_URL}/register`, user);
};

export const confirmRegister = (token: string, email: string) => {
  return axiosInstance.post(`${BASE_ENTITY_URL}/register/confirm`, { email, token });
};

export const forgotPass = (email: Pick<IFormRegister, 'email'>) => {
  return axiosInstance.post(`${BASE_ENTITY_URL}/password/forgot`, email);
};

export const resetPass = (email: string, token: string, newPassword: string) => {
  return axiosInstance.post(`${BASE_ENTITY_URL}/password/reset`, {
    email,
    token,
    newPassword,
  });
};
