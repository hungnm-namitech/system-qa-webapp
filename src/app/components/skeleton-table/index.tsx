import { Skeleton } from '@/components/ui/skeleton';
import { Drag, TrashCan } from '../svg';

export function SkeletonTable() {
  return (
    <>
      {Array.from('ABCD').map((item, key) => (
        <tr key={item} className="border-b border-slate-300 hover:bg-muted/50">
          <td className="flex h-full items-center justify-center p-2 font-bold leading-[25px] opacity-40">
            {key + 1}
          </td>
          <td className="cursor-grab border-l border-slate-300 py-2 pl-[18.77px] pr-[7.77px]">
            <Drag />
          </td>
          <td className="p-2 leading-[25.6px]">
            <Skeleton className="h-4 w-full min-w-[170px]" />
          </td>

          <td className="gap-8 p-2 pr-[18px]">
            <button>
              <TrashCan />
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
