
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import Navbar from './components/Navbar.tsx';
import CategoryFilter from './components/CategoryFilter.tsx';
import ProductCard from './components/ProductCard.tsx';
import ProductModal from './components/ProductModal.tsx';
import CartSheet from './components/CartSheet.tsx';
import FeedbackModal from './components/FeedbackModal.tsx';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import BusinessInfoModal from './components/BusinessInfoModal.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { supabase } from './lib/supabase.ts';
import { CategoryType, Product, CartItem } from './types.ts';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [primaryColor] = useState(() => localStorage.getItem('qresta_primary_color') || '#0f172a');
  const [menuItems, setMenuItems] = useState<Product[]>([]);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const isManualScrolling = useRef(false);

  // Supabase'den Menü Çekme
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        const formattedData: Product[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category_name as CategoryType,
          image: item.image_url,
          isPopular: item.is_popular,
          calories: item.calories,
          ingredients: item.ingredients || []
        }));

        setMenuItems(formattedData);
      } catch (err) {
        console.error('Menü çekilemedi:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!showWelcome) fetchMenu();
  }, [showWelcome]);

  useEffect(() => {
    const handleHashChange = () => {
      const isHashAdmin = window.location.hash === '#admin';
      setIsAdmin(isHashAdmin);
      if (isHashAdmin && !isAdminAuth) {
        const pass = prompt("Yönetici Şifresi:");
        if (pass === "1234") setIsAdminAuth(true);
        else window.location.hash = "";
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminAuth]);

  const handleCategoryChange = (cat: CategoryType | null, isManual: boolean = false) => {
    if (isManual && cat) {
      isManualScrolling.current = true;
      setActiveCategory(cat);
      setTimeout(() => { isManualScrolling.current = false; }, 800);
    }
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  if (isAdmin && isAdminAuth) {
    return <AdminDashboard onClose={() => { setIsAdminAuth(false); window.location.hash = ''; }} />;
  }

  if (showWelcome) return <WelcomeScreen onStart={() => setShowWelcome(false)} />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 animate-fade-in" style={{ '--primary-color': primaryColor } as any}>
      <Navbar onFeedbackClick={() => setIsFeedbackOpen(true)} onInfoClick={() => setIsInfoOpen(true)} />

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Menü Yükleniyor...</p>
        </div>
      ) : (
        <>
          <section className="max-w-7xl mx-auto w-full px-4 mt-8">
            <div className="relative h-[220px] rounded-[2.5rem] overflow-hidden flex flex-col justify-center p-8 md:p-12 border border-slate-200 shadow-sm" style={{ backgroundColor: primaryColor + '10' }}>
              <div className="relative z-10">
                <h3 className="font-bold uppercase text-[10px] tracking-widest mb-3" style={{ color: primaryColor }}>Seçkin Mutfak Sanatı</h3>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight max-w-2xl">Resital Lounge</h1>
              </div>
            </div>
          </section>

          <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} searchQuery={searchQuery} onSearchChange={setSearchQuery} onProductSelect={setSelectedProduct} />
          
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
            <div className="flex flex-col gap-10 pb-20">
              {Object.values(CategoryType).map((category) => {
                const productsInCategory = menuItems.filter(p => p.category === category);
                if (productsInCategory.length === 0) return null;
                return (
                  <section key={category} id={category} ref={(el) => { sectionRefs.current[category] = el; }} className="scroll-mt-[135px]">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-black text-slate-900">{category}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-6">
                      {productsInCategory.map(product => (
                        <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} onAdd={addToCart} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </main>
        </>
      )}

      {cartItems.length > 0 && (
        <button onClick={() => setIsCartOpen(true)} className="fixed bottom-6 right-6 z-[45] text-white p-4 rounded-full shadow-2xl flex items-center gap-3 active:scale-95 transition-transform" style={{ backgroundColor: primaryColor }}>
          <ShoppingBag className="w-6 h-6" />
          <span className="font-bold text-sm">{cartItems.reduce((s, i) => s + i.quantity, 0)} Ürün</span>
        </button>
      )}

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={(id, d) => setCartItems(p => p.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onRemove={(id) => setCartItems(p => p.filter(i => i.id !== id))} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <BusinessInfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
};

export default App;
