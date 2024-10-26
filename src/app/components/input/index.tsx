import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forwardRef } from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isShowPass?: boolean;
  handleShowPass?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const TextInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, id, label, required, isShowPass, handleShowPass, ...props },
    ref,
  ) => {
    return (
      <div className="grid w-full items-center gap-1.5">
        <div className="flex items-center gap-2">
          <Label className="text-base font-bold leading-[25px] " htmlFor={id}>
            {label}
          </Label>
          {required === true && (
            <span className="flex h-[19px] w-[35px] items-center justify-center rounded-sm bg-required font-sans text-[11px] font-bold text-white">
              必須
            </span>
          )}
        </div>
        <Input
          type={type}
          id={id}
          ref={ref}
          handleShowPass={handleShowPass}
          {...props}
          className={className}
        />
      </div>
    );
  },
);

TextInput.displayName = 'TextField';

export { TextInput };
