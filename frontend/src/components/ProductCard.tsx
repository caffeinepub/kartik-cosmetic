import { ShoppingCart, Package, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAddToCart } from '../hooks/useQueries';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
}

function formatPrice(rate: bigint): string {
  return `₹${Number(rate).toLocaleString('en-IN')}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const inStock = Number(product.quantity) > 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inStock) return;
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(1) });
      toast.success(`${product.name} added to cart!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Unauthorized') || msg.includes('Only registered')) {
        toast.error('Please log in to add items to your cart.');
      } else {
        toast.error('Failed to add to cart. Please try again.');
      }
    }
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden border border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-card rounded-xl"
      onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id } })}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-accent/30">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const sibling = (e.target as HTMLImageElement).nextElementSibling;
              if (sibling) sibling.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${product.imageUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
          <Package size={48} className="text-muted-foreground/40" />
        </div>

        {/* Stock Badge */}
        <div className="absolute top-2 left-2">
          {inStock ? (
            <Badge className="bg-green-500/90 text-white text-[10px] px-2 py-0.5 border-0">
              In Stock
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-3">
        {/* Category */}
        <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1 font-medium">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price & Cart */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-primary text-base">{formatPrice(product.rate)}</span>
          <Button
            size="icon"
            className="h-8 w-8 brand-gradient text-white border-0 shrink-0 shadow-sm"
            onClick={handleAddToCart}
            disabled={!inStock || addToCart.isPending}
            title={inStock ? 'Add to Cart' : 'Out of Stock'}
          >
            {addToCart.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ShoppingCart size={14} />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
