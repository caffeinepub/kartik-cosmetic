import { Trash2, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuantitySelector from './QuantitySelector';
import type { CartItem as CartItemType, Product } from '../backend';

interface CartItemProps {
  item: CartItemType;
  product: Product | undefined;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  isRemoving?: boolean;
  isUpdating?: boolean;
}

function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function CartItem({
  item,
  product,
  onQuantityChange,
  onRemove,
  isRemoving,
  isUpdating,
}: CartItemProps) {
  const rate = product ? Number(product.rate) : 0;
  const subtotal = rate * Number(item.quantity);

  return (
    <div className="flex gap-3 p-4 bg-card rounded-xl border border-border">
      {/* Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-accent/30 shrink-0 flex items-center justify-center">
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const sibling = (e.target as HTMLImageElement).nextElementSibling;
              if (sibling) sibling.classList.remove('hidden');
            }}
          />
        ) : null}
        <Package
          size={28}
          className={`text-muted-foreground/40 ${product?.imageUrl ? 'hidden' : ''}`}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 mb-1">
          {product?.name ?? item.productId}
        </h4>
        <p className="text-muted-foreground text-xs mb-2">
          Unit price: {formatPrice(rate)}
        </p>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <QuantitySelector
            value={Number(item.quantity)}
            min={1}
            max={product ? Number(product.quantity) + Number(item.quantity) : 999}
            onChange={(qty) => onQuantityChange(item.productId, qty)}
            size="sm"
            disabled={isUpdating || isRemoving}
          />
          <div className="flex items-center gap-3">
            {isUpdating ? (
              <Loader2 size={14} className="animate-spin text-primary" />
            ) : (
              <span className="font-bold text-primary text-sm">{formatPrice(subtotal)}</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              onClick={() => onRemove(item.productId)}
              disabled={isRemoving || isUpdating}
            >
              {isRemoving ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
