import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { Link, TrashCan } from '@/app/components/svg';

type Props = {
  className?: string;
};

const SkeletonManual = ({ className }: Props) => {
  return (
    <>
      <tbody>
        {Array.from('ABCDEFGH').map((item) => (
          <tr key={item}>
            <td className="py-3">
              <Skeleton className="h-4 w-5/6" />
            </td>
            <td className="py-3">
              <Skeleton className="h-4 w-5/6" />
            </td>
            <td className="py-3">
              <Skeleton className="h-4 w-5/6" />
            </td>
            <td className="py-3">
              <Skeleton className="h-4 w-5/6" />
            </td>
            <td className="py-3">
              <Skeleton className="h-4 w-5/6" />
            </td>
            <td className="flex items-center gap-8 p-3">
              <button>
                <Link />
              </button>
              <button>
                <TrashCan />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};

export default SkeletonManual;
