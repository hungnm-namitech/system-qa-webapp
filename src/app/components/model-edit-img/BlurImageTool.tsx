import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Group, Image, Layer, Stage } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Check, LoaderCircle, Redo, Undo, X } from 'lucide-react';
import Button from '../button';
import BlurShape, { BlurShapeProps } from './BlurShape';
import SelectRectangle, { Shape } from './SelectRectangle';
import { useDeleteSelectedShape } from '@/app/hook/useDeleteSelectedShape';

export interface BlurImageToolProps {
  imageElement: HTMLImageElement | null;
  filterKind?: BlurShapeProps['filterKind'];
  filterSize?: number;
  setShapes: (item: Shape[]) => void;
  shapes: Shape[];
  setOpenModel: (data: boolean) => void;
  handleUploadImage: (blob: Blob) => void;
  loading: boolean;
  imageType: string;
}

const BlurImageTool = ({
  imageElement,
  filterKind = 'blur',
  filterSize = 50,
  shapes,
  setShapes,
  setOpenModel,
  handleUploadImage,
  loading,
  imageType,
}: BlurImageToolProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<Konva.Stage>(null);
  const [isSelectRedact, setIsSelectRedact] = useState<boolean>(false);
  const [draggingShape, setDraggingShape] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [calculatedSize, setCalculateSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [history, setHistory] = useState<Shape[][]>([]);
  const [redoStack, setRedoStack] = useState<Shape[][]>([]);

  const handleSubmit = () => {
    setSelectedId(null);
    process.nextTick(() => {
      if (!stageRef.current) return;
      stageRef.current.toBlob({
        callback: (blob: Blob | null) => {
          if (blob) {
            handleUploadImage(blob);
            loading && setOpenModel(false);
          } else {
            console.log('No blob was created');
          }
        },
        mimeType: imageType || 'image/png',
        pixelRatio: 2,
      });
    });
  };

  function updateShapes(newShapes: Shape[]) {
    setHistory((prevHistory) => [...prevHistory, shapes]);
    setRedoStack([]);
    setShapes(newShapes);
  }

  function handleRedo() {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const nextShapes = newRedoStack.shift()!;
      setHistory((prevHistory) => [...prevHistory, shapes]);
      setShapes(nextShapes);
      setRedoStack(newRedoStack);
    }
  }

  function handleUndo() {
    if (!!!shapes.length) return;

    if (history.length > 0) {
      const newHistory = [...history];
      const lastShapes = newHistory.pop()!;

      setRedoStack((prevRedoStack) => [shapes, ...prevRedoStack]);
      setShapes(lastShapes);
      setHistory(newHistory);
    } else {
      setRedoStack((prevRedoStack) => [shapes, ...prevRedoStack]);
      setHistory([]);
      setShapes([]);
    }
  }

  function handleAddMask() {
    const pointerPosition = stageRef.current?.getPointerPosition();
    if (!pointerPosition) {
      return null;
    }

    const _shapes = shapes.slice();
    const id = uuidv4();
    _shapes.push({
      id,
      x: pointerPosition.x,
      y: pointerPosition.y,
      width: 0,
      height: 0,
    });
    setShapes(_shapes);
    return id;
  }

  function selectShape(id: string | null) {
    setSelectedId(id);

    if (!id) {
      return;
    }

    const _shapes = shapes.slice();
    const index = _shapes.findIndex((shape) => shape.id === id);
    if (index > -1) {
      const shape = _shapes[index];
      _shapes.splice(index, 1);
      _shapes.push(shape);
      setShapes(_shapes);
    }
  }

  function handleRemove(id: string) {
    const _shapes = shapes.slice();
    const index = _shapes.findIndex((shape) => shape.id === id);
    if (index > -1) {
      _shapes.splice(index, 1);
      setShapes(_shapes);
    }
  }

  const handleDragStart = (e: KonvaEventObject<MouseEvent>) => {
    if (!isSelectRedact) return;
    const clickedOnEmpty = e.target.index === 0;
    if (!clickedOnEmpty) {
      return;
    }
    selectShape(null);

    const id = handleAddMask();
    setDraggingShape(id);
  };

  const handleDragMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!draggingShape || !isSelectRedact) {
      return;
    }

    const pointerPosition = stageRef.current?.getPointerPosition();
    if (!pointerPosition) {
      return;
    }

    const _shapes = shapes.slice();
    const shape = _shapes[_shapes.length - 1];
    shape.width = pointerPosition.x - shape.x;
    shape.height = pointerPosition.y - shape.y;
    setShapes(_shapes);
    const findShape = _shapes.find((item) => item.id == draggingShape);
    if (!findShape) {
      updateShapes(_shapes);
    }
  };

  const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!draggingShape || !isSelectRedact) {
      return;
    }

    const _shapes = shapes.slice();

    const shape = _shapes[_shapes.length - 1];
    if (Math.abs(shape.width) < 10 && Math.abs(shape.height) < 10) {
      _shapes.pop();
      setShapes(_shapes);
    } else {
      selectShape(draggingShape);
    }

    setDraggingShape(null);
  };

  const calculatorSize = useCallback(() => {
    let ratio = (imageElement?.width ?? 0) / (imageElement?.height ?? 0);
    if (isNaN(ratio)) {
      ratio = 0;
    }
    if (!imageElement?.width || !imageElement.height) return;
    const ratioSize = 0.7;

    let calculatedWidth = containerDimensions.width * ratioSize;
    let calculatedHeight = calculatedWidth / ratio;

    const maxHeight = window.innerHeight * ratioSize;
    if (calculatedHeight > maxHeight) {
      calculatedHeight = maxHeight;
      calculatedWidth = calculatedHeight * ratio;
    }

    const maxWidth = window.innerHeight * ratioSize;

    if (calculatedHeight > maxWidth) {
      calculatedWidth = maxWidth;
      calculatedHeight = calculatedWidth * ratio;
    }

    setCalculateSize({ width: calculatedWidth, height: calculatedHeight });
  }, [containerDimensions, imageElement]);

  useEffect(() => {
    if (containerRef.current) {
      const handleResize = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const canvasWidth = windowWidth;
        const canvasHeight = windowHeight;

        setContainerDimensions({ width: canvasWidth, height: canvasHeight });
        calculatorSize();
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    calculatorSize();
  }, [calculatorSize]);

  useDeleteSelectedShape(selectedId, (id) => {
    handleRemove(id);
    updateShapes(shapes.filter((shape) => shape.id !== id));
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex h-full w-full cursor-auto flex-col items-center justify-center',
        {
          'cursor-crosshair': isSelectRedact,
        },
      )}
    >
      {imageElement ? (
        <div className="flex flex-col gap-5">
          <div
            className={` flex items-center justify-between border-b-[1px] border-[rgba(0,0,0,0.1)] `}
            style={{
              width: calculatedSize.width + 'px',
            }}
          >
            <X
              onClick={() => {
                setOpenModel(false);
              }}
              className="cursor-pointer"
            />
            <div className="flex cursor-pointer items-center justify-center gap-2">
              <Undo
                onClick={handleUndo}
                className={cn({
                  'text-gray': shapes.length == 0,
                })}
              />
              <Redo
                onClick={handleRedo}
                className={cn({
                  'text-gray': redoStack.length == 0,
                })}
              />
            </div>
            <div>
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <p className={cn('cursor-pointer font-bold')}>
                  <Check onClick={handleSubmit} />
                </p>
              )}
            </div>
          </div>
          <Stage
            height={calculatedSize.height}
            width={calculatedSize.width}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            ref={stageRef}
            className="border"
            style={{
              cursor: isSelectRedact ? 'crosshair' : 'default',
            }}
          >
            <Layer>
              <Group>
                <Image
                  height={calculatedSize.height}
                  image={imageElement}
                  width={calculatedSize.width}
                  x={0}
                  y={0}
                />
              </Group>

              {shapes.map((shape, i) => {
                if (Math.abs(shape.height) <= 10 || Math.abs(shape.height) <= 10) {
                  return null;
                }

                return (
                  <BlurShape
                    filterKind={filterKind}
                    filterSize={filterSize}
                    imageElement={imageElement}
                    imageHeight={calculatedSize.height}
                    imageWidth={calculatedSize.width}
                    key={shape.id}
                    shape={shape}
                  />
                );
              })}

              <Group>
                {shapes.map((shape, i) => {
                  return (
                    <SelectRectangle
                      isSelected={shape.id === selectedId}
                      key={shape.id}
                      onChange={(newAttrs) => {
                        const _shapes = shapes.slice();
                        _shapes[i] = newAttrs;
                        setShapes(_shapes);
                        updateShapes(shapes.map((s, idx) => (idx === i ? newAttrs : s)));
                      }}
                      onRemove={() => {
                        handleRemove(shape.id);
                        updateShapes(shapes.filter((s) => s.id !== shape.id));
                      }}
                      onSelect={() => selectShape(shape.id)}
                      shape={shape}
                    />
                  );
                })}
              </Group>
            </Layer>
          </Stage>
          <Button
            onClick={() => setIsSelectRedact((prev) => !prev)}
            className={cn(
              'mb-5 flex flex-col items-center gap-1 border border-primary bg-transparent px-3 py-7 text-primary hover:brightness-90 active:bg-white active:brightness-50',
              {
                'bg-slate-400': isSelectRedact,
              },
            )}
          >
            <img src="/svg/blur_icon.svg" alt="img_blur" className="w-5" />
            <p className="text-[14px]">モザイク加工</p>
          </Button>
        </div>
      ) : (
        <div className="h-full max-h-[800px] w-full max-w-[1200px] py-7">
          <Skeleton className="h-full w-full bg-gray" />
        </div>
      )}
    </div>
  );
};

export default BlurImageTool;
