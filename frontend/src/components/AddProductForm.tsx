import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddProduct } from '../hooks/useQueries';

const CATEGORIES = [
  'Hair Care',
  'Skin Care',
  'Nail Care',
  'Makeup',
  'Fragrance',
  'Body Care',
  'Tools & Accessories',
  'Other',
];

interface AddProductFormProps {
  onSuccess?: () => void;
}

export default function AddProductForm({ onSuccess }: AddProductFormProps) {
  const addProduct = useAddProduct();
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    rate: '',
    quantity: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.rate || isNaN(Number(form.rate)) || Number(form.rate) <= 0)
      newErrors.rate = 'Valid price is required';
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) < 0)
      newErrors.quantity = 'Valid quantity is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const id = `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    try {
      await addProduct.mutateAsync({
        id,
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        rate: BigInt(Math.round(Number(form.rate))),
        quantity: BigInt(Math.round(Number(form.quantity))),
        imageUrl: form.imageUrl.trim(),
      });
      toast.success('Product added successfully!');
      setForm({ name: '', category: '', description: '', rate: '', quantity: '', imageUrl: '' });
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to add product. Please try again.');
    }
  };

  const field = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium">Product Name *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => field('name', e.target.value)}
          placeholder="e.g. Keratin Hair Serum"
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Category *</Label>
        <Select value={form.category} onValueChange={(v) => field('category', v)}>
          <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-destructive text-xs">{errors.category}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => field('description', e.target.value)}
          placeholder="Describe the product..."
          rows={3}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
      </div>

      {/* Price & Quantity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="rate" className="text-sm font-medium">Price (₹) *</Label>
          <Input
            id="rate"
            type="number"
            min="1"
            value={form.rate}
            onChange={(e) => field('rate', e.target.value)}
            placeholder="e.g. 299"
            className={errors.rate ? 'border-destructive' : ''}
          />
          {errors.rate && <p className="text-destructive text-xs">{errors.rate}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quantity" className="text-sm font-medium">Stock Qty *</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={(e) => field('quantity', e.target.value)}
            placeholder="e.g. 50"
            className={errors.quantity ? 'border-destructive' : ''}
          />
          {errors.quantity && <p className="text-destructive text-xs">{errors.quantity}</p>}
        </div>
      </div>

      {/* Image URL */}
      <div className="space-y-1.5">
        <Label htmlFor="imageUrl" className="text-sm font-medium flex items-center gap-1.5">
          <ImageIcon size={14} />
          Image URL (optional)
        </Label>
        <Input
          id="imageUrl"
          value={form.imageUrl}
          onChange={(e) => field('imageUrl', e.target.value)}
          placeholder="https://example.com/product.jpg"
        />
        {form.imageUrl && (
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-border mt-1">
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full brand-gradient text-white border-0 font-semibold h-10"
        disabled={addProduct.isPending}
      >
        {addProduct.isPending ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />
            Adding Product...
          </>
        ) : (
          'Add Product'
        )}
      </Button>
    </form>
  );
}
