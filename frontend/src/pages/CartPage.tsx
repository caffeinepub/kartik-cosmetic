import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  ShoppingCart,
  ArrowLeft,
  Package,
  CheckCircle,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import CartItem from '../components/CartItem';
import {
  useGetCart,
  useGetAllProducts,
  useRemoveFromCart,
  useAddToCart,
  usePlaceOrder,
} from '../hooks/useQueries';

function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: products } = useGetAllProducts();
  const removeFromCart = useRemoveFromCart();
  const addToCart = useAddToCart();
  const placeOrder = usePlaceOrder();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Build a map of productId -> product info
  const productMap = new Map(
    (products ?? []).map((p) => [p.id, p])
  );

  // Calculate total using product rates from productMap
  const total = (cart ?? []).reduce((sum, item) => {
    const product = productMap.get(item.productId);
    const rate = product ? Number(product.rate) : 0;
    return sum + rate * Number(item.quantity);
  }, 0);

  const itemCount = (cart ?? []).reduce((sum, item) => sum + Number(item.quantity), 0);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  const handleQuantityChange = async (productId: string, quantity: number) => {
    setUpdatingId(productId);
    try {
      // Remove and re-add with new quantity
      await removeFromCart.mutateAsync(productId);
      await addToCart.mutateAsync({ productId, quantity: BigInt(quantity) });
    } catch {
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await placeOrder.mutateAsync();
      setOrderPlaced(true);
      toast.success('Order placed successfully! 🎉');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Unauthorized') || msg.includes('Only registered')) {
        toast.error('Please log in to place an order.');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md animate-fade-in">
        <div className="w-24 h-24 rounded-full brand-gradient flex items-center justify-center mx-auto mb-6 shadow-brand">
          <CheckCircle size={48} className="text-white" />
        </div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-3">Order Placed!</h2>
        <p className="text-muted-foreground mb-8">
          Your order has been placed successfully. Thank you for shopping with Kartik Cosmetic!
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            className="brand-gradient text-white border-0 gap-2"
            onClick={() => navigate({ to: '/orders' })}
          >
            <ShoppingBag size={16} />
            View Orders
          </Button>
          <Button
            variant="outline"
            onClick={() => { setOrderPlaced(false); navigate({ to: '/' }); }}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate({ to: '/' })}
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="flex items-center gap-2">
          <ShoppingCart size={22} className="text-primary" />
          <h1 className="font-display font-bold text-xl text-foreground">Shopping Cart</h1>
          {itemCount > 0 && (
            <span className="brand-gradient text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {itemCount} items
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {cartLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty Cart */}
      {!cartLoading && (!cart || cart.length === 0) && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={36} className="text-muted-foreground/50" />
          </div>
          <h3 className="font-display font-semibold text-xl mb-2">Your Cart is Empty</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Add some amazing products to get started!
          </p>
          <Button
            className="brand-gradient text-white border-0 gap-2"
            onClick={() => navigate({ to: '/' })}
          >
            <Package size={16} />
            Browse Products
          </Button>
        </div>
      )}

      {/* Cart Items + Summary */}
      {!cartLoading && cart && cart.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                product={productMap.get(item.productId)}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                isRemoving={removingId === item.productId}
                isUpdating={updatingId === item.productId}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-5 sticky top-20 shadow-card">
              <h3 className="font-display font-semibold text-foreground text-lg mb-4">Order Summary</h3>

              <div className="space-y-2 mb-4">
                {cart.map((item) => {
                  const product = productMap.get(item.productId);
                  const rate = product ? Number(product.rate) : 0;
                  const subtotal = rate * Number(item.quantity);
                  return (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                        {product?.name ?? item.productId} × {Number(item.quantity)}
                      </span>
                      <span className="font-medium text-foreground shrink-0">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Separator className="mb-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-primary text-xl">{formatPrice(total)}</span>
              </div>

              <Button
                className="w-full brand-gradient text-white border-0 font-semibold h-11 gap-2 shadow-brand"
                onClick={handlePlaceOrder}
                disabled={placeOrder.isPending}
              >
                {placeOrder.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Place Order
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full mt-2 text-muted-foreground hover:text-foreground text-sm"
                onClick={() => navigate({ to: '/' })}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
