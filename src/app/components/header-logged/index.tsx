'use client';

import { OPTIONS } from '@/app/constants/manual.const';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ArrowDown } from '../svg';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import OptionSetting from '../option-setting';
import { DropdownMenuTrigger, DropdownMenu } from '@/components/ui/dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import { getCurrentUser } from '@/app/api/entities/current-user';
import { useCurrentUser } from '@/app/store/current-user';
import Progressbar from '../progress-bar';
import { SkeletonText } from '../skeleton-text';

const HeaderManual = () => {
  const [isShowSetting, setIsShowSetting] = useState(false);
  const pathname = usePathname();
  const { push } = useRouter();
  const [options, setOptions] = useState<OPTIONS>();
  const saveCurrentUser = useCurrentUser((state) => state.saveCurrentUser);
  const currentUser = useCurrentUser((state) => state.currentUser);
  const afterClass = `after:absolute after:-bottom-[20px] after:w-[70px] after:rounded-3xl after:border-b-[3px] after:border-black after:content-['']`;
  useEffect(() => {
    if (pathname.includes('/manage/manual')) {
      setOptions(OPTIONS.MANUAL);
    } else if (pathname.includes('/manage/member/edit')) {
      setOptions(undefined);
    } else if (pathname.includes('/manage/member')) {
      setOptions(OPTIONS.MEMBER);
    } else if (pathname.includes('/search')) {
      setOptions(OPTIONS.SEARCH);
    }
  }, [pathname]);

  const {
    data: user,
    mutate,
    isSuccess,
    isPending,
  } = useMutation({
    mutationFn: () => getCurrentUser(),
  });

  useEffect(() => {
    mutate();
  }, []);

  useEffect(() => {
    if (user) saveCurrentUser(user.data);
    return () => user && saveCurrentUser(user.data);
  }, [user]);
  return (
    <div className="sticky left-0 right-0 top-0 z-50">
      <div className="flex h-[65px] items-center justify-between border-b border-[#E8E8E8] bg-white px-4">
        <div
          onClick={() => push('/manage/manual')}
          className="cursor-pointer font-sans text-[22px] font-bold"
        >
          <span className="text-primary">ManualAgent</span>
        </div>
        <div
          className={twMerge(
            clsx(
              'relative flex gap-8 text-sm',
              pathname !== '/manage/member/edit' && afterClass,
              // options === OPTIONS.SEARCH && 'after:left-[-10%]',
              options === OPTIONS.MANUAL && 'after:left-[-10%]',
              options === OPTIONS.MEMBER && 'after:left-[51%]',
            ),
          )}
        >
          <span
            onClick={() => {
              push('/manage/manual');
              setOptions(OPTIONS.MANUAL);
            }}
            className={twMerge(
              clsx(
                'cursor-pointer',
                'hover:opacity-70',
                'active:opacity-100',
                options === OPTIONS.SEARCH && 'font-normal',
                options === OPTIONS.MANUAL && 'font-bold',
                options === OPTIONS.MEMBER && 'font-normal',
              ),
            )}
          >
            手順書
          </span>
          <span
            onClick={() => {
              push('/manage/member');
              setOptions(OPTIONS.MEMBER);
            }}
            className={twMerge(
              clsx(
                'cursor-pointer',
                'hover:opacity-70',
                'active:opacity-100',
                options === OPTIONS.SEARCH && 'font-normal',
                options === OPTIONS.MEMBER && 'font-bold',
                options === OPTIONS.MANUAL && 'font-normal',
              ),
            )}
          >
            メンバー
          </span>
        </div>
        {isPending ? (
          <SkeletonText className="h-[38px] w-[100px]" />
        ) : (
          <DropdownMenu
            onOpenChange={() => setIsShowSetting(!isShowSetting)}
            open={isShowSetting}
          >
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-[14px] hover:opacity-70 active:opacity-100">
                <div>
                  <p className="text-[10px] leading-4">{currentUser.company}</p>
                  <p className="text-sm leading-[22.4px]">{currentUser.name}</p>
                </div>
                <div className={clsx(isShowSetting && 'rotate-180')}>
                  <ArrowDown />
                </div>
              </div>
            </DropdownMenuTrigger>
            <OptionSetting handleOpen={setIsShowSetting} />
          </DropdownMenu>
        )}
      </div>
      {isPending && <Progressbar />}
    </div>
  );
};

export default HeaderManual;
