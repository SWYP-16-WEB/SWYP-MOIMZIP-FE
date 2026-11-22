import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const mergeClasses = extendTailwindMerge<'typography'>({
  extend: {
    classGroups: {
      typography: [
        'head-b-28',
        'title-b-24',
        'title-sb-20',
        'title-b-20',
        'body-sb-16',
        'body-md-14',
        'caption-rg-12',
        'caption-sb-12',
        'caption-rg-10',
      ],
    },
    conflictingClassGroups: {
      typography: ['font-size', 'font-weight', 'leading', 'tracking'],
    },
  },
});

// 조건부 클래스를 합치고, 충돌하는 Tailwind 클래스는 뒤에 오는 값으로 덮어쓴다.
export const cn = (...inputs: ClassValue[]) => mergeClasses(clsx(inputs));
