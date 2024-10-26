'use client';
import clsx from 'clsx';
import React from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';

type Props = {
  handleOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OptionSetting = ({ handleOpen }: Props) => {
  const { push } = useRouter();
  const classes =
    'flex h-[42px] min-w-[150px] items-center justify-center bg-white leading-[22.4px] hover:bg-[#F3F3F3]';

  const handleSignOut = () => {
    signOut({ redirect: false }).then(() => {
      push('/login');
    });
  };
  return (
    <DropdownMenuContent className="fixed right-[-2.75rem] top-[16px] rounded border-none p-0 shadow-none">
      <div>
        <button
          className={clsx(classes)}
          onClick={() => {
            handleOpen(false);
            push('/manage/member/edit');
          }}
        >
          アカウント設定
        </button>
        <button className={clsx(classes)} onClick={handleSignOut}>
          ログアウト
        </button>
      </div>
    </DropdownMenuContent>
  );
};

export default OptionSetting;
