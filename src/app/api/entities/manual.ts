import { Manual, ManualStepsEdit, Step } from '@/app/types/manual';
import { axiosInstance } from '../../../../service/axios-intance';
import { STATUS_MANUAL } from '@/app/constants/manual.const';

const BASE_ENTITY_URL = '/manuals';

export const getManuals = (status: string): Promise<{ data: { data: Manual[] } }> =>
  axiosInstance.get(`${BASE_ENTITY_URL}`, {
    params: {
      visibilityStatus: status,
    },
  });

export const getPublicManualsByOrganization = (
  organizationId: string,
): Promise<{ data: Manual[] }> =>
  axiosInstance
    .get(`${BASE_ENTITY_URL}/public/organization/${organizationId}`)
    .then((response) => {
      return response.data;
    });

export const getManualDetail = (
  id: string,
  status?: STATUS_MANUAL,
): Promise<{ data: Manual }> =>
  axiosInstance.get(`${BASE_ENTITY_URL}/${id}`, {
    transformRequest: [
      (data, headers) => {
        if (status === STATUS_MANUAL.PUBLIC) delete headers['Authorization'];
        return data;
      },
    ],
  });

export const deleteManual = (id: string) =>
  axiosInstance.delete(`${BASE_ENTITY_URL}/${id}`);

export const getManualSteps = (
  id: string,
  status?: STATUS_MANUAL,
): Promise<{ data: { data: Step[] } }> =>
  axiosInstance.get(`${BASE_ENTITY_URL}/${id}/steps`, {
    transformRequest: [
      (data, headers) => {
        if (status === STATUS_MANUAL.PUBLIC) delete headers['Authorization'];
        return data;
      },
    ],
  });

export const editManualSteps = (id: string, manual: ManualStepsEdit) =>
  axiosInstance.put(`${BASE_ENTITY_URL}/${id}`, manual);

export const uploadImageStep = (
  id: string,
  file: FormData,
): Promise<{
  data: {
    path: string;
    url: string;
  };
}> =>
  axiosInstance.post(`${BASE_ENTITY_URL}/${id}/steps/upload`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const publishManual = (
  id: string,
  status: STATUS_MANUAL,
): Promise<{ data: Manual }> =>
  axiosInstance.put(`${BASE_ENTITY_URL}/${id}/visibility`, { status });
