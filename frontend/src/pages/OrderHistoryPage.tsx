import { useNavigate } from '@tanstack/react-router';
import { ClipboardList, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import OrderCard from '../components/OrderCard';
import { useGetOrderHistory, useGetAllProducts } from '../hooks/useQueries';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetOrderHistory();
  const { data: products } = useGetAllProducts();

  // Build product name map for display
  const productNames = new Map(
    (products ?? []).map((p) => [p.id, p.name])
  );

  // Show orders in reverse chronological order
  const sortedOrders = orders ? [...orders].reverse() : [];

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
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
          <ClipboardList size={22} className="text-primary" />
          <h1 className="font-display font-bold text-xl text-foreground">Order History</h1>
          {sortedOrders.length > 0 && (
            <span className="brand-gradient text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {sortedOrders.length} orders
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-16">
          <p className="text-destructive font-medium mb-4">Failed to load order history.</p>
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            Back to Products
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && sortedOrders.length === 0 && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={36} className="text-muted-foreground/50" />
          </div>
          <h3 className="font-display font-semibold text-xl mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Your order history will appear here after you place your first order.
          </p>
          <Button
            className="brand-gradient text-white border-0 gap-2"
            onClick={() => navigate({ to: '/' })}
          >
            <ShoppingBag size={16} />
            Start Shopping
          </Button>
        </div>
      )}

      {/* Orders List */}
      {!isLoading && !error && sortedOrders.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          {sortedOrders.map((order, i) => (
            <OrderCard
              key={order.id}
              order={order}
              index={sortedOrders.length - 1 - i}
              productNames={productNames}
            />
          ))}
        </div>
      )}
    </div>
  );
}
