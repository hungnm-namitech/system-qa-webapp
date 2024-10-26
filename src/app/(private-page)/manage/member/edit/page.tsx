'use client';
import Button from '@/app/components/button';
import { TextInput } from '@/app/components/input';
import { RadioGroupGender } from '@/app/components/radiogroup';
import { GENDER, USER_INPUT, USER_ROLE } from '@/app/constants/users.const';
import { useCurrentUser } from '@/app/store/current-user';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { format, parse } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import * as Users from '@/app/api/entities/users';
import { toast } from 'react-toastify';
import Progressbar from '@/app/components/progress-bar';
import Notification from '@/app/components/notification';

const schemaEditUser = z.object({
  company: z
    .string()
    .min(USER_INPUT.COMPANY.minLength, { message: USER_INPUT.COMPANY.message }),
  name: z.string().min(USER_INPUT.NAME.minLength, { message: USER_INPUT.NAME.message }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).nullable(),
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
});

export type IFormEditUser = z.infer<typeof schemaEditUser>;

const Edit = () => {
  const [isActivate, setIsActivate] = useState(true);
  const currentUser = useCurrentUser((state) => state.currentUser);
  const saveCurrentUser = useCurrentUser((state) => state.saveCurrentUser);
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IFormEditUser>({
    defaultValues: {
      name: '',
      gender: 'MALE',
      birthday: '',
      company: '',
    },
    resolver: zodResolver(schemaEditUser),
  });

  const {
    mutate,
    isPending,
    data: userUpdated,
  } = useMutation({
    mutationFn: (data: { id: string; user: IFormEditUser }) =>
      Users.editUser(data.id, data.user),
    onSuccess: () => {
      toast(<Notification content="保存しました" className="max-w-[144px]" />, {
        hideProgressBar: true,
        style: { backgroundColor: 'transparent', boxShadow: 'none' },
        closeButton: false,
        position: 'bottom-right',
        autoClose: 4000,
      });
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (userUpdated?.data) saveCurrentUser(userUpdated?.data);
    return () => userUpdated?.data && saveCurrentUser(userUpdated?.data);
  }, [userUpdated?.data]);

  const onSubmit: SubmitHandler<IFormEditUser> = (data) => {
    const transferDate = parse(data.birthday, 'yyyyMMdd', new Date());
    mutate({
      id: currentUser.id,
      user: {
        ...data,
        birthday: format(transferDate, 'yyyy-MM-dd'),
      },
    });
  };

  useEffect(() => {
    const formatDate = currentUser.birthday.split('-').join('');
    if (!!currentUser.company && !!currentUser.name && !!currentUser.gender) {
      setValue('company', currentUser.company);
      setValue('name', currentUser.name);
      setValue('gender', currentUser.gender as GENDER);
      setValue('birthday', formatDate);
    }
  }, [currentUser]);

  useEffect(() => {
    const formatDate = currentUser.birthday.split('-').join('');
    if (
      watch('name') === currentUser.name &&
      watch('birthday') === formatDate &&
      watch('gender') === currentUser.gender &&
      watch('company') === currentUser.company
    )
      return setIsActivate(true);
    else return setIsActivate(false);
  }, [watch('name'), watch('birthday'), watch('gender'), watch('company'), currentUser]);

  return (
    <>
      {isPending && <Progressbar />}
      <div className="my-[84px] flex">
        <div className="m-auto w-full max-w-[454px] rounded-[30px] bg-white p-[40px] shadow-form">
          <p className="text-center text-[22px] font-bold">アカウント</p>
          <form className="mt-[40px] flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label className="text-base font-bold leading-[25px] ">
                メールアドレス
              </Label>
              <p className="leading-[25.6px]">{currentUser.email}</p>
            </div>
            {currentUser.role === USER_ROLE.MEMBER ? (
              <div className="mt-6">
                <Label className="text-base font-bold leading-[25px] ">会社名</Label>
                <p className="leading-[25.6px]">{currentUser.company}</p>
              </div>
            ) : (
              <div className="mt-6">
                <Controller
                  name="company"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <TextInput
                        disabled={isPending}
                        label="会社名"
                        id="company"
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
                    <TextInput disabled={isPending} label="氏名" id="name" {...field} />
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
                  <RadioGroupGender
                    disabled={isPending}
                    label="性別"
                    onChange={onChange}
                    value={value}
                  />
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
                      disabled={isPending}
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

            <Button
              className="opacity-1 mt-[40px] w-full hover:brightness-150 active:brightness-90"
              isSubmitting={isPending}
              disabled={isActivate}
            >
              変更を保存する
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Edit;
