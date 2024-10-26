'use client';
import Button from '@/app/components/button';
import { TextInput } from '@/app/components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import * as Users from '@/app/api/entities/auth';
import { ToastContainer, toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { USER_INPUT } from '@/app/constants/users.const';

const schemaForgotPass = z.object({
  email: z
    .string()
    .min(USER_INPUT.EMAIL.minLength, { message: USER_INPUT.EMAIL.message })
    .email({ message: USER_INPUT.EMAIL.message }),
});

type IFormForgotPass = z.infer<typeof schemaForgotPass>;

const ResetPassword = () => {
  const { push } = useRouter();
  const { control, handleSubmit } = useForm<IFormForgotPass>({
    defaultValues: { email: '' },
    resolver: zodResolver(schemaForgotPass),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (email: IFormForgotPass) => Users.forgotPass(email),
    onError: (error) => toast.error(error.message),
    onSuccess: () => push('forgot-password/completion'),
  });

  const onSubmit: SubmitHandler<IFormForgotPass> = (data) => {
    mutate(data);
  };
  return (
    <div className="flex min-h-tablet flex-col">
      <div className="m-auto flex max-w-[454px] flex-col gap-7 rounded-[30px] bg-white p-[40px] shadow-form">
        <p className="text-center text-[22px] font-bold ">パスワードの再設定</p>
        <p className="text-sm leading-[22.4px]">
          以下の手順でパスワードを再発行できます。
        </p>
        <div className="text-sm">
          <div className="mb-3.5 flex gap-2 indent-2">
            <span>1.</span>
            <p className="leading-[22.4px]">
              メールアドレスを入力し、「メールを送信する」ボタンをクリックしてください。
            </p>
          </div>
          <div className="flex gap-2 indent-2">
            <span>2.</span>
            <p className="leading-[22.4px]">
              メール内のURLから、新しいパスワードを設定してください。
            </p>
          </div>
        </div>
        <form
          action=""
          className="m-auto flex w-full max-w-[462px] flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    required
                    label="メールアドレス"
                    id="email"
                    {...field}
                    placeholder="mail@example"
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
            className="mt-7 w-full hover:brightness-150 active:brightness-90"
            isSubmitting={isPending}
          >
            メールを送信する
          </Button>
        </form>
        <Link
          href={'/login'}
          className="m-auto mt-[-14px] border-b border-primary font-sans leading-[18.4px] hover:opacity-70 active:opacity-100"
        >
          ログイン画面に戻る
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
