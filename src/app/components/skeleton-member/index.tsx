import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const SkeletonMember = () => {
  return (
    <>
      <tbody>
        {Array.from('ABCDEFGH').map((item) => (
          <tr key={item}>
            <td className="p-3">
              <Skeleton className="h-4 w-4/6" />
            </td>
            <td className="p-3">
              <Skeleton className="h-4 w-4/6" />
            </td>
            <td className="p-3">
              <Skeleton className="h-4 w-4/6" />
            </td>
            <td className="p-3">
              <Skeleton className="h-4 w-4/6" />
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};

export default SkeletonMember;
