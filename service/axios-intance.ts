import axios, { AxiosError } from 'axios';
import { signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.response.use(
  async (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      return signOut({ redirect: false }).then(() => (window.location.href = '/login'));
    }
  },
);
