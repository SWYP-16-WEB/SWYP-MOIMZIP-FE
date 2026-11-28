import { cn } from '@/shared/utils/cn';

import { TextButton } from '../button';

interface CopyFieldProps {
  value: string;
  label: string;
  onCopy: () => void;
  className?: string;
}

/**
 * 값과 복사 버튼이 있는 칸 (Figma: CopyField)
 * - 화면 표시만 담당하고, 실제 복사 동작은 onCopy로 받는다. (공유 URL 복사는 features/share-invitation 역할)
 * - 높이는 복사 버튼(2.6rem)과 위아래 패딩(1.3rem)으로 5.2rem을 만든다.
 */
export const CopyField = ({ value, label, onCopy, className }: CopyFieldProps) => (
  <div
    className={cn(
      'flex w-full items-center gap-[1rem] rounded-[1rem] bg-brand-primary/15 px-[1.85rem] py-[1.3rem]',
      className,
    )}
  >
    <span className='min-w-0 flex-1 truncate body-sb-16 text-text-white' title={value}>
      {value}
    </span>
    <TextButton aria-label={`${label} 복사`} onClick={onCopy}>
      복사
    </TextButton>
  </div>
);
