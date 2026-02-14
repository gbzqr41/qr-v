import React, { useEffect, useRef, useState } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { CategoryType, Product } from '../types.ts';
import { MENU_DATA } from '../constants.tsx';

interface CategoryFilterProps {
  activeCategory: CategoryType | null;
  onCategoryChange: (category: CategoryType | null, isManual?: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onProductSelect: (product: Product) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  activeCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange,
  onProductSelect
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

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSearchOpen]);

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

  const filteredResults = MENU_DATA.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <aside className="w-full sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
          {/* Main Search Trigger */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              readOnly
              placeholder="Lezzet ara..."
              onClick={() => setIsSearchOpen(true)}
              value={searchQuery}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-base font-medium focus:outline-none cursor-pointer shadow-sm no-zoom"
            />
            {searchQuery && (
              <button 
                onClick={(e) => { e.stopPropagation(); onSearchChange(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div 
            ref={containerRef}
            className="flex flex-row gap-2.5 overflow-x-auto hide-scrollbar pb-1 scroll-smooth"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                data-category={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`
                  whitespace-nowrap px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 group shrink-0
                  ${activeCategory === cat 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-300' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}
                `}
              >
                {cat}
                {activeCategory === cat && (
                   <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Full Screen Search Popup */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors"
            >
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
                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-12 text-base font-semibold focus:ring-2 focus:ring-slate-900/5 outline-none no-zoom"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-200 p-1 rounded-full text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {searchQuery.length > 0 ? (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase px-2">Sonuçlar ({filteredResults.length})</p>
                {filteredResults.length > 0 ? (
                  filteredResults.map(product => (
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
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-slate-400 font-medium">Aradığınız lezzet bulunamadı.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-medium">Yemek, içecek veya içerik ara...</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .no-zoom {
          font-size: 16px !important;
        }
        @media screen and (max-width: 768px) {
          input {
            font-size: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default CategoryFilter;