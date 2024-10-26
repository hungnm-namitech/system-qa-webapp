'use client';

import React, { memo, useEffect, useRef, useState } from 'react';
import { Drag, TrashCan } from '@/app/components/svg';
import { useDrag, useDrop } from 'react-dnd';
import clsx from 'clsx';
import { Step } from '@/app/types/manual';

type Props = {
  id: string;
  order: number;
  description: string;
  handleDelete: (id: string) => void;
  moveStep: (id: string, to: number) => void;
  findStep: (id: string) => {
    index: number;
    step: Step;
  };
};

interface Item {
  id: string;
  originalIndex: number;
}

const StepDrag = ({
  id,
  description,
  order,
  handleDelete,
  moveStep,
  findStep,
}: Props) => {
  const refDrag = useRef<HTMLDivElement>(null);
  const refDrop = useRef<HTMLTableRowElement>(null);
  const originalIndex = findStep(id).index;
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'step',
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveStep(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveStep],
  );

  const [, drop] = useDrop(
    () => ({
      accept: 'step',
      hover({ id: draggedId }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = findStep(id);
          moveStep(draggedId, overIndex);
        }
      },
    }),
    [findStep, moveStep],
  );

  drag(refDrag);
  dragPreview(refDrop);
  drop(refDrop, {});

  return (
    <tr
      ref={refDrop}
      className={clsx(
        'border-b border-slate-300 hover:bg-muted/50',
        isDragging && 'opacity-0',
      )}
    >
      <td className="flex h-full items-center justify-center p-2 font-bold leading-[25px] opacity-40">
        {order}
      </td>
      <td className="cursor-grab border-l border-slate-300 py-2 pl-[18.77px] pr-[7.77px]">
        <div ref={refDrag}>
          <Drag />
        </div>
      </td>
      <td className="w-64 max-w-56 p-2 leading-[25.6px]">
        {' '}
        {/* 幅を固定 */}
        <div className="truncate" title={description}>
          {description}
        </div>
      </td>
      <td className="gap-8 p-2 pr-[18px]">
        <button onClick={() => handleDelete(id)}>
          <TrashCan />
        </button>
      </td>
    </tr>
  );
};

export default memo(StepDrag);
