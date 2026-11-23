import Image from 'next/image';

interface SelectionIndicatorProps {
  selected: boolean;
}

export const SelectionIndicator = ({ selected }: SelectionIndicatorProps) => (
  <Image
    src={
      selected
        ? '/images/buttons/selection-selected.svg'
        : '/images/buttons/selection-unselected.svg'
    }
    alt=''
    width={25}
    height={25}
    aria-hidden='true'
    draggable={false}
  />
);
