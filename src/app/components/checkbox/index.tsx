import clsx from 'clsx';
import * as React from 'react';

import { twMerge } from 'tailwind-merge';

export interface InputProps
  extends Partial<React.InputHTMLAttributes<HTMLInputElement>> {}

const Checkbox = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'checkbox', value, checked, onChange, ...rest }, ref) => {
    const beforeClass =
      "before:absolute before:left-0 before:block before:h-[16px] before:w-[16px] before:rounded-[2px] before:border-[1px] before:border-primary before:bg-white before:content-['']";
    const afterClass =
      "checked:after:webkit-transform checked:after:ms-transform checked:after:absolute checked:after:left-[6px] checked:after:top-[2px] checked:after:block checked:after:h-[10px] checked:after:w-[5px] checked:after:rotate-45 checked:after:border-b-[1px] checked:after:border-r-[1px] checked:after:border-primary checked:after:content-['']";
    return (
      <input
        type={type}
        className={twMerge(
          clsx('relative h-0 w-0 cursor-pointer', beforeClass, afterClass, className),
        )}
        ref={ref}
        {...rest}
        value={value}
        checked={checked}
        onChange={onChange}
      />
    );
  },
);
Checkbox.displayName = 'Input';

export { Checkbox };
