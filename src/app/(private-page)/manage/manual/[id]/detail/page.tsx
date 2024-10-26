'use client';
import {
  ArrowBack,
  ArrowDown,
  ImgBrokenSVG,
  Link,
  PencilEdit,
  TrashCan,
} from '@/app/components/svg';
import clsx from 'clsx';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Notification from '@/app/components/notification';
import DialogDeleteManual from '@/app/components/dialog-delete-manual';
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as Manual from '@/app/api/entities/manual';
import { STATUS_MANUAL, STATUS_MANUAL_JP } from '@/app/constants/manual.const';
import ImageWithFallback from '@/app/components/img-with-fallback';
import { format } from 'date-fns';
import Progressbar from '@/app/components/progress-bar';
import SkeletonImg from '@/app/components/skeleton-img';
import { SkeletonText } from '@/app/components/skeleton-text';
import { Skeleton } from '@/components/ui/skeleton';
import InstructionHeading from '@/app/components/instruction-heading';

const ManualDetail = () => {
  const { id } = useParams();
  const { push } = useRouter();
  const [isDialogDelete, setIsDialogDelete] = useState(false);
  const [title, setTitle] = useState('');
  const [isShowStatus, setIsShowStatus] = useState(false);

  const {
    data: manualDetail,
    refetch,
    isPending: isPendingDetail,
  } = useQuery({
    queryKey: ['manual-detail', id],
    queryFn: () => {
      if (typeof id === 'string') return Manual.getManualDetail(id);
    },
    select: (data) => data?.data,
  });

  const { data: manualSteps, isPending: isPendingSteps } = useQuery({
    queryKey: ['manual-steps', id],
    queryFn: () => {
      if (typeof id === 'string') return Manual.getManualSteps(id);
    },
    select: (data) => data?.data.data,
  });

  const { mutate: delManual } = useMutation({
    mutationFn: (id: string) => Manual.deleteManual(id),
    onSuccess: () => {
      setIsDialogDelete(false);
      push('/manage/manual');
    },
  });

  const handleLink = () => {
    if (manualDetail?.url) {
      navigator.clipboard.writeText(manualDetail?.url).then(() =>
        toast(<Notification content="URLをコピーしました" className="max-w-[201px]" />, {
          hideProgressBar: true,
          style: { backgroundColor: 'transparent', boxShadow: 'none' },
          closeButton: false,
          position: 'bottom-right',
          autoClose: 4000,
        }),
      );
    } else return;
  };

  const handleDelete = (title: string) => {
    setTitle(title);
    setIsDialogDelete(true);
  };

  const handleDialogDelete = () => {
    setIsDialogDelete(false);
  };

  const handleSubmitDel = () => {
    if (typeof id === 'string') delManual(id);
  };

  const { mutate: publishManual, isPending: isPendingPublish } = useMutation({
    mutationFn: (data: { id: string; status: STATUS_MANUAL }) =>
      Manual.publishManual(data.id, data.status),
    onSuccess: (_, variables) => {
      refetch();
      setIsShowStatus(false);
      const statusMessage =
        variables.status === STATUS_MANUAL.PUBLIC ? '公開' : '非公開に';
      toast(
        <Notification content={`${statusMessage}しました`} className="max-w-[144px]" />,
        {
          hideProgressBar: true,
          style: { backgroundColor: 'transparent', boxShadow: 'none' },
          closeButton: false,
          position: 'bottom-right',
          autoClose: 4000,
        },
      );
    },
  });

  const handleChangeStatus = (status: STATUS_MANUAL) => {
    if (typeof id === 'string') publishManual({ id, status: status });
  };

  const SkeletonStep = () => (
    <div className="mt-6 rounded-xl bg-white shadow-form">
      <div className="flex h-10 items-center rounded-t-xl bg-[#5C74A2] px-[23.95px] text-[18px] font-bold leading-[28.8px] text-white">
        Step.
      </div>
      <div className="flex flex-col gap-[25px] p-8">
        <SkeletonText />
        <SkeletonImg />
      </div>
    </div>
  );

  return (
    <>
      {(isPendingDetail || isPendingSteps || isPendingPublish) && <Progressbar />}
      <div className="mx-8 mt-8 max-w-[1022px] tablet:mx-auto xlpc:mx-auto">
        <div className="flex justify-between">
          <button
            className="flex items-center gap-[12.5px] hover:opacity-70 active:opacity-100"
            onClick={() => push(`/manage/manual`)}
          >
            <ArrowBack />
            <span className="text-[22px] font-bold leading-[35.2px]">
              {manualDetail?.title}
            </span>
          </button>
          <div className="flex gap-4 text-sm leading-[22.4px]">
            <button
              disabled={manualDetail?.visibilityStatus === STATUS_MANUAL.PRIVATE}
              className={clsx(
                'flex items-center gap-1',
                manualDetail?.visibilityStatus !== STATUS_MANUAL.PRIVATE &&
                  'hover:opacity-70',
                manualDetail?.visibilityStatus !== STATUS_MANUAL.PRIVATE &&
                  'active:opacity-100',
                manualDetail?.visibilityStatus === STATUS_MANUAL.PRIVATE && 'opacity-30',
              )}
              onClick={handleLink}
            >
              <Link />
              <span>URLをコピー</span>
            </button>
            <button
              className="flex items-center gap-1 hover:opacity-70 active:opacity-100"
              onClick={() => push(`/manage/manual/${id}/edit`)}
            >
              <PencilEdit />
              <span>編集</span>
            </button>
            <button
              className="flex items-center gap-1 hover:opacity-70 active:opacity-100"
              onClick={() => {
                if (manualDetail) handleDelete(manualDetail?.title);
              }}
            >
              <TrashCan />
              <span className="text-required">削除</span>
            </button>
          </div>
        </div>
        {isPendingDetail ? (
          <div className="flex flex-col gap-[17px]">
            <Skeleton className="h-4 w-10 bg-white" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-[200px] bg-white" />
              <Skeleton className="h-4 w-[200px] bg-white" />
            </div>
          </div>
        ) : (
          <div>
            <DropdownMenu
              onOpenChange={() => setIsShowStatus(!isShowStatus)}
              open={isShowStatus}
            >
              <DropdownMenuTrigger asChild>
                <div className="mt-[17px] flex cursor-pointer items-center gap-[14px]">
                  <div
                    className={clsx(
                      'flex h-[22px] w-[52px] items-center justify-center rounded-3xl text-xs leading-[19.2px] text-white',
                      manualDetail?.visibilityStatus === STATUS_MANUAL.PUBLIC &&
                        'bg-skyblue',
                      manualDetail?.visibilityStatus === STATUS_MANUAL.PRIVATE &&
                        'bg-primary opacity-30',
                    )}
                  >
                    {manualDetail?.visibilityStatus === STATUS_MANUAL.PUBLIC
                      ? STATUS_MANUAL_JP.PUBLIC
                      : STATUS_MANUAL_JP.PRIVATE}
                  </div>
                  <div className={clsx(isShowStatus && 'rotate-180')}>
                    <ArrowDown />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="fixed left-[-32rem] top-[8px] min-w-fit rounded border-[#DBDBDF] p-0 shadow-none">
                <div className="flex flex-col ">
                  <button
                    className={clsx(
                      'flex h-[42px] w-[80px] cursor-pointer items-center justify-center hover:opacity-70 active:opacity-100',
                      manualDetail?.visibilityStatus === STATUS_MANUAL.PUBLIC
                        ? 'bg-[#F3F3F3]'
                        : 'bg-white',
                    )}
                    onClick={() => handleChangeStatus(STATUS_MANUAL.PUBLIC)}
                  >
                    <div
                      className={clsx(
                        'flex h-[22px] w-[52px] items-center justify-center rounded-3xl text-xs leading-[19.2px] text-white',
                        manualDetail?.visibilityStatus === STATUS_MANUAL.PUBLIC
                          ? 'bg-skyblue'
                          : 'bg-skyblue',
                      )}
                    >
                      {STATUS_MANUAL_JP.PUBLIC}
                    </div>
                  </button>
                  <div
                    className={clsx(
                      'flex h-[42px] w-[80px] cursor-pointer items-center justify-center hover:opacity-70 active:opacity-100',
                      manualDetail?.visibilityStatus === STATUS_MANUAL.PRIVATE
                        ? 'bg-[#F3F3F3]'
                        : 'bg-white',
                    )}
                  >
                    <button
                      className={clsx(
                        'flex h-[22px] w-[52px] items-center justify-center rounded-3xl text-xs leading-[19.2px] text-white',
                        manualDetail?.visibilityStatus === STATUS_MANUAL.PRIVATE
                          ? 'bg-primary opacity-30'
                          : 'bg-primary opacity-30',
                      )}
                      onClick={() => handleChangeStatus(STATUS_MANUAL.PRIVATE)}
                    >
                      {STATUS_MANUAL_JP.PRIVATE}
                    </button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="mt-4 w-full max-w-[200px] text-xs opacity-60 xlpc:w-full">
              <span className="font-bold leading-[19.2px]">
                {manualDetail?.author.name}
              </span>
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
          </div>
        )}

        {isPendingSteps ? (
          <SkeletonStep />
        ) : (
          <div className="mt-6 space-y-6 pb-16">
            {manualSteps &&
              manualSteps.map((step) => (
                <div key={step.id} className="rounded-b-xl shadow-form">
                  <div className="flex h-10 items-center rounded-t-xl bg-[#5C74A2] px-[23.95px] text-[18px] font-bold leading-[28.8px] text-white">
                    Step.{step.step}
                  </div>
                  <div className="rounded-b-xl bg-white p-8">
                    <p className="break-words text-[18px] font-bold leading-[28.8px]">
                      <InstructionHeading step={step} />
                    </p>
                    <p className="mt-1 break-words text-sm leading-[22.4px]">
                      {step.instruction}
                    </p>
                    {step.imageUrl && (
                      <div className="mt-[25px] flex justify-center">
                        <ImageWithFallback
                          src={step.imageUrl}
                          fallbackSrc={ImgBrokenSVG}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      {isDialogDelete && (
        <DialogDeleteManual
          handleShow={handleDialogDelete}
          title={title}
          handleSubmit={handleSubmitDel}
        />
      )}
    </>
  );
};

export default ManualDetail;
