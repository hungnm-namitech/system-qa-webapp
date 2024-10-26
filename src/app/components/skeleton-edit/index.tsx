import { Label } from '@/components/ui/label';
import React from 'react';
import { TextInput } from '../input';
import { Textarea } from '../textarea';
import SkeletonImg from '../skeleton-img';
import clsx from 'clsx';
import Button from '../button';

const SkeletonEdit = () => {
  return (
    <div className="mt-6 rounded-xl bg-white shadow-form">
      <div className="flex h-10 items-center rounded-t-xl bg-[#5C74A2] px-[23.95px] text-[18px] font-bold leading-[28.8px] text-white">
        Step.
      </div>
      <div className="flex flex-col gap-[25px] p-8">
        <TextInput label="見出し" />
        <Textarea label="キャプション" />
        <div className="mt-[25px] flex items-end gap-6">
          <div className="flex-1">
            <SkeletonImg />
          </div>
          <div className="inline-flex h-fit flex-col gap-3">
            <div>
              <Label
                className={clsx(
                  'cursor-pointer rounded-sm border border-primary bg-transparent px-[19px] py-[8.75px] text-base leading-[25.6px] text-primary opacity-70',
                )}
              >
                画像を置換
              </Label>
              <input type="file" hidden />
            </div>
            <Button className="h-[38px] w-[120px] border border-required bg-transparent text-base text-required opacity-70">
              画像を削除
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonEdit;
