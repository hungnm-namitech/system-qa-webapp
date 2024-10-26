import { Button as ButtonUI } from '@/components/ui/button';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
  className?: string;
  children: React.ReactNode;
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isSubmitting, className, disabled, children, ...rest }, ref) => {
    return (
      <>
        <ButtonUI
          disabled={disabled || isSubmitting}
          className={twMerge(
            clsx(
              'm-auto h-[46px] rounded-sm bg-primary text-white',
              disabled && 'bg-[#DBDBDF]',
              className,
            ),
          )}
          {...rest}
          ref={ref}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {children}
        </ButtonUI>
      </>
    );
  },
);

Button.displayName = 'Button';

export default Button;
