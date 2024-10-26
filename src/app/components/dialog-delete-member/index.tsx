import { useMutation } from '@tanstack/react-query';
import Button from '../button';
import * as Users from '@/app/api/entities/users';
import { toast } from 'react-toastify';
import Notification from '@/app/components/notification';

type Props = {
  handleShow: () => void;
  user: { id: string; name: string };
  setIsDialogDelete: React.Dispatch<React.SetStateAction<boolean>>;
  getAllMembers: () => void;
};

export default function DialogDeleteMember({
  handleShow,
  setIsDialogDelete,
  user,
  getAllMembers,
}: Props) {
  const { mutate: deleMember } = useMutation({
    mutationFn: (id: string) => Users.deleteUser(id),
    onSuccess: () => {
      getAllMembers();
      setIsDialogDelete(false);
      toast(<Notification content="削除しました" className="max-w-[144px]" />, {
        hideProgressBar: true,
        style: { backgroundColor: 'transparent', boxShadow: 'none' },
        closeButton: false,
        position: 'bottom-right',
        autoClose: 4000,
      });
    },
    onError: (error) => toast.error(error.message),
  });
  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#0000004D] bg-opacity-30" />
      <div className="fixed top-[50%] z-10 flex min-h-[273px] w-[454px] translate-y-[-50%] flex-col items-center justify-between rounded-[20px] bg-white p-10">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-[22px] font-bold leading-[35.2px]">メンバーの削除</p>
          <p className="leading-[25.6px]">このメンバーを本当に削除しますか？</p>
          <p className="mt-3 font-bold leading-[25px]">{user.name}</p>
        </div>
        <div className="flex gap-[10px]">
          <Button
            onClick={handleShow}
            className="w-[182px] border border-primary bg-white text-primary hover:brightness-90 active:brightness-50"
          >
            キャンセル
          </Button>
          <Button
            className="w-[182px] bg-required hover:brightness-90 active:brightness-50"
            onClick={() => deleMember(user.id)}
          >
            削除する
          </Button>
        </div>
      </div>
    </>
  );
}
