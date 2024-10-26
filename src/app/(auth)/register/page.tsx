'use client';
import Button from '@/app/components/button';
import { Checkbox } from '@/app/components/checkbox';
import { TextInput } from '@/app/components/input';
import { RadioGroupGender } from '@/app/components/radiogroup';
import { USER_INPUT } from '@/app/constants/users.const';
import { useFormRegisterStore } from '@/app/store/info-user';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse } from 'date-fns';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import * as Users from '@/app/api/entities/users';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Loading from '@/app/components/loading';

const schemaRegister = z
  .object({
    company: z
      .string()
      .min(USER_INPUT.COMPANY.minLength, { message: USER_INPUT.COMPANY.message }),
    name: z.string().min(USER_INPUT.NAME.minLength, { message: USER_INPUT.NAME.message }),
    email: z
      .string()
      .min(USER_INPUT.EMAIL.minLength, { message: USER_INPUT.EMAIL.message })
      .email({ message: USER_INPUT.EMAIL.message })
      .refine(
        (email) => {
          const state: {
            emailError: {
              email: string;
            };
          } = useFormRegisterStore.getState();
          return email !== state.emailError.email;
        },
        () => {
          const state: {
            emailError: {
              email: string;
              error: string;
            };
          } = useFormRegisterStore.getState();
          return { message: state.emailError.error };
        },
      ),
    password: z
      .string()
      .min(USER_INPUT.PASSWORD.minLength, { message: USER_INPUT.PASSWORD.message })
      .max(USER_INPUT.PASSWORD.maxLength, { message: USER_INPUT.PASSWORD.message })
      .regex(new RegExp(USER_INPUT.PASSWORD.regex), {
        message: USER_INPUT.PASSWORD.message,
      }),
    confirmPass: z
      .string()
      .min(USER_INPUT.PASSWORD.minLength, { message: USER_INPUT.PASSWORD.message }),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', '']).nullable(),
    birthday: z
      .string()
      .length(8, { message: USER_INPUT.BIRTHDAY.message })
      .regex(new RegExp(USER_INPUT.BIRTHDAY.regex), USER_INPUT.BIRTHDAY.message)
      .refine(
        (date) => {
          const today = format(new Date(), 'yyyyMMdd');
          const transferDate = parse(date, 'yyyyMMdd', new Date());
          if (isNaN(transferDate.getTime())) return false;
          const formatDate = format(transferDate, 'yyyyMMdd');
          return formatDate <= today;
        },
        { message: USER_INPUT.BIRTHDAY.message },
      ),
    isTerm: z.boolean().refine((data) => data === true, {
      message: USER_INPUT.TERM.message,
    }),
    isPolicy: z.boolean().refine((data) => data === true, {
      message: USER_INPUT.POLICY.message,
    }),
  })
  .refine((data) => data.password === data.confirmPass, {
    path: ['confirmPass'],
    message: USER_INPUT.CONFIRM_PASSWORD.message,
  });

export type IFormRegister = z.infer<typeof schemaRegister>;
const Register = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [isShowPass, setIsShowPass] = useState(false);
  const { push } = useRouter();
  const [isShowConfirmPass, setIsShowConfirmPass] = useState(false);
  const saveForm = useFormRegisterStore((state) => state.updateForm);
  const formRegister = useFormRegisterStore((state) => state.formRegister);
  const errorRegister = useFormRegisterStore((state) => state.emailError);

  const {
    data: companyRegistered,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['invitation-register', token, email],
    queryFn: () => {
      if (token && email)
        return Users.getInvitationRegister(token, email).catch(
          (
            error: AxiosError<{
              error: {
                invitationNotFound: string;
              };
            }>,
          ) => {
            const invitationNotFound = error.response?.data.error.invitationNotFound;
            if (!!invitationNotFound) push('/url-invalid');
          },
        );
    },
    select: (data) => data?.data,
  });

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IFormRegister>({
    defaultValues: formRegister,
    resolver: zodResolver(schemaRegister),
  });

  const onSubmit: SubmitHandler<IFormRegister> = (data) => {
    saveForm(data);
    if (token && email) push(`/register/confirm?token=${token}`);
    else push('/register/confirm');
  };

  useEffect(() => {
    if (errorRegister.email !== watch('email') && !!errorRegister.error)
      return clearErrors('email');

    if (!!errorRegister.error) return setError('email', { message: errorRegister.error });
  }, [errorRegister, watch('email')]);

  useEffect(() => {
    if (companyRegistered) {
      setValue('email', companyRegistered.email);
      setValue('company', companyRegistered.organization.name);
    }
  }, [companyRegistered]);

  if (!!token && !!email && (isLoading || !isSuccess)) return <Loading />;
  return (
    <div className="my-[84px] flex">
      <div className="m-auto w-full max-w-[454px] rounded-[30px] bg-white p-[40px] shadow-form">
        <p className="text-center text-[22px] font-bold">新規登録</p>
        <form className="mt-[40px] flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          {!!companyRegistered ? (
            <div className="mb-[10px]">
              <Label className="text-base font-bold leading-[25px] ">会社名</Label>
              <p className="mt-[14px] leading-[25.6px]">
                {companyRegistered.organization.name}
              </p>
            </div>
          ) : (
            <div>
              <Controller
                name="company"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <TextInput
                      label="会社名"
                      required
                      id="company"
                      placeholder="〇〇株式会社"
                      {...field}
                      className={`${fieldState.error && 'border-required'}`}
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
          )}
          <div className="mt-6">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    required
                    label="氏名"
                    id="name"
                    placeholder="山田太郎"
                    {...field}
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
          <div className="mt-6">
            <Controller
              name="gender"
              control={control}
              render={({ field: { onChange, value } }) => (
                <RadioGroupGender label="性別" onChange={onChange} value={value} />
              )}
            />
          </div>
          <div className="mt-6">
            <Controller
              name="birthday"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    label="生年月日"
                    id="birthday"
                    {...field}
                    type="text"
                    className={`max-w-[130px] ${
                      fieldState.error ? 'border-red-600' : ''
                    }`}
                    placeholder="19900101"
                    maxLength={8}
                  />
                  {fieldState.error && (
                    <p className="mt-2 text-xs text-required">
                      {fieldState.error?.message}
                    </p>
                  )}
                </>
              )}
            />
            <div className="mt-1 text-xs">
              <p>例: 1990年1月1日生まれの場合→19900101</p>
              <p>※半角英数字8桁で入力してください</p>
            </div>
          </div>
          <div className="mt-6">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    readOnly={!!companyRegistered}
                    required
                    label="メールアドレス"
                    id="email"
                    {...field}
                    type="text"
                    className={`${fieldState.error && 'border-required'}`}
                    placeholder="mail@example.com"
                  />
                  {fieldState.error && (
                    <p className="mt-2 text-xs leading-[22.4px] text-required">
                      {fieldState.error?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="mt-6">
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    required
                    label="パスワード"
                    id="password"
                    {...field}
                    type={isShowPass ? 'text' : 'password'}
                    className={`${fieldState.error && 'border-required'}`}
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
            <p className="mt-1 text-xs">・8文字以上16文字以下で設定してください</p>
            <p className="mt-1 text-xs">・半角英字と半角数字がそれぞれ１つ以上必要です</p>
            <p className="mt-1 text-xs">
              ・半角特殊記号（! $ % & @）を含めることができます（任意）
            </p>
          </div>
          <div className="mt-6">
            <Controller
              name="confirmPass"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <TextInput
                      required
                      label="確認用パスワード"
                      id="confirmPass"
                      {...field}
                      type={isShowConfirmPass ? 'text' : 'password'}
                      className={`${fieldState.error && 'border-required'}`}
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
                );
              }}
            />
          </div>
          <div className="mt-6 flex">
            <Controller
              name="isTerm"
              control={control}
              render={({ field }) => (
                <Checkbox
                  type="checkbox"
                  {...field}
                  checked={field.value || false}
                  id="term"
                  className={`${errors.isTerm ? 'before:border-red-600' : ''}`}
                  onChange={field.onChange}
                  value={field.name}
                />
              )}
            />
            <div className="ml-7 text-xs">
              <span className="border-b border-primary">利用規約</span>
              に同意する
            </div>
          </div>
          <div className="mt-3 flex">
            <Controller
              name="isPolicy"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value || false}
                  id="policy"
                  className={`${errors.isPolicy ? 'before:border-red-600' : ''}`}
                  onChange={field.onChange}
                  value={field.name}
                />
              )}
            />
            <div className="ml-7 text-xs">
              <span className="border-b border-primary">プライバシーポリシー</span>
              に同意する
            </div>
          </div>
          {(errors.isPolicy || errors.isTerm) && (
            <p className="mt-2 text-xs text-required">
              {errors.isPolicy?.message || errors.isTerm?.message}
            </p>
          )}

          <Button className="mt-[40px] w-full bg-primary hover:brightness-150 active:brightness-90">
            確認画面に進む
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link
            className="border-b border-primary hover:opacity-70 active:opacity-100"
            href="/login"
          >
            ログインはこちら
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
