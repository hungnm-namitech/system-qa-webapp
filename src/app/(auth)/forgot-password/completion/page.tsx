'use client';
import { MailCircle } from '@/app/components/svg';
import React from 'react';

const ResetPassCompletion = () => {
  return (
    <div className="flex min-h-tablet">
      <div className="m-auto flex max-w-[454px] flex-col items-center gap-7 rounded-[30px] bg-white p-[40px] shadow-form">
        <MailCircle />
        <p className="text-[22px] font-bold leading-[35.2px]">
          パスワード再設定用メールを送信しました
        </p>
        <div>
          <p className="font-bold leading-[25px]">
            送信されたメール内のURLから、新しいパスワードを設定してください。
          </p>
          <div className="mt-2 text-sm">
            <p>※メールが届かない場合は、迷惑メールに分類されている可能性がございます。</p>
            <p>
              ※URLの有効期限は24時間です。期限が切れた場合は、再度パスワード再発行の手続きを行なってください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassCompletion;
