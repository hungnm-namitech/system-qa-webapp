'use client';
import Button from '@/app/components/button';
import { TextInput } from '@/app/components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import * as Users from '@/app/api/entities/auth';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { USER_INPUT } from '@/app/constants/users.const';
const schemaReset = z
  .object({
    password: z
      .string()
      .min(USER_INPUT.PASSWORD.minLength, { message: USER_INPUT.PASSWORD.message })
      .max(USER_INPUT.PASSWORD.maxLength, { message: USER_INPUT.PASSWORD.message })
      .regex(new RegExp(USER_INPUT.PASSWORD.regex), {
        message: USER_INPUT.PASSWORD.message,
      }),
    confirmPass: z
      .string()
      .min(USER_INPUT.PASSWORD.minLength, {
        message: USER_INPUT.CONFIRM_PASSWORD.message,
      })
      .max(USER_INPUT.PASSWORD.maxLength, {
        message: USER_INPUT.CONFIRM_PASSWORD.message,
      }),
  })
  .refine((data) => data.password === data.confirmPass, {
    path: ['confirmPass'],
    message: 'パスワードが一致しません',
  });

type IFormReset = z.infer<typeof schemaReset>;

const Reset = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [isShowPass, setIsShowPass] = useState(false);
  const [isShowConfirmPass, setIsShowConfirmPass] = useState(false);
  const { control, handleSubmit } = useForm<IFormReset>({
    defaultValues: {
      password: '',
      confirmPass: '',
    },
    resolver: zodResolver(schemaReset),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (password: string) => Users.resetPass(email, token, password),
    onError: () => push('/url-invalid'),
    onSuccess: () => push('/forgot-password/successfully'),
  });
  const onSubmit: SubmitHandler<IFormReset> = (data) => {
    mutate(data.password);
  };
  return (
    <div className="flex min-h-tablet">
      <div className="m-auto w-full max-w-[454px] rounded-[30px] bg-white p-[40px] shadow-form">
        <p className="text-center text-[22px] font-bold">新しいパスワードを設定</p>
        <form className="mt-9 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    disabled={isPending}
                    label="パスワード"
                    id="password"
                    type={isShowPass ? 'text' : 'password'}
                    {...field}
                    required
                    className={`${fieldState.error ? 'border border-red-600' : ''}`}
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
            <p className="mt-[3px] text-xs leading-[19.2px]">
              ・8文字以上16文字以下で設定してください
            </p>
            <p className="text-xs leading-[19.2px]">
              ・半角英字と半角数字がそれぞれ１つ以上必要です
            </p>
            <p className="text-xs leading-[19.2px]">
              ・半角特殊記号（! $ % & @）を含めることができます（任意）
            </p>
          </div>
          <div className="mt-4">
            <Controller
              name="confirmPass"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    disabled={isPending}
                    label="確認用パスワード"
                    id="confirmPassword"
                    type={isShowConfirmPass ? 'text' : 'password'}
                    {...field}
                    required
                    className={`${fieldState.error ? 'border border-red-600' : ''}`}
                    handleShowPass={(e) => {
                      e.stopPropagation();
                      setIsShowConfirmPass(!isShowConfirmPass);
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
          <Button
            className="mt-8 w-full hover:brightness-150 active:brightness-90"
            isSubmitting={isPending}
          >
            設定する
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Reset;
