
import React, { useEffect, useRef, useState } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { CategoryType, Product } from '../types.ts';

interface CategoryFilterProps {
  products: Product[];
  activeCategory: CategoryType | null;
  onCategoryChange: (category: CategoryType | null, isManual?: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onProductSelect: (product: Product) => void;
  searchSettings?: {
    iconColor: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
    borderWidth: string;
    shadow: string;
  };
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  products,
  activeCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange,
  onProductSelect,
  searchSettings = {
    iconColor: '#94a3b8',
    textColor: '#0f172a',
    bgColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: '1px',
    shadow: 'shadow-sm'
  }
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const categories: CategoryType[] = Object.values(CategoryType);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeCategory && containerRef.current) {
      const activeButton = containerRef.current.querySelector(`[data-category="${activeCategory}"]`) as HTMLElement;
      if (activeButton) {
        const container = containerRef.current;
        const scrollLeft = activeButton.offsetLeft - (container.offsetWidth / 2) + (activeButton.offsetWidth / 2);
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCategory]);

  const handleCategoryClick = (cat: CategoryType) => {
    const element = document.getElementById(cat);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    onCategoryChange(cat, true);
  };

  const filteredResults = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <aside className="w-full sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
          <div className="relative">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" 
              style={{ color: searchSettings.iconColor }}
            />
            <input
              type="text"
              readOnly
              placeholder="Lezzet ara..."
              onClick={() => setIsSearchOpen(true)}
              value={searchQuery}
              style={{ 
                backgroundColor: searchSettings.bgColor,
                color: searchSettings.textColor,
                borderColor: searchSettings.borderColor,
                borderWidth: searchSettings.borderWidth,
                borderStyle: 'solid'
              }}
              className={`w-full rounded-2xl py-3 pl-12 pr-10 text-base font-medium focus:outline-none cursor-pointer transition-all ${searchSettings.shadow}`}
            />
          </div>

          <div 
            ref={containerRef}
            className="flex flex-row gap-2.5 overflow-x-auto hide-scrollbar pb-1 scroll-smooth"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                data-category={cat}
                onClick={() => handleCategoryClick(cat)}
                style={activeCategory === cat ? { backgroundColor: 'var(--primary-color)' } : {}}
                className={`
                  whitespace-nowrap px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 group shrink-0
                  ${activeCategory === cat 
                    ? 'text-white shadow-lg' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}
                `}
              >
                {cat}
                {activeCategory === cat && <div className="w-1 h-1 rounded-full bg-white animate-pulse" />}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Ne yemek istersiniz?"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-12 text-base font-semibold outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {searchQuery.length > 0 && (
              <div className="space-y-4">
                {filteredResults.map(product => (
                  <div 
                    key={product.id}
                    onClick={() => { onProductSelect(product); setIsSearchOpen(false); }}
                    className="flex gap-4 p-3 bg-white border border-slate-100 rounded-2xl active:scale-[0.98] transition-all"
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{product.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                      <span className="text-sm font-black text-slate-900">{product.price} TL</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryFilter;
