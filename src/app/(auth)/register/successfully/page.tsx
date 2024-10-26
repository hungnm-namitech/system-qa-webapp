'use client';

import Button from '@/app/components/button';
import { MailCircleFinish } from '@/app/components/svg';
import { useRouter } from 'next/navigation';
import React from 'react';

const RegisterSuccessfully = () => {
  const { push } = useRouter();

  return (
    <div className="flex min-h-tablet">
      <div className="m-auto flex max-w-[454px] flex-col items-center rounded-[30px] bg-white p-[40px] shadow-form">
        <MailCircleFinish />
        <p className="mt-[30px] text-[22px] font-bold">新規登録が完了しました</p>
        <div className="mt-6 text-sm">
          <p>メールアドレスの確認が完了しました。</p>
          <p>ログイン画面からログインしてください。</p>
        </div>
        <Button
          className="mt-6 w-[374px] hover:brightness-150 active:brightness-90"
          onClick={() => push('/login')}
        >
          ログイン画面に戻る
        </Button>
      </div>
    </div>
  );
};

export default RegisterSuccessfully;
