
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import Navbar from './components/Navbar.tsx';
import CategoryFilter from './components/CategoryFilter.tsx';
import ProductCard from './components/ProductCard.tsx';
import ProductModal from './components/ProductModal.tsx';
import CartSheet from './components/CartSheet.tsx';
import FeedbackModal from './components/FeedbackModal.tsx';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import BusinessInfoModal from './components/BusinessInfoModal.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { MENU_DATA } from './constants.tsx';
import { CategoryType, Product, CartItem } from './types.ts';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  const activeCategoryRef = useRef<CategoryType | null>(null);
  const isManualScrolling = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isAdmin) return;

    const handleScroll = () => {
      if (isManualScrolling.current || showWelcome) return;

      const scrollY = window.scrollY;
      
      if (scrollY < 50) {
        if (activeCategoryRef.current !== null) {
          activeCategoryRef.current = null;
          setActiveCategory(null);
        }
        return;
      }

      const isAtBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 50;
      const categories = Object.values(CategoryType);
      
      if (isAtBottom) {
        const lastCat = categories[categories.length - 1];
        if (activeCategoryRef.current !== lastCat) {
          activeCategoryRef.current = lastCat;
          setActiveCategory(lastCat);
        }
        return;
      }

      const stickyThreshold = 130; 
      let currentActive: CategoryType | null = null;

      for (const category of categories) {
        const section = sectionRefs.current[category];
        if (section) {
          const { top } = section.getBoundingClientRect();
          if (top <= stickyThreshold + 10) {
            currentActive = category;
          }
        }
      }

      if (activeCategoryRef.current !== currentActive) {
        activeCategoryRef.current = currentActive;
        setActiveCategory(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showWelcome, isAdmin]);

  const handleCategoryChange = (cat: CategoryType | null, isManual: boolean = false) => {
    if (isManual && cat) {
      isManualScrolling.current = true;
      setActiveCategory(cat);
      activeCategoryRef.current = cat;

      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      
      scrollTimeoutRef.current = window.setTimeout(() => {
        isManualScrolling.current = false;
      }, 800); 
    }
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  if (isAdmin) {
    return <AdminDashboard onClose={() => { window.location.hash = ''; }} />;
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const categories = Object.values(CategoryType);

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 animate-fade-in">
      <Navbar 
        onFeedbackClick={() => setIsFeedbackOpen(true)} 
        onInfoClick={() => setIsInfoOpen(true)}
      />

      <section className="max-w-7xl mx-auto w-full px-4 mt-8">
        <div className="relative h-[260px] rounded-[2.5rem] overflow-hidden bg-slate-100 flex flex-col justify-center p-8 md:p-12 border border-slate-200 shadow-sm">
          <div className="relative z-10">
            <h3 className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-3">
              Seçkin Mutfak Sanatı
            </h3>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight max-w-2xl">
              Resital Lounge: <br />Her Lokmada Bir Hikaye
            </h1>
          </div>
        </div>
      </section>

      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onProductSelect={setSelectedProduct}
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col gap-10 pb-20">
          {categories.map((category) => {
            const productsInCategory = MENU_DATA.filter(p => p.category === category);

            if (productsInCategory.length === 0) return null;

            return (
              <section 
                key={category} 
                id={category}
                ref={(el) => (sectionRefs.current[category] = el)}
                className="scroll-mt-[135px]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{category}</h2>
                    <p className="text-xs text-slate-400 font-medium">Lezzet dolu bir yolculuk.</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                    {productsInCategory.length} Ürün
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  {productsInCategory.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onSelect={setSelectedProduct}
                      onAdd={addToCart}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {cartCount > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-[45] bg-slate-900 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">
              {cartCount}
            </span>
          </div>
          <span className="font-bold text-sm pr-1">Sepet</span>
        </button>
      )}

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAdd={addToCart}
      />
      <CartSheet 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
      <BusinessInfoModal 
        isOpen={isInfoOpen} 
        onClose={() => setIsInfoOpen(false)} 
      />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
