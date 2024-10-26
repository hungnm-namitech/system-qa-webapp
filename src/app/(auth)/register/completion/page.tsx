import { MailCircle } from '@/app/components/svg';
import React from 'react';

const CompletionRegister = () => {
  return (
    <div className="flex min-h-tablet">
      <div className="m-auto flex max-w-[454px] flex-col items-center rounded-[30px] bg-white p-[40px] shadow-form">
        <MailCircle />
        <p className="mt-[30px] text-[22px] font-bold">確認メールを送信しました</p>
        <p className="mt-6 font-bold text-required">新規登録はまだ完了していません。</p>
        <div className="mt-6">
          <p className="font-bold">
            送信されたメール内のURLから、メールアドレスの確認を完了してください。
          </p>
          <div className="mt-3 text-sm">
            <p>※メールが届かない場合は、迷惑メールに分類されている可能性がございます。</p>
            <p>
              ※URLの有効期限は24時間です。期限が切れた場合は、再度新規登録の手続きを行なってください
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionRegister;
