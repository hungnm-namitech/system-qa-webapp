import { Label } from '@/components/ui/label';
import { Textarea as TextareaUI } from '@/components/ui/textarea';
import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, id, label, ...props }, ref) => {
    return (
      <div className="grid w-full gap-1.5">
        <Label className="text-base font-bold" htmlFor={id}>
          {label}
        </Label>
        <TextareaUI {...props} id={id} className={className} ref={ref} />
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
