import type { ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

interface InfoFieldProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export const InfoField = ({ label, value, className }: InfoFieldProps) => (
  <dl
    className={cn(
      'flex w-full items-center rounded-[1rem] bg-brand-primary/10 px-[1.6rem] py-[1.3rem]',
      className,
    )}
  >
    <dt className='w-[5.7rem] shrink-0 caption-rg-12 text-text-white/50'>{label}</dt>
    <dd className='min-w-0 flex-1 truncate body-md-14 text-text-white'>{value}</dd>
  </dl>
);
