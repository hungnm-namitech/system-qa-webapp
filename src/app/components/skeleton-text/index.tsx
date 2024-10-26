import { Skeleton } from '@/components/ui/skeleton';
import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
};

export function SkeletonText({ className }: Props) {
  return (
    <div className={twMerge('flex items-center space-x-4', className)}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
