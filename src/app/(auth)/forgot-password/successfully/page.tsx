'use client';
import Button from '@/app/components/button';
import { MailCircleFinish } from '@/app/components/svg';
import { useRouter } from 'next/navigation';
import React from 'react';

const ChangeSuccessfully = () => {
  const { push } = useRouter();
  return (
    <div className="flex min-h-tablet">
      <div className="m-auto flex max-w-[454px] flex-col items-center gap-7 rounded-[30px] bg-white p-[40px] shadow-form">
        <MailCircleFinish />
        <p className="text-[22px] font-bold leading-[35.2px]">
          パスワード変更が完了しました
        </p>
        <div className="text-sm leading-[22.4px]">
          <p>ログイン画面からログインしてください。</p>
        </div>
        <Button
          className="w-[374px] leading-[25.6px] hover:brightness-150 active:brightness-90"
          onClick={() => push('/login')}
        >
          ログイン画面に戻る
        </Button>
      </div>
    </div>
  );
};

export default ChangeSuccessfully;
