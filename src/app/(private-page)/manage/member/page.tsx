'use client';
import * as Users from '@/app/api/entities/users';
import Button from '@/app/components/button';
import DialogAddMember from '@/app/components/dialog-add-member';
import DialogDeleteMember from '@/app/components/dialog-delete-member';
import { Account, TrashCan } from '@/app/components/svg';
import React, { useState } from 'react';
import { USER_ROLE, USER_ROLE_JP } from '@/app/constants/users.const';
import { useCurrentUser } from '@/app/store/current-user';
import { useQuery } from '@tanstack/react-query';
import SkeletonLoader from '@/app/components/skeleton-manual';
import Progressbar from '@/app/components/progress-bar';
import SkeletonMember from '@/app/components/skeleton-member';
import { Skeleton } from '@/components/ui/skeleton';
interface Member {
  id: number;
  name: string;
  email: string;
  privileges: string;
}

const Member = () => {
  const [isDialogDelete, setIsDialogDelete] = useState(false);
  const [isDialogAdd, setIsDialogAdd] = useState(false);
  const currentUser = useCurrentUser((state) => state.currentUser);
  const [user, setUser] = useState({ id: '', name: '' });

  const {
    data: members,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['all-members'],
    queryFn: Users.getAllMembers,
    select: (data) => data.data.users,
  });

  const { data: countMembers, isPending } = useQuery({
    queryKey: ['count-members'],
    queryFn: Users.countMembers,
    select: (data) => data.data.total,
  });

  const handleDialogDelete = () => {
    setIsDialogDelete(false);
  };
  const handleDialogAdd = () => {
    setIsDialogAdd(false);
  };

  return (
    <div className="flex flex-col items-center">
      {isLoading && <Progressbar />}
      <div className="mt-[32px] w-full px-10 tablet:max-w-[1024px] tablet:px-0">
        <div className="flex justify-between">
          <span className="text-left text-2xl font-bold leading-[38.4px]">
            メンバー({countMembers})
          </span>
          {currentUser.role === USER_ROLE.ADMIN && (
            <div>
              <Button
                onClick={() => setIsDialogAdd(true)}
                className="flex h-[38px] w-[160px] items-center justify-center gap-1 bg-primary hover:brightness-150 active:brightness-90"
              >
                <span>メンバーを招待</span>
                <Account />
              </Button>
            </div>
          )}
        </div>
        <div className="mt-4 overflow-x-auto rounded-3xl bg-white p-5 shadow-form">
          <div className="text-sm font-bold leading-[22.4px]">{currentUser.company}</div>
          <table className="w-full table-auto ">
            <thead className="text-left text-xs font-bold opacity-40">
              <tr>
                <th className="min-w-[200px] p-3 xlpc:min-w-[394px]">メンバー</th>
                <th className="min-w-[200px] p-3 xlpc:min-w-[394px]">メールアドレス</th>
                <th className="min-w-[100px]  p-3 xlpc:min-w-[148px]">権限</th>
                <th className="min-w-[46px]  p-3 xlpc:min-w-[46px]"></th>
              </tr>
            </thead>
            {isLoading ? (
              <SkeletonMember />
            ) : (
              <tbody>
                {members &&
                  members.map((member) => (
                    <tr
                      key={member.id}
                      className="border-t border-slate-300 text-sm leading-[22.4px] text-[#1B2245] hover:bg-muted/50"
                    >
                      <td className="p-3">{member.name}</td>
                      <td className="p-3">{member.email}</td>
                      <td className="p-3">
                        {member.role === USER_ROLE.ADMIN
                          ? USER_ROLE_JP.ADMIN
                          : USER_ROLE_JP.MEMBER}
                      </td>
                      {currentUser.role === USER_ROLE.ADMIN && (
                        <td className="p-3">
                          {member.role === USER_ROLE.MEMBER && (
                            <button
                              onClick={() => {
                                setUser({ id: member.id, name: member.name });
                                setIsDialogDelete(true);
                              }}
                            >
                              <TrashCan />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
      {isDialogDelete && (
        <DialogDeleteMember
          handleShow={handleDialogDelete}
          user={user}
          setIsDialogDelete={setIsDialogDelete}
          getAllMembers={refetch}
        />
      )}
      {isDialogAdd && (
        <DialogAddMember handleShow={handleDialogAdd} setIsDialogAdd={setIsDialogAdd} />
      )}
    </div>
  );
};

export default Member;
