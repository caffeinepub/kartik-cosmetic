import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  ShoppingCart,
  Zap,
  ArrowLeft,
  Package,
  Star,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import QuantitySelector from '../components/QuantitySelector';
import {
  useGetProduct,
  useAddToCart,
} from '../hooks/useQueries';

function formatPrice(rate: bigint): string {
  return `₹${Number(rate).toLocaleString('en-IN')}`;
}

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();

  const { data: product, isLoading } = useGetProduct(productId);
  const addToCart = useAddToCart();

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const inStock = product ? Number(product.quantity) > 0 : false;
  const maxQty = product ? Number(product.quantity) : 1;

  const handleAddToCart = async () => {
    if (!product || !inStock) return;
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(quantity) });
      setAddedToCart(true);
      toast.success(`${product.name} added to cart!`);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Unauthorized') || msg.includes('Only registered')) {
        toast.error('Please log in to add items to your cart.');
      } else {
        toast.error('Failed to add to cart. Please try again.');
      }
    }
  };

  const handleBuyNow = async () => {
    if (!product || !inStock) return;
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(quantity) });
      navigate({ to: '/cart' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Unauthorized') || msg.includes('Only registered')) {
        toast.error('Please log in to add items to your cart.');
      } else {
        toast.error('Failed to add to cart. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package size={48} className="text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="font-display font-semibold text-xl mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">This product doesn't exist or has been removed.</p>
        <Button onClick={() => navigate({ to: '/' })} className="brand-gradient text-white border-0">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl animate-fade-in">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate({ to: '/' })}
      >
        <ArrowLeft size={16} />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-accent/30 border border-border">
          {product.imageUrl ? (
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
          <div className={`${product.imageUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
            <Package size={80} className="text-muted-foreground/30" />
          </div>

          {/* Stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-base px-4 py-2">Out of Stock</Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          {/* Category & Name */}
          <div>
            <Badge variant="secondary" className="mb-2 text-xs">{product.category}</Badge>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">4.0 (Salon Verified)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-primary text-3xl">{formatPrice(product.rate)}</span>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {inStock ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-green-600 font-medium text-sm">
                  In Stock ({Number(product.quantity)} available)
                </span>
              </>
            ) : (
              <span className="text-destructive font-medium text-sm">Out of Stock</span>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wide">Description</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          {/* Quantity Selector */}
          {inStock && (
            <div className="flex items-center gap-4">
              <span className="font-medium text-foreground text-sm">Quantity:</span>
              <QuantitySelector
                value={quantity}
                min={1}
                max={maxQty}
                onChange={setQuantity}
              />
              <span className="text-muted-foreground text-xs">Max: {maxQty}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <Button
              className="flex-1 min-w-[140px] brand-gradient text-white border-0 font-semibold h-11 gap-2 shadow-brand"
              onClick={handleAddToCart}
              disabled={!inStock || addToCart.isPending}
            >
              {addToCart.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : addedToCart ? (
                <CheckCircle size={16} />
              ) : (
                <ShoppingCart size={16} />
              )}
              {addedToCart ? 'Added!' : 'Add to Cart'}
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-w-[140px] border-primary text-primary hover:bg-primary/5 font-semibold h-11 gap-2"
              onClick={handleBuyNow}
              disabled={!inStock || addToCart.isPending}
            >
              <Zap size={16} />
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
