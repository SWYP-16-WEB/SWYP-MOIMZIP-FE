import { CheckIcon } from '@/shared/assets';
import { cn } from '@/shared/utils/cn';

interface SelectionIndicatorProps {
  selected: boolean;
  className?: string;
}

export const SelectionIndicator = ({ selected, className }: SelectionIndicatorProps) => (
  <span
    aria-hidden='true'
    className={cn(
      'inline-flex size-[2.5rem] shrink-0 items-center justify-center rounded-full',
      selected ? 'bg-brand-secondary text-text-white' : 'bg-bg-primary text-text-white/20',
      className,
    )}
  >
    <CheckIcon width={24} height={24} focusable='false' />
  </span>
);
