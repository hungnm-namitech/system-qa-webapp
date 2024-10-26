'use client';

import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import * as Manual from '@/app/api/entities/manual';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import ImageWithFallback from '@/app/components/img-with-fallback';
import { ImgBrokenSVG } from '@/app/components/svg';
import { STATUS_MANUAL } from '@/app/constants/manual.const';
import InstructionHeading from '@/app/components/instruction-heading';

const ManualPreview = () => {
  const { id } = useParams();
  const { push } = useRouter();

  const { data: manualDetail } = useQuery({
    queryKey: ['manual-detail', id],
    queryFn: () => {
      if (typeof id === 'string')
        return Manual.getManualDetail(id, STATUS_MANUAL.PUBLIC).catch(() =>
          push('/not-found'),
        );
    },
    select: (data) => data?.data,
  });

  const { data: manualSteps } = useQuery({
    queryKey: ['manual-steps', id],
    queryFn: () => {
      if (typeof id === 'string')
        return Manual.getManualSteps(id, STATUS_MANUAL.PUBLIC).catch(() =>
          push('/not-found'),
        );
    },
    select: (data) => data?.data.data,
  });

  return (
    <div className="mx-8 mt-[5px] max-w-[1022px] p-10 tablet:mx-auto xlpc:mx-auto">
      <p className="text-[22px] font-bold leading-[35.2px]">{manualDetail?.title}</p>
      <div className="mt-4 w-full max-w-[200px] text-xs opacity-60 xlpc:w-full">
        <span className="font-bold leading-[19.2px]">{manualDetail?.author.name}</span>
        <div className="flex items-center justify-between leading-[19.2px]">
          <span>作成日時</span>
          {manualDetail?.createdAt && (
            <span>{format(manualDetail.createdAt, 'yyyy/MM/dd hh:mm')}</span>
          )}
        </div>
        <div className="flex items-center justify-between leading-[19.2px]">
          <span>最終更新日時</span>
          {manualDetail?.updatedAt && (
            <span>{format(manualDetail.updatedAt, 'yyyy/MM/dd hh:mm')}</span>
          )}
        </div>
      </div>
      {manualSteps &&
        manualSteps.map((step, index) => (
          <div key={index} className="mt-6 rounded-b-xl shadow-form">
            <div className="flex h-10 items-center rounded-t-xl bg-[#5C74A2] px-[23.95px] text-[18px] font-bold leading-[28.8px] text-white">
              Step.{step.step}
            </div>
            <div className="rounded-b-xl bg-white p-8">
              <p className="break-words text-[18px] font-bold leading-[28.8px]">
                <InstructionHeading step={step} />
              </p>
              <p className="mt-1 text-sm leading-[22.4px]">{step.instruction}</p>
              {step.imageUrl && (
                <div className="mt-[25px] flex justify-center">
                  <ImageWithFallback src={step.imageUrl} fallbackSrc={ImgBrokenSVG} />
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ManualPreview;
