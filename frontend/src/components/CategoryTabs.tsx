import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryTabsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  const allCategories = ['All', ...categories];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 shrink-0 border
              ${selected === cat
                ? 'brand-gradient text-white border-transparent shadow-brand'
                : 'bg-white text-foreground border-border hover:border-primary/40 hover:text-primary'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
