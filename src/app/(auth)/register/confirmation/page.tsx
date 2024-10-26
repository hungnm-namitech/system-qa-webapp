'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import * as Users from '@/app/api/entities/auth';
import Loading from '@/app/components/loading';
import { useMutation } from '@tanstack/react-query';

const ConfirmRegister = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const { mutate } = useMutation({
    mutationFn: () => Users.confirmRegister(token, email),
    onError: () => push('/register/expired'),
    onSuccess: () => push('/register/successfully'),
  });

  useEffect(() => {
    mutate();
  }, [token, email, push, mutate]);

  return <Loading />;
};

export default ConfirmRegister;
