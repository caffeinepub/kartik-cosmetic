import { Package, Calendar, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Order } from '../backend';

interface OrderCardProps {
  order: Order;
  index: number;
  productNames?: Map<string, string>;
}

function formatPrice(amount: bigint): string {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

function formatDate(timestamp: bigint): string {
  // Motoko Time.now() returns nanoseconds
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderCard({ order, index, productNames }: OrderCardProps) {
  return (
    <Card className="border border-border rounded-xl overflow-hidden shadow-card">
      <CardHeader className="pb-3 pt-4 px-4 bg-accent/30">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Receipt size={16} className="text-primary" />
            <span className="font-semibold text-foreground text-sm">Order #{index + 1}</span>
            <Badge className="brand-gradient text-white border-0 text-[10px]">Delivered</Badge>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Calendar size={12} />
            {formatDate(order.timestamp)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Line Items */}
        <div className="space-y-2">
          {order.items.map((item, i) => {
            const name = productNames?.get(item.productId) ?? item.productId;
            return (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium">{name}</span>
                  <span className="text-muted-foreground">× {Number(item.quantity)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">Order Total</span>
          <span className="font-bold text-primary text-lg">{formatPrice(order.total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
