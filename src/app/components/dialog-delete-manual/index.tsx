import Button from '../button';
import { toast } from 'react-toastify';
import Notification from '../notification';

type Props = {
  handleShow: () => void;
  title: string;
  handleSubmit: () => void;
};

export default function DialogDeleteManual({ handleShow, handleSubmit, title }: Props) {
  const handleDelete = () => {
    try {
      handleSubmit();
      toast(<Notification content="削除しました" className="max-w-[144px]" />, {
        hideProgressBar: true,
        style: { backgroundColor: 'transparent', boxShadow: 'none' },
        closeButton: false,
        position: 'bottom-right',
        autoClose: 4000,
      });
    } catch (error) {
      toast.error('削除に失敗しました', {
        hideProgressBar: true,
        closeButton: false,
        position: 'bottom-right',
        autoClose: 4000,
      });
    }
  };
  return (
    <div>
      <div className="fixed inset-0 z-0 bg-[#0000004D] bg-opacity-30" />
      <div className="fixed left-[50%] top-[50%] z-10 flex min-h-[224px] w-[454px] translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-between rounded-[20px] bg-white p-10">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-[22px] font-bold leading-[35.2px]">手順書の削除</p>
          <p className="leading-[25.6px]">「{title}」を削除しますか？</p>
        </div>
        <div className="flex gap-[10px]">
          <Button
            onClick={handleShow}
            className="w-[182px] border border-primary bg-white text-primary hover:brightness-90 active:brightness-50"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleDelete}
            className="w-[182px] bg-required hover:brightness-90 active:brightness-50"
          >
            削除する
          </Button>
        </div>
      </div>
    </div>
  );
}
