'use client';
import Button from '@/app/components/button';
import { TextInput } from '@/app/components/input';
import { ArrowBack, CirclePlus, ImgBrokenSVG, Upload } from '@/app/components/svg';
import { Textarea } from '@/app/components/textarea';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Notification from '@/app/components/notification';
import { useParams, useRouter } from 'next/navigation';
import { STATUS_MANUAL, STATUS_MANUAL_JP } from '@/app/constants/manual.const';
import { useMutation } from '@tanstack/react-query';
import * as Manuals from '@/app/api/entities/manual';
import ImageWithFallback from '@/app/components/img-with-fallback';
import { Label } from '@/components/ui/label';
import { Manual, ManualStepsEdit, Step } from '@/app/types/manual';
import * as lodash from 'lodash';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import StepDrag from '@/app/components/step';
import { v4 as uuidv4 } from 'uuid';
import SkeletonEdit from '@/app/components/skeleton-edit';
import { SkeletonTable } from '@/app/components/skeleton-table';
import Progressbar from '@/app/components/progress-bar';
import { ERR_TITLE_MANUAL } from '@/app/constants/users.const';
import ModelEditImage from '@/app/components/model-edit-img';
import { useHiddenScrollBar } from '@/app/hook/useHiddenScrollBar';
import { Loader2 } from 'lucide-react';

const ManualEdit = () => {
  const [isUpdateActivate, setIsUpdateActivate] = useState(true);
  const [editImg, setEditImg] = useState<any>();
  const [openModel, setOpenModel] = useState<boolean>(false);
  const { id } = useParams();
  const { push } = useRouter();
  const [manualSteps, setManualSteps] = useState<Step[]>([]);
  const [title, setTitle] = useState('処理中...');
  const [isErrorTitle, setIsErrorTitle] = useState(false);
  const [manualDetail, setManualDetail] = useState<Manual>();
  const [manualStep, setManualStep] = useState<ManualStepsEdit>({
    title: '',
    steps: [],
    deleteStepIds: [],
  });

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const [isDisableTitle, setIsDisableTitle] = useState(true);

  const {
    data: steps,
    mutate: getSteps,
    isPending: isPendingSteps,
  } = useMutation({
    mutationFn: (id: string) => Manuals.getManualSteps(id),
    onSuccess: (data) => {
      const formatData = data.data.data.map((item) => {
        return lodash.mapValues(item, (value) => {
          return lodash.isNull(value) ? '' : value;
        });
      }) as Step[];
      setManualSteps(formatData);
    },
  });

  const {
    data: manual,
    mutate: getManual,
    isPending: isPendingManual,
  } = useMutation({
    mutationFn: (id: string) => Manuals.getManualDetail(id),
    onSuccess: (data) => {
      if (
        data.data.processingStatus === 'SUCCESS' ||
        data.data.processingStatus === 'FAIL'
      ) {
        updateManualStep(data.data.id, data.data.title);
        setManualDetail(data.data);
        setTitle(data.data.title);
        setIsDisableTitle(false);
        // 処理が完了した場合、インターバルをクリア
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      } else {
        // 処理が完了していない場合、再度インターバルをセット
        if (typeof id === 'string' && !intervalIdRef.current) {
          intervalIdRef.current = setInterval(() => {
            getManual(id);
          }, 3000);
        }
      }
    },
    onError: () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    },
  });

  useEffect(() => {
    if (typeof id === 'string') {
      getManual(id);
      getSteps(id);
    }
  }, [id]);

  const { mutate: updatedManual, isPending } = useMutation({
    mutationFn: (data: { id: string; manual: ManualStepsEdit }) =>
      Manuals.editManualSteps(data.id, data.manual),
    onSuccess: () => {
      toast(<Notification content="保存しました" className="max-w-[144px]" />, {
        hideProgressBar: true,
        style: { backgroundColor: 'transparent', boxShadow: 'none' },
        closeButton: false,
        position: 'bottom-right',
        autoClose: 4000,
      });
      if (typeof id === 'string') {
        getSteps(id);
        getManual(id);
        return () => {
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
          }
        };
      }
      setIsUpdateActivate(true);
      setIsErrorTitle(false);
    },
    onError: () => setIsErrorTitle(true),
  });

  const { mutate: uploadImg, data: upload } = useMutation({
    mutationFn: (data: { id: string; file: FormData }) =>
      Manuals.uploadImageStep(data.id, data.file),
  });

  const { mutate: publishManual, isPending: isPublishPending } = useMutation({
    mutationFn: (data: { id: string; status: STATUS_MANUAL }) =>
      Manuals.publishManual(data.id, data.status),
    onSuccess: () => {
      if (typeof id === 'string') getManual(id);
      toast(<Notification content="公開しました" className="max-w-[144px]" />, {
        hideProgressBar: true,
        style: { backgroundColor: 'transparent', boxShadow: 'none' },
        closeButton: false,
        position: 'bottom-right',
        autoClose: 4000,
      });
    },
  });

  const handlePublish = () => {
    if (typeof id === 'string') publishManual({ id, status: STATUS_MANUAL.PUBLIC });
  };
  const handleSave = () => {
    if (typeof id === 'string') updatedManual({ id, manual: manualStep });
  };

  const handleSubmitDel = (idStep: string) => {
    updateManualStep(idStep);
    setIsUpdateActivate(false);
    const filterSteps = manualSteps.filter((step) => step.id !== idStep);
    setManualSteps(filterSteps);
  };

  const handleChangeImg = (
    e: React.ChangeEvent<HTMLInputElement>,
    idStep: string,
    index: number,
  ) => {
    const { files } = e.target;
    if (files) {
      const formData = new FormData();
      formData.append('file', files[0]);
      console.log({ formData });
      const cloneManualSteps = lodash.cloneDeep(manualSteps);
      cloneManualSteps[index]['imageUrl'] = URL.createObjectURL(files[0]);
      setManualSteps(cloneManualSteps);
      if (typeof id === 'string')
        uploadImg(
          { id, file: formData },
          {
            onSuccess: (data) => {
              updateManualStep(idStep, data.data.path, 'imagePath');
              setIsUpdateActivate(false);
            },
          },
        );
    }
  };

  const updateManualStep = (id: string, value?: string, label?: string) => {
    const cloneManualStep = lodash.cloneDeep(manualStep) as any;
    const indexStep = lodash.findIndex(manualStep.steps, function (step) {
      return step.id === id;
    });
    const indexSteps = lodash.findIndex(manualSteps, function (step) {
      return step.id === id;
    });
    if (lodash.isString(label) && lodash.isString(value)) {
      if (indexStep >= 0) {
        cloneManualStep.steps[indexStep][label] = value;
        cloneManualStep.steps[indexStep]['step'] = indexSteps + 1;
      } else {
        cloneManualStep.steps.push({
          id,
          [label]: value,
          step: indexSteps + 1,
        });
      }
      return setManualStep(cloneManualStep);
    }
    if (lodash.isUndefined(value)) {
      cloneManualStep.deleteStepIds.push(id);
      return setManualStep(cloneManualStep);
    }
    if (lodash.isString(value) && lodash.isUndefined(label)) {
      cloneManualStep.title = value;
      return setManualStep(cloneManualStep);
    }
  };

  const isEdit = (value: string, label: string, id?: string) => {
    const cloneManualSteps = lodash.cloneDeep(manualSteps);
    const indexSteps = lodash.findIndex(manualSteps, function (step) {
      return step.id === id;
    });
    if (indexSteps >= 0) {
      switch (label) {
        case 'description':
          cloneManualSteps[indexSteps].description = value;
          break;
        case 'instruction':
          cloneManualSteps[indexSteps].instruction = value;
          break;
      }
    } else {
      if (manualDetail?.title !== value) {
        return setIsUpdateActivate(false);
      }
    }
    const isDef = lodash.isEqual(cloneManualSteps, manualSteps);
    if (!isDef && !!manualStep.title) {
      return setIsUpdateActivate(false);
    }
  };

  const handleChangeDes = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const { value } = e.target;
    isEdit(value, 'description', id);
    updateManualStep(id, value, 'description');
  };
  const handleChangeIns = (e: React.ChangeEvent<HTMLTextAreaElement>, id: string) => {
    const { value } = e.target;
    isEdit(value, 'instruction', id);
    updateManualStep(id, value, 'instruction');
  };

  const handleRemoveImg = (id: string, index: number) => {
    setIsUpdateActivate(false);
    updateManualStep(id, '', 'imagePath');
    const cloneManualSteps = lodash.cloneDeep(manualSteps);
    cloneManualSteps[index]['imageUrl'] = '';
    setManualSteps(cloneManualSteps);
  };

  const handleAddStep = () => {
    const id = uuidv4();
    const newStep = {
      id,
      step: manualSteps.length + 1,
      description: '',
      instruction: '',
      imageUrl: null,
      createdAt: '',
      updatedAt: '',
    };
    manualStep.steps.push({ id });
    setManualStep(manualStep);
    setManualSteps([...manualSteps, newStep]);
  };

  const findStep = useCallback(
    (id: string) => {
      const step = manualSteps.filter((step) => step.id === id)[0];
      return {
        step,
        index: manualSteps.indexOf(step),
      };
    },
    [manualSteps],
  );

  const moveStep = useCallback(
    (id: string, atIndex: number) => {
      const { step, index } = findStep(id);
      setManualSteps(
        update(manualSteps, {
          $splice: [
            [index, 1],
            [atIndex, 0, step],
          ],
        }),
      );
    },
    [findStep, manualSteps, setManualSteps],
  );

  useEffect(() => {
    const originalStep = steps?.data.data.map((item) => {
      return lodash.mapValues(item, (value) => {
        return lodash.isNull(value) ? '' : value;
      });
    }) as Step[];
    if (originalStep && !lodash.isEqual(manualSteps, originalStep)) {
      setIsUpdateActivate(false);
    } else setIsUpdateActivate(true);
    const cloneData = lodash.cloneDeep(manualSteps);
    const stepFake: Partial<
      Omit<Step, 'imageUrl' | 'createdAt' | 'updatedAt'> & { imagePath: string }
    >[] = [];
    cloneData.forEach((item, index) => {
      item.step = index + 1;
      stepFake.push({ id: item.id, step: index + 1 });
    });
    if (manualStep.steps.length) {
      stepFake.forEach((item, index) => {
        const indexManualStep = manualStep.steps.findIndex((step) => step.id === item.id);
        if (indexManualStep >= 0) {
          stepFake[index] = { ...manualStep.steps[indexManualStep], step: item.step };
        }
      });
    }
    setManualStep({ ...manualStep, steps: stepFake });
  }, [steps?.data, manualSteps]);

  useHiddenScrollBar(openModel);

  return (
    <div>
      {(isPendingSteps || isPendingManual) && <Progressbar />}
      <div className="flex">
        <div className="sticky top-[65px] min-h-tablet w-full min-w-[250px] max-w-[352px] self-start bg-white py-4">
          <div className="flex flex-col items-center ">
            <p className="text-[18px] font-bold leading-[28.8px]">手順書の編集</p>
            <div
              className={twMerge(
                clsx(
                  'mt-2 flex h-[22px] w-[52px] items-center justify-center rounded-3xl text-xs leading-[19.2px] text-white',
                  manualDetail?.visibilityStatus === STATUS_MANUAL.PRIVATE &&
                    'bg-primary opacity-30',
                  manualDetail?.visibilityStatus === STATUS_MANUAL.PUBLIC &&
                    ' bg-skyblue',
                ),
              )}
            >
              {manualDetail?.visibilityStatus === STATUS_MANUAL.PRIVATE
                ? STATUS_MANUAL_JP.PRIVATE
                : STATUS_MANUAL_JP.PUBLIC}
            </div>
            <div className="mt-[26px] w-full">
              <table className="h-fit w-full table-auto">
                <thead className="text-left text-xs font-bold opacity-40">
                  <tr className="border-b border-slate-300">
                    <th className="p-2 xlpc:min-w-[41px]">Step</th>
                    <th className="p-2"></th>
                    <th className="p-2 xlpc:w-full">見出し</th>
                    <th></th>
                  </tr>
                </thead>
                <DndProvider backend={HTML5Backend}>
                  <tbody className="break-anywhere">
                    {isPendingSteps ? (
                      <SkeletonTable />
                    ) : (
                      manualSteps &&
                      manualSteps.map((step, index) => (
                        <StepDrag
                          key={step.id}
                          id={step?.id}
                          order={index + 1}
                          description={step.description}
                          handleDelete={handleSubmitDel}
                          findStep={findStep}
                          moveStep={moveStep}
                        />
                      ))
                    )}
                  </tbody>
                </DndProvider>
              </table>
            </div>
          </div>
          <button
            className="mt-[18px] flex items-center gap-[7px] pl-[55px]"
            onClick={handleAddStep}
          >
            <CirclePlus />
            <span>手順を追加</span>
          </button>
        </div>
        <div className="flex grow flex-col gap-6 p-8 ">
          <div className="flex justify-between">
            <button
              className="flex items-center gap-[12.5px] hover:opacity-70 active:opacity-100"
              onClick={() => push(`/manage/manual/${id}/detail`)}
            >
              <ArrowBack />
              <span className="text-sm leading-[22.4px]">戻る</span>
            </button>
            <div className="flex gap-4">
              {manualDetail?.visibilityStatus === STATUS_MANUAL.PRIVATE && (
                <Button
                  className="w-[120px] border border-primary bg-transparent text-primary hover:bg-white hover:brightness-90 active:bg-white active:brightness-50"
                  onClick={handlePublish}
                  isSubmitting={isPublishPending}
                >
                  公開する
                </Button>
              )}
              <Button
                className="w-[120px] hover:brightness-150 active:brightness-90"
                onClick={handleSave}
                disabled={isUpdateActivate}
                isSubmitting={isPending}
              >
                保存する
              </Button>
            </div>
          </div>

          <div className="relative rounded-xl bg-white p-6 shadow-form">
            <TextInput
              disabled={isDisableTitle}
              label="タイトル"
              id="title"
              value={title}
              type="text"
              onChange={(e) => {
                setTitle(e.target.value);
                setIsErrorTitle(false);
                if (typeof id === 'string') {
                  isEdit(e.target.value, 'title');
                  updateManualStep(id, e.target.value);
                }
              }}
              className={clsx(isErrorTitle && 'border-red-600')}
            />
            {isDisableTitle && (
              <Loader2 className="absolute right-7 top-[56%] mr-2 h-4 w-4 animate-spin" />
            )}
            {isErrorTitle && (
              <p className="mt-2 text-xs text-required">{ERR_TITLE_MANUAL}</p>
            )}
          </div>

          {isPendingSteps ? (
            <SkeletonEdit />
          ) : (
            manualSteps &&
            manualSteps.map((step, index) => (
              <div key={step.id} className="rounded-b-xl shadow-form">
                <div className="flex h-10 items-center rounded-t-xl bg-[#5C74A2] px-[23.95px] text-[18px] font-bold leading-[28.8px] text-white">
                  Step.{index + 1}
                </div>
                <div className="rounded-b-xl bg-white p-8">
                  <TextInput
                    disabled={isPending}
                    label="見出し"
                    id="description"
                    type="text"
                    defaultValue={step.description}
                    className="mb-3"
                    onChange={(e) => handleChangeDes(e, step.id)}
                  />
                  <Textarea
                    disabled={isPending}
                    label="キャプション"
                    id="instruction"
                    className="resize-none"
                    defaultValue={step.instruction}
                    onChange={(e) => handleChangeIns(e, step.id)}
                  />
                  {!!step.imageUrl ? (
                    <div className="mt-[25px] flex items-end gap-6">
                      <div className="flex-1">
                        <ImageWithFallback
                          src={step.imageUrl}
                          fallbackSrc={ImgBrokenSVG}
                        />
                      </div>
                      <div className="inline-flex h-fit flex-col gap-3">
                        <div>
                          <Label
                            htmlFor={step.id}
                            className={clsx(
                              'cursor-pointer rounded-sm border border-primary bg-white px-[19px] py-[8.75px] text-base leading-[25.6px] text-primary opacity-70 hover:brightness-90 active:brightness-50',
                              isPending && 'opacity-30',
                            )}
                          >
                            画像を置換
                          </Label>
                          <input
                            disabled={isPending}
                            type="file"
                            id={step.id}
                            hidden
                            onChange={(e) => handleChangeImg(e, step.id, index)}
                          />
                        </div>
                        <Button
                          disabled={isPending}
                          className="h-[38px] w-[120px] border border-primary bg-white text-primary opacity-70 hover:brightness-90 active:brightness-50"
                          onClick={(e) => {
                            setEditImg({ ...step, index });
                            setOpenModel(true);
                          }}
                        >
                          画像を編集
                        </Button>
                        <Button
                          disabled={isPending}
                          className="h-[38px] w-[120px] border border-required bg-white text-base text-required opacity-70 hover:brightness-90 active:brightness-50"
                          onClick={(e) => handleRemoveImg(step.id, index)}
                        >
                          画像を削除
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={clsx('mt-6', isPending && 'opacity-30')}>
                      <Label
                        htmlFor={step.id}
                        className="flex h-[154px] w-full cursor-pointer items-center justify-center gap-[9px] rounded border border-dashed border-[#DBDBDF]"
                      >
                        <Upload />
                        <span>画像をアップロード</span>
                      </Label>
                      <input
                        disabled={isPending}
                        type="file"
                        id={step.id}
                        hidden
                        onChange={(e) => handleChangeImg(e, step.id, index)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {/* {} */}
          <div className="flex justify-end">
            <div className="flex gap-4">
              {manualDetail?.visibilityStatus === STATUS_MANUAL.PRIVATE && (
                <Button
                  className="w-[120px] border border-primary bg-transparent text-primary hover:bg-white hover:brightness-90 active:bg-white active:brightness-50"
                  onClick={handlePublish}
                  isSubmitting={isPublishPending}
                  disabled={isPending}
                >
                  公開する
                </Button>
              )}
              <Button
                className="w-[120px] hover:brightness-150 active:brightness-90"
                onClick={handleSave}
                disabled={isUpdateActivate}
                isSubmitting={isPending}
              >
                保存する
              </Button>
            </div>
          </div>
        </div>
      </div>
      {openModel && (
        <ModelEditImage
          data={editImg}
          manualSteps={manualSteps}
          setOpenModel={setOpenModel}
          setManualSteps={setManualSteps}
          updateManualStep={updateManualStep}
          setIsUpdateActivate={setIsUpdateActivate}
        />
      )}
    </div>
  );
};

export default memo(ManualEdit);
