'use client';
import Button from '../button';
import { z } from 'zod';
import { USER_INPUT } from '@/app/constants/users.const';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TextInput } from '../input';
import { SetStateAction } from 'react';
import { useMutation } from '@tanstack/react-query';
import * as Users from '@/app/api/entities/users';
import { toast } from 'react-toastify';
import Notification from '@/app/components/notification';
import { AxiosError } from 'axios';

type Props = {
  handleShow: () => void;
  setIsDialogAdd: React.Dispatch<SetStateAction<boolean>>;
};

const schemaInvite = z.object({
  email: z
    .string()
    .min(USER_INPUT.EMAIL.minLength, { message: USER_INPUT.EMAIL.message })
    .email({ message: USER_INPUT.EMAIL.message }),
});

export type IFormInvite = z.infer<typeof schemaInvite>;

export default function DialogAddMember({ handleShow, setIsDialogAdd }: Props) {
  const { control, handleSubmit, setError } = useForm<IFormInvite>({
    defaultValues: { email: '' },
    resolver: zodResolver(schemaInvite),
  });

  const { mutate: inviteUser, isPending } = useMutation({
    mutationFn: (email: string) => Users.inviteUser(email),
    onSuccess: () => {
      toast(
        <Notification content="招待メールを送信しました" className="max-w-[228px]" />,
        {
          hideProgressBar: true,
          style: { backgroundColor: 'transparent', boxShadow: 'none' },
          closeButton: false,
          position: 'bottom-right',
          autoClose: 4000,
        },
      );
      setIsDialogAdd(false);
    },

    onError: (
      error: AxiosError<{
        error: { userExists: string };
      }>,
    ) => {
      if (!!error.response?.data.error.userExists) {
        setError('email', { message: USER_INPUT.EMAIL.emailRegistered });
      }
    },
  });

  const onSubmit: SubmitHandler<IFormInvite> = (data) => inviteUser(data.email);
  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#0000004D] bg-opacity-30" />
      <div className=" fixed top-[50%] z-10 flex min-h-[345px] w-[454px] translate-y-[-50%] flex-col items-center justify-between gap-4 rounded-[20px] bg-white p-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-[22px] font-bold leading-[35.2px]">メンバーの招待</p>
          <p className="w-[78%] leading-[25.6px]">
            招待するメンバーのメールアドレスを入力してください。
          </p>
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
                    label="メールアドレス"
                    id="email"
                    {...field}
                    disabled={isPending}
                    placeholder="mail@example"
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
          <div className="mt-6 flex gap-[10px]">
            <Button
              type="button"
              onClick={handleShow}
              className="w-[182px] border border-primary bg-white text-primary hover:brightness-90 active:brightness-50"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="w-[182px] bg-primary hover:brightness-150 active:brightness-90"
              isSubmitting={isPending}
            >
              招待する
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
