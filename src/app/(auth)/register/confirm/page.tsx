'use client';

import Button from '@/app/components/button';
import { ArrowLeft, ArrowRight, Eye, HiddenEye } from '@/app/components/svg';
import { useFormRegisterStore } from '@/app/store/info-user';
import { useMutation } from '@tanstack/react-query';
import { format, parse } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IFormRegister } from '../page';
import * as Auth from '@/app/api/entities/auth';
import * as Users from '@/app/api/entities/users';
import { GENDER, GENDER_JP, USER_INPUT } from '@/app/constants/users.const';
import { AxiosError } from 'axios';

const RegisterConfirm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [isShowPass, setIsShowPass] = useState(false);
  const { push, back } = useRouter();
  const formRegister = useFormRegisterStore((state) => state.formRegister);
  const saveError = useFormRegisterStore((state) => state.saveEmailError);
  useEffect(() => {
    if (
      !formRegister.company ||
      !formRegister.name ||
      !formRegister.gender ||
      !formRegister.email ||
      !formRegister.password
    )
      return push('/register');
  }, [formRegister, push]);

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser);
    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, []);
  const alertUser = (e: any) => {
    e.preventDefault();
    e.returnValue = '';
  };

  const handleFormatDate = () => {
    if (formRegister.birthday) {
      const transferDate = parse(formRegister.birthday, 'yyyyMMdd', new Date());
      return format(transferDate, 'yoModo', { locale: ja });
    }
  };
  const { mutate, isPending } = useMutation({
    mutationFn: (user: Omit<IFormRegister, 'isTerm' | 'isPolicy' | 'confirmPass'>) =>
      Auth.register(user),
    onError: (
      error: AxiosError<{
        error: { email: { emailAlreadyUsed: string; emailNotInvited: string } };
      }>,
    ) => {
      const emailAlreadyUsed = error.response?.data.error.email.emailAlreadyUsed || '';
      const emailNotInvited = error.response?.data.error.email.emailNotInvited || '';
      const { email } = formRegister;

      if (!!emailAlreadyUsed) {
        saveError({ email, error: USER_INPUT.EMAIL.emailExisted });
      } else if (!!emailNotInvited) {
        saveError({ email, error: USER_INPUT.EMAIL.message });
      }
      push('/register');
    },
    onSuccess: () => push('/register/completion'),
  });

  const { mutate: registerMember, isPending: isPendingMember } = useMutation({
    mutationFn: (
      user: Omit<IFormRegister, 'isTerm' | 'isPolicy' | 'confirmPass' | 'company'> & {
        token: string;
      },
    ) => Users.acceptInvite(user),
    onError: (
      error: AxiosError<{
        error: { email: { emailAlreadyUsed: string; emailNotInvited: string } };
      }>,
    ) => {
      const emailAlreadyUsed = error.response?.data.error.email.emailAlreadyUsed || '';
      const emailNotInvited = error.response?.data.error.email.emailNotInvited || '';
      const { email } = formRegister;

      if (!!emailAlreadyUsed) {
        saveError({ email, error: USER_INPUT.EMAIL.emailExisted });
      } else if (!!emailNotInvited) {
        saveError({ email, error: USER_INPUT.EMAIL.message });
      }
      push('/register');
    },
    onSuccess: () => push('/register/successfully'),
  });

  const handleSubmit = () => {
    const transferDate = parse(formRegister.birthday, 'yyyyMMdd', new Date());
    let user;
    if (!token) {
      user = {
        company: formRegister.company,
        name: formRegister.name,
        gender: formRegister.gender,
        birthday: format(transferDate, 'yyyy-MM-dd'),
        email: formRegister.email,
        password: formRegister.password,
      };
      mutate(user);
    } else {
      user = {
        token,
        name: formRegister.name,
        gender: formRegister.gender,
        birthday: format(transferDate, 'yyyy-MM-dd'),
        email: formRegister.email,
        password: formRegister.password,
      };
      registerMember(user);
    }
  };
  const handleGender = () => {
    if (formRegister.gender === GENDER.MALE) return GENDER_JP.MALE;
    else if (formRegister.gender === GENDER.FEMALE) return GENDER_JP.FEMALE;
    else return GENDER_JP.OTHER;
  };
  return (
    <div className="flex min-h-tablet">
      <div className="m-auto w-full max-w-[454px] rounded-[30px] bg-white p-[40px] shadow-form">
        <p className="text-center text-[22px] font-bold">入力内容確認画面</p>
        <div className=" mt-9 flex flex-col gap-6 ">
          <div>
            <p className="font-bold">会社名</p>
            <p>{formRegister.company}</p>
          </div>
          <div>
            <p className="font-bold">氏名</p>
            <p>{formRegister.name}</p>
          </div>
          <div>
            <p className="font-bold">性別</p>
            <p>{handleGender()}</p>
          </div>
          <div>
            <p className="font-bold">生年月日</p>
            <p>{handleFormatDate()}</p>
          </div>
          <div>
            <p className="font-bold">メールアドレス</p>
            <p>{formRegister.email}</p>
          </div>
          <div>
            <p className="font-bold">パスワード</p>
            <div className="flex justify-between">
              {isShowPass ? <p>{formRegister.password}</p> : <p>●●●●●●●●●</p>}
              <button onClick={() => setIsShowPass(!isShowPass)}>
                {isShowPass ? <Eye /> : <HiddenEye />}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 flex gap-3">
          <Button
            className="relative w-full border border-primary bg-white text-primary hover:brightness-90 active:brightness-50"
            onClick={back}
          >
            <div className="absolute left-4 top-[50%] translate-y-[-50%]">
              <ArrowLeft />
            </div>
            編集に戻る
          </Button>
          <Button
            className="relative w-full hover:bg-primary hover:text-white hover:brightness-150 active:brightness-90"
            onClick={handleSubmit}
            isSubmitting={isPending || isPendingMember}
          >
            <div className="absolute right-4 top-[50%] translate-y-[-50%]">
              <ArrowRight />
            </div>
            登録する
          </Button>
        </div>
      </div>
    </div>
  );
};
export default RegisterConfirm;
