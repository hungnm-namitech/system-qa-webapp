import * as Manuals from '@/app/api/entities/manual';
import useImageElement from '@/app/hook/useImageElement';
import { Step } from '@/app/types/manual';
import { useMutation } from '@tanstack/react-query';
import * as lodash from 'lodash';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BlurImageTool from './BlurImageTool';
import { Shape } from './SelectRectangle';

interface IndexedStep extends Step {
  index: number;
}
type Props = {
  data: IndexedStep;
  setOpenModel: (data: boolean) => void;
  manualSteps: Step[];
  setManualSteps: (data: Step[]) => void;
  updateManualStep: (id: string, value?: string, label?: string) => void;
  setIsUpdateActivate: (data: boolean) => void;
};

export default function ModelEditImage({
  data,
  setOpenModel,
  manualSteps,
  setManualSteps,
  updateManualStep,
  setIsUpdateActivate,
}: Props) {
  const { id } = useParams();
  const { imageElement, error, imageType } = useImageElement(data?.imageUrl || '');

  const [loading, setLoading] = useState<boolean>(false);
  const { mutate: uploadImg, data: upload } = useMutation({
    mutationFn: (data: { id: string; file: FormData }) =>
      Manuals.uploadImageStep(data.id, data.file),
  });
  const [shapes, setShapes] = useState<Shape[]>([]);

  const handleUploadImage = (blob: Blob) => {
    if (blob && data) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', blob);
      const cloneManualSteps = lodash.cloneDeep(manualSteps);
      cloneManualSteps[data.index]['imageUrl'] = URL.createObjectURL(blob);
      setManualSteps(cloneManualSteps);
      if (typeof id === 'string')
        uploadImg(
          { id, file: formData },
          {
            onSuccess: (dataResponse) => {
              updateManualStep(data.id, dataResponse.data.path, 'imagePath');
              setIsUpdateActivate(false);
            },
            onSettled: () => {
              setOpenModel(false);
              setLoading(false);
            },
          },
        );
    }
  };

  const ToastErrorMessage = () => {
    toast('画像をまだ処理中のため、前のページに戻ります。', {
      autoClose: 2000,
      type: 'error',
      position: 'bottom-right',
    });
    setOpenModel(false);
  };

  useEffect(() => {
    if (error) {
      setOpenModel(false);
      ToastErrorMessage();
    }
  }, [error]);

  return (
    <div className="fixed left-0 top-0 z-[9999] h-full w-full bg-white">
      <div className=" flex h-full flex-col items-center justify-center gap-5">
        <BlurImageTool
          imageElement={imageElement}
          filterKind="pixelate"
          filterSize={20}
          setShapes={setShapes}
          shapes={shapes}
          loading={loading}
          imageType={imageType}
          setOpenModel={setOpenModel}
          handleUploadImage={handleUploadImage}
        />
      </div>
    </div>
  );
}
