import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'default';
  disabled?: boolean;
}

export default function QuantitySelector({
  value,
  min = 1,
  max = 999,
  onChange,
  size = 'default',
  disabled = false,
}: QuantitySelectorProps) {
  const isSmall = size === 'sm';

  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={`flex items-center gap-1 ${isSmall ? 'gap-0.5' : 'gap-1'}`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={`${isSmall ? 'h-6 w-6' : 'h-8 w-8'} rounded-full border-border shrink-0`}
        onClick={decrement}
        disabled={disabled || value <= min}
      >
        <Minus size={isSmall ? 10 : 12} />
      </Button>
      <span
        className={`${isSmall ? 'w-6 text-xs' : 'w-8 text-sm'} text-center font-semibold text-foreground select-none`}
      >
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={`${isSmall ? 'h-6 w-6' : 'h-8 w-8'} rounded-full border-border shrink-0`}
        onClick={increment}
        disabled={disabled || value >= max}
      >
        <Plus size={isSmall ? 10 : 12} />
      </Button>
    </div>
  );
}
