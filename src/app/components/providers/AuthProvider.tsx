'use client';
import { useSession } from 'next-auth/react';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { axiosInstance } from '../../../../service/axios-intance';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const accessToken = session.data?.user.accessToken;
      if (accessToken) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setLoading(false);
      }
      if (session.status === 'unauthenticated') {
        setLoading(false);
      }
    }, 0);
  }, [session]);
  if (loading) return null;
  return children;
};
