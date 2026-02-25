import { useState, useMemo } from 'react';
import { Package, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';
import { useGetAllProducts } from '../hooks/useQueries';

export default function ProductListingPage() {
  const { data: products, isLoading, error } = useGetAllProducts();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden" style={{ maxHeight: '400px' }}>
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Kartik Cosmetic - Premium Salon Products"
          className="w-full object-cover"
          style={{ maxHeight: '400px' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Overlay text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.45) 100%)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-yellow-300" />
            <span className="text-yellow-300 text-sm font-medium tracking-widest uppercase">Premium Quality</span>
            <Sparkles size={20} className="text-yellow-300" />
          </div>
          <h1 className="font-display font-bold text-white text-3xl md:text-5xl leading-tight drop-shadow-lg">
            Kartik Cosmetic
          </h1>
          <p className="text-white/90 text-sm md:text-base mt-2 max-w-md drop-shadow">
            Your one-stop destination for premium salon & parlour products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Search & Filters */}
        <div className="space-y-4 mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search products by name, category..."
          />
          {categories.length > 0 && (
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          )}
        </div>

        {/* Results count */}
        {!isLoading && products && products.length > 0 && (
          <p className="text-muted-foreground text-sm mb-4">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{' '}
            <span className="font-semibold text-foreground">{products.length}</span> products
            {selectedCategory !== 'All' && (
              <span> in <span className="text-primary font-medium">{selectedCategory}</span></span>
            )}
          </p>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-destructive font-medium">Failed to load products. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-4">
              <Package size={36} className="text-muted-foreground/50" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-xl mb-2">
              {products && products.length === 0 ? 'No Products Yet' : 'No Results Found'}
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {products && products.length === 0
                ? 'Add your first product using the "+ Add Product" button in the header.'
                : `No products match "${search}"${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}. Try a different search.`}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 animate-fade-in">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
