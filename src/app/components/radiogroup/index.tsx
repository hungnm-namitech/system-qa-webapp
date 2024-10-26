import { GENDER, USER_INPUT } from '@/app/constants/users.const';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React from 'react';
type Props = {
  label: string;
  onChange: () => void;
  value: string | null;
  disabled?: boolean;
};
export const RadioGroupGender = ({ label, value, onChange, disabled }: Props) => (
  <RadioGroup onValueChange={onChange} value={value || 'MALE'}>
    <p className="text-[16px] font-bold">{label}</p>
    {USER_INPUT.GENDER.map((gender) => (
      <div key={gender.value} className="flex items-center space-x-2">
        <RadioGroupItem disabled={disabled} value={gender.value} id={gender.value} />
        <Label className="text-sm font-normal" htmlFor={gender.value}>
          {gender.lable}
        </Label>
      </div>
    ))}
  </RadioGroup>
);
