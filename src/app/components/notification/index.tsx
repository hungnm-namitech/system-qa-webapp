import React from 'react';
import { Tick } from '../svg';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

type Props = {
  content: string;
  className?: string;
};

const Notification = ({ content, className }: Props) => {
  return (
    <div
      className={twMerge(
        clsx(
          'fixed bottom-16 right-16 flex h-[50px] w-full max-w-[201px] animate-bounce-in-fwd items-center justify-center gap-[6px] rounded-[30px] bg-primary bg-opacity-75 text-white',
          className,
        ),
      )}
    >
      <span>
        <Tick />
      </span>
      <span className="text-sm font-bold leading-[22.4px]">{content}</span>
    </div>
  );
};

export default Notification;
