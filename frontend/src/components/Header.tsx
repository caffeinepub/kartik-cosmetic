import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Package, ClipboardList, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartCount } from '../hooks/useQueries';
import AddProductForm from './AddProductForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Header() {
  const cartCount = useCartCount();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full shadow-brand" style={{ background: 'linear-gradient(135deg, oklch(0.48 0.22 350), oklch(0.55 0.2 10))' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-2 border-white/40">
              <img
                src="/assets/generated/kartik-cosmetic-logo.dim_256x256.png"
                alt="Kartik Cosmetic Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-white text-lg leading-tight tracking-wide">
                Kartik Cosmetic
              </span>
              <p className="text-white/70 text-[10px] leading-none tracking-widest uppercase">
                Salon & Parlour
              </p>
            </div>
            <span className="sm:hidden font-display font-bold text-white text-base">KC</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-white/90 hover:text-white hover:bg-white/15 gap-1.5 ${isActive ? 'bg-white/20 text-white' : ''}`}
                >
                  <Package size={16} />
                  Products
                </Button>
              )}
            </Link>
            <Link to="/orders">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-white/90 hover:text-white hover:bg-white/15 gap-1.5 ${isActive ? 'bg-white/20 text-white' : ''}`}
                >
                  <ClipboardList size={16} />
                  Orders
                </Button>
              )}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Add Product */}
            <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="hidden sm:flex items-center gap-1.5 bg-white text-primary hover:bg-white/90 font-semibold shadow-sm"
                >
                  <span className="text-lg leading-none">+</span>
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">Add New Product</DialogTitle>
                </DialogHeader>
                <AddProductForm onSuccess={() => setAddProductOpen(false)} />
              </DialogContent>
            </Dialog>

            {/* Mobile Add Product */}
            <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="sm:hidden text-white hover:bg-white/15 w-9 h-9"
                >
                  <span className="text-xl font-bold leading-none">+</span>
                </Button>
              </DialogTrigger>
            </Dialog>

            {/* Cart */}
            <Button
              size="icon"
              variant="ghost"
              className="relative text-white hover:bg-white/15 w-9 h-9"
              onClick={() => navigate({ to: '/cart' })}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden text-white hover:bg-white/15 w-9 h-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-3 flex flex-col gap-1 animate-fade-in">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/15 gap-2">
                <Package size={16} />
                Products
              </Button>
            </Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/15 gap-2">
                <ClipboardList size={16} />
                My Orders
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
