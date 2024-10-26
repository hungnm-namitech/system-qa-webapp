import { User } from '@/app/types/user';
import { axiosInstance } from '../../../../service/axios-intance';

export const getCurrentUser = (): Promise<{
  data: User;
}> => {
  return axiosInstance.get('me');
};
export const getCurrentUserOrganizationId = (): Promise<{ data: string }> => {
  return axiosInstance.get('me/organization-id');
};
