
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Loader2, UtensilsCrossed } from 'lucide-react';
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
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === '#admin');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [primaryColor, setPrimaryColor] = useState('#0f172a');
  const [restaurantName, setRestaurantName] = useState('Resital Lounge');
  const [fontFamily, setFontFamily] = useState('Plus Jakarta Sans');
  const [cardBgColor, setCardBgColor] = useState('#ffffff');
  const [cardShadow, setCardShadow] = useState('shadow-sm');
  
  // Header Ayarları State
  const [headerSettings, setHeaderSettings] = useState({
    bg: '#ffffff',
    text: '#0f172a',
    iconBg: '#f1f5f9',
    iconColor: '#475569'
  });

  // Hero (Slider) Ayarları State
  const [heroTitleColor, setHeroTitleColor] = useState('#0f172a');
  const [heroSubtitleColor, setHeroSubtitleColor] = useState('#0f172a');

  // Arama Çubuğu Ayarları State
  const [searchSettings, setSearchSettings] = useState({
    iconColor: '#94a3b8',
    textColor: '#0f172a',
    bgColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: '1px',
    shadow: 'shadow-sm'
  });

  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();
        
        if (!settingsError && settingsData) {
          if (settingsData.primary_color) setPrimaryColor(settingsData.primary_color);
          if (settingsData.restaurant_name) setRestaurantName(settingsData.restaurant_name);
          if (settingsData.font_family) setFontFamily(settingsData.font_family);
          if (settingsData.card_bg_color) setCardBgColor(settingsData.card_bg_color);
          if (settingsData.card_shadow) setCardShadow(settingsData.card_shadow);
          
          setHeaderSettings({
            bg: settingsData.header_bg_color || '#ffffff',
            text: settingsData.header_text_color || '#0f172a',
            iconBg: settingsData.header_icon_bg_color || '#f1f5f9',
            iconColor: settingsData.header_icon_color || '#475569'
          });

          setHeroTitleColor(settingsData.hero_title_color || '#0f172a');
          setHeroSubtitleColor(settingsData.hero_subtitle_color || '#0f172a');

          setSearchSettings({
            iconColor: settingsData.search_icon_color || '#94a3b8',
            textColor: settingsData.search_text_color || '#0f172a',
            bgColor: settingsData.search_bg_color || '#ffffff',
            borderColor: settingsData.search_border_color || '#e2e8f0',
            borderWidth: settingsData.search_border_width || '1px',
            shadow: settingsData.search_shadow || 'shadow-sm'
          });
        }

        const { data, error: sbError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: true });

        if (sbError) throw sbError;
        setMenuItems((data || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category_name as CategoryType,
          image: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
          isPopular: item.is_popular,
          calories: item.calories,
          ingredients: item.ingredients || []
        })));
      } catch (err: any) {
        console.error('Hata:', err);
        if (err.code !== 'PGRST116' && !err.message.includes('column')) { 
            setError('Veritabanı bağlantısı kurulamadı.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (!showWelcome) initializeApp();
  }, [showWelcome]);

  useEffect(() => {
    const handleHashChange = () => {
      const isHashAdmin = window.location.hash === '#admin';
      setIsAdmin(isHashAdmin);
      if (isHashAdmin && !isAdminAuth) {
        setTimeout(() => {
          const pass = prompt("Yönetici Şifresi:");
          if (pass === "1234") setIsAdminAuth(true);
          else window.location.hash = "";
        }, 100);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminAuth]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  if (isAdmin && isAdminAuth) return <AdminDashboard onClose={() => { setIsAdminAuth(false); window.location.hash = ''; }} />;
  if (showWelcome) return <WelcomeScreen onStart={() => setShowWelcome(false)} />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 animate-fade-in" style={{ '--primary-color': primaryColor, '--card-bg': cardBgColor, '--card-shadow-class': cardShadow, fontFamily: `'${fontFamily}', sans-serif` } as any}>
      <Navbar onFeedbackClick={() => setIsFeedbackOpen(true)} onInfoClick={() => setIsInfoOpen(true)} restaurantName={restaurantName} headerSettings={headerSettings} />
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lezzetler Hazırlanıyor...</p></div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center"><UtensilsCrossed className="w-8 h-8 text-rose-500" /></div>
          <h2 className="text-xl font-bold text-slate-900">Bir sorun oluştu</h2>
          <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">Dene</button>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><UtensilsCrossed className="w-8 h-8 text-slate-300" /></div>
          <h2 className="text-xl font-bold text-slate-900">Menü Henüz Boş</h2>
          <button onClick={() => window.location.hash = '#admin'} className="text-slate-900 font-bold border-b border-slate-900">Admin</button>
        </div>
      ) : (
        <>
          <section className="max-w-7xl mx-auto w-full px-4 mt-8">
            <div className="relative h-[220px] rounded-[2.5rem] overflow-hidden flex flex-col justify-center p-8 md:p-12 border border-slate-200 shadow-sm" style={{ backgroundColor: primaryColor + '10' }}>
              <div className="relative z-10">
                <h3 className="font-bold uppercase text-[10px] tracking-widest mb-3 transition-colors" style={{ color: heroSubtitleColor }}>Seçkin Mutfak Sanatı</h3>
                <h1 className="text-3xl md:text-5xl font-black leading-tight max-w-2xl transition-colors" style={{ color: heroTitleColor }}>{restaurantName}</h1>
              </div>
            </div>
          </section>
          <CategoryFilter products={menuItems} activeCategory={activeCategory} onCategoryChange={(cat) => setActiveCategory(cat)} searchQuery={searchQuery} onSearchChange={setSearchQuery} onProductSelect={setSelectedProduct} searchSettings={searchSettings} />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 pb-32">
            <div className="flex flex-col gap-10">
              {Object.values(CategoryType).map((category) => {
                const productsInCategory = menuItems.filter(p => p.category === category);
                if (productsInCategory.length === 0) return null;
                return (
                  <section key={category} id={category} ref={(el) => { if(el) sectionRefs.current[category] = el; }} className="scroll-mt-[135px]">
                    <h2 className="text-xl font-black text-slate-900 mb-6">{category}</h2>
                    <div className="grid grid-cols-2 gap-3 md:gap-6">
                      {productsInCategory.map(product => (<ProductCard key={product.id} product={product} onSelect={setSelectedProduct} onAdd={addToCart} />))}
                    </div>
                  </section>
                );
              })}
            </div>
          </main>
        </>
      )}
      {cartItems.length > 0 && (<button onClick={() => setIsCartOpen(true)} className="fixed bottom-6 right-6 z-[45] text-white p-4 rounded-full shadow-2xl flex items-center gap-3 active:scale-95 transition-transform" style={{ backgroundColor: primaryColor }}><ShoppingBag className="w-6 h-6" /><span className="font-bold text-sm">{cartItems.reduce((s, i) => s + i.quantity, 0)}</span></button>)}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={(id, d) => setCartItems(p => p.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onRemove={(id) => setCartItems(p => p.filter(i => i.id !== id))} primaryColor={primaryColor} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} primaryColor={primaryColor} />
      <BusinessInfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} restaurantName={restaurantName} />
    </div>
  );
};

export default App;
