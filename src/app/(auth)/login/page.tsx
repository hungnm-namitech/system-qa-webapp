'use client';
import React, { useEffect, useState } from 'react';
import { TextInput } from '../../components/input';
import Link from 'next/link';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Button from '@/app/components/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { USER_INPUT } from '@/app/constants/users.const';

const schemaLogin = z.object({
  email: z
    .string()
    .min(USER_INPUT.EMAIL.minLength, { message: USER_INPUT.EMAIL.message })
    .email({ message: USER_INPUT.EMAIL.message }),
  password: z
    .string()
    .min(USER_INPUT.PASSWORD.minLength, { message: USER_INPUT.PASSWORD.message })
    .max(USER_INPUT.PASSWORD.maxLength, { message: USER_INPUT.PASSWORD.message })
    .regex(new RegExp(USER_INPUT.PASSWORD.regex), {
      message: USER_INPUT.PASSWORD.message,
    }),
});

type IFormLogin = z.infer<typeof schemaLogin>;

const Login = () => {
  const searchParams = useSearchParams();
  const isLoginExtension = searchParams.get('loginExtensions');
  const { push } = useRouter();
  const [isShowPass, setIsShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IFormLogin>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(schemaLogin),
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IFormLogin) => {
      return signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
    },
  });

  useEffect(() => {
    if (!!email && watch('email') !== email) {
      clearErrors('root');
      setEmail('');
    }
  }, [watch('email')]);

  const onSubmit: SubmitHandler<IFormLogin> = async (data) => {
    setEmail(data.email);
    try {
      const res = await mutateAsync(data);
      if (!res?.ok) {
        setError('root', { message: USER_INPUT.LOGIN_FAULT.message });
      } else push('/');
    } catch (error) {
      return setError('root', { message: USER_INPUT.LOGIN_FAULT.message });
    }
  };

  useEffect(() => {
    localStorage.setItem('isLoginExtension', 'true');
  }, [isLoginExtension]);

  return (
    <div className="flex min-h-tablet">
      <div className="m-auto w-full max-w-[454px] rounded-[30px] bg-white p-[40px] shadow-form">
        <p className="text-center text-[22px] font-bold">ログイン</p>
        {errors.root && (
          <p className="mt-8 font-bold leading-[25px] text-required">
            {errors.root.message}
          </p>
        )}
        <form className="mt-8 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    disabled={isPending}
                    placeholder="mail@example.com"
                    id="email"
                    label="メールアドレス"
                    type="text"
                    {...field}
                    className={`${(fieldState.error || errors.root) && 'border-required'}`}
                  />
                  {fieldState.error && (
                    <p className="mt-2 text-xs text-required">
                      {fieldState.error?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="mt-4">
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    disabled={isPending}
                    id="password"
                    label="パスワード"
                    type={isShowPass ? 'text' : 'password'}
                    {...field}
                    className={`${(fieldState.error || errors.root) && 'border-required'}`}
                    isShowPass={isShowPass}
                    handleShowPass={(e) => {
                      e.stopPropagation();
                      setIsShowPass(!isShowPass);
                    }}
                  />
                  {fieldState.error && (
                    <p className="mt-2 text-xs text-required">
                      {fieldState.error?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="mt-1 text-end text-xs ">
            <Link
              className="hover:text-gray-700 border-b border-primary font-sans leading-[13.8px] hover:opacity-70 active:opacity-100"
              href={'/forgot-password'}
            >
              パスワードをお忘れですか？
            </Link>
          </div>
          <Button
            className="mt-7 w-full bg-primary leading-[25.6px] hover:brightness-150 active:brightness-90"
            isSubmitting={isPending}
          >
            ログインして進む
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link
            href={'/register'}
            className="border-b border-primary font-sans leading-[18.4px] hover:opacity-70 active:opacity-100"
          >
            新規登録はこちら
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
