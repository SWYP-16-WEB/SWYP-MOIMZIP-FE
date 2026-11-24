import Image, { type ImageProps } from 'next/image';

import { cn } from '@/shared/utils/cn';

interface ImageBoxProps extends Omit<ImageProps, 'src' | 'alt' | 'fill' | 'className'> {
  src?: ImageProps['src'] | null;
  alt: string;
  fallbackSrc?: ImageProps['src'];
  className?: string;
}

export const ImageBox = ({
  src,
  alt,
  fallbackSrc,
  className,
  sizes = '90px',
  ...imageProps
}: ImageBoxProps) => {
  const imageSrc = src || fallbackSrc;

  return (
    <div
      className={cn(
        'relative size-[9rem] shrink-0 overflow-hidden rounded-[1rem] bg-brand-secondary',
        className,
      )}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes}
          className='object-cover'
          {...imageProps}
        />
      ) : null}
    </div>
  );
};
