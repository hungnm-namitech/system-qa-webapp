import * as React from 'react';

import { cn } from '@/lib/utils';
import { Eye, HiddenEye } from '@/app/components/svg';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  handleShowPass?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, handleShowPass, disabled, id, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          disabled={disabled}
          id={id}
          type={type}
          className={cn(
            'flex h-[45px] w-full rounded-sm border border-[#DBDBDF] bg-background px-3 py-2 text-base placeholder:text-[#DBDBDF] disabled:cursor-not-allowed disabled:opacity-50',
            className,
            disabled && 'bg-zinc-400',
          )}
          ref={ref}
          {...props}
        />

        {handleShowPass && (
          <div
            className="absolute right-3 top-[50%] translate-y-[-50%] cursor-pointer"
            onClick={(e) => handleShowPass(e)}
          >
            {type === 'password' ? <HiddenEye /> : <Eye />}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
