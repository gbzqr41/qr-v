
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
  const [pageBgColor, setPageBgColor] = useState('#f8fafc');

  // İşletme Profili State
  const [businessProfile, setBusinessProfile] = useState({
    description: 'Modern Gastronomi Deneyimi',
    phone: '',
    whatsapp: '',
    address: '',
    wifiPassword: 'resital2024',
    instagramUsername: '',
    coverImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
    paymentMethods: 'Nakit, Kredi Kartı',
    serviceOptions: 'Masaya Servis, Gel-Al',
    workingHours: 'Her gün: 09:00 - 22:00',
    businessFeatures: [] as any[]
  });

  // Ürün Kart Detay Ayarları State
  const [cardSettings, setCardSettings] = useState({
    priceColor: '#0f172a',
    titleColor: '#1e293b',
    descColor: '#64748b',
    infoIconColor: '#cbd5e1',
    infoTextColor: '#94a3b8'
  });

  // Ürün Detay (Modal) Ayarları State
  const [modalSettings, setModalSettings] = useState({
    bgColor: '#ffffff',
    catTextColor: '#64748b',
    catBgColor: '#f1f5f9',
    titleColor: '#0f172a',
    priceColor: '#0f172a',
    descColor: '#64748b',
    unitPriceTitleColor: '#94a3b8',
    prepIconColor: '#cbd5e1',
    prepTextColor: '#334155',
    calIconColor: '#f97316',
    calTextColor: '#334155',
    ingTitleColor: '#94a3b8',
    ingTagBgColor: '#f8fafc',
    ingTagTextColor: '#475569',
    allergenBgColor: '#fff1f2',
    allergenBorderColor: '#ffe4e6',
    allergenBorderWidth: '1px',
    allergenShadow: 'shadow-none',
    allergenTitleColor: '#e11d48',
    allergenDescColor: '#9f1239'
  });
  
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

  // Kategori Buton Ayarları State
  const [catSettings, setCatSettings] = useState({
    bgColor: '#ffffff',
    textColor: '#64748b',
    activeBgColor: '#0f172a',
    activeTextColor: '#ffffff',
    borderColor: '#f1f5f9',
    borderWidth: '1px',
    shadow: 'shadow-none'
  });

  // Kategori Ayraç ve Başlık Ayarları State
  const [dividerSettings, setDividerSettings] = useState({
    color: '#e2e8f0',
    thickness: '1px',
    shadow: 'shadow-none'
  });
  const [catTitleColor, setCatTitleColor] = useState('#0f172a');

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
          if (settingsData.page_bg_color) setPageBgColor(settingsData.page_bg_color);

          // İşletme Profili
          setBusinessProfile({
            description: settingsData.description || 'Modern Gastronomi Deneyimi',
            phone: settingsData.phone || '',
            whatsapp: settingsData.whatsapp || '',
            address: settingsData.address || '',
            wifiPassword: settingsData.wifi_password || 'resital2024',
            instagramUsername: settingsData.instagram_username || '',
            coverImageUrl: settingsData.cover_image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
            paymentMethods: settingsData.payment_methods || 'Nakit, Kredi Kartı',
            serviceOptions: settingsData.service_options || 'Masaya Servis, Gel-Al',
            workingHours: settingsData.working_hours || 'Her gün: 09:00 - 22:00',
            businessFeatures: settingsData.business_features || []
          });
          
          setCardSettings({
            priceColor: settingsData.card_price_color || '#0f172a',
            titleColor: settingsData.card_title_color || '#1e293b',
            descColor: settingsData.card_desc_color || '#64748b',
            infoIconColor: settingsData.card_info_icon_color || '#cbd5e1',
            infoTextColor: settingsData.card_info_text_color || '#94a3b8'
          });

          setModalSettings({
            bgColor: settingsData.modal_bg_color || '#ffffff',
            catTextColor: settingsData.modal_cat_text_color || '#64748b',
            catBgColor: settingsData.modal_cat_bg_color || '#f1f5f9',
            titleColor: settingsData.modal_title_color || '#0f172a',
            priceColor: settingsData.modal_price_color || '#0f172a',
            descColor: settingsData.modal_desc_color || '#64748b',
            unitPriceTitleColor: settingsData.modal_unit_price_title_color || '#94a3b8',
            prepIconColor: settingsData.modal_prep_icon_color || '#cbd5e1',
            prepTextColor: settingsData.modal_prep_text_color || '#334155',
            calIconColor: settingsData.modal_cal_icon_color || '#f97316',
            calTextColor: settingsData.modal_cal_text_color || '#334155',
            ingTitleColor: settingsData.modal_ing_title_color || '#94a3b8',
            ingTagBgColor: settingsData.modal_ing_tag_bg_color || '#f8fafc',
            ingTagTextColor: settingsData.modal_ing_tag_text_color || '#475569',
            allergenBgColor: settingsData.modal_allergen_bg_color || '#fff1f2',
            allergenBorderColor: settingsData.modal_allergen_border_color || '#ffe4e6',
            allergenBorderWidth: settingsData.modal_allergen_border_width || '1px',
            allergenShadow: settingsData.modal_allergen_shadow || 'shadow-none',
            allergenTitleColor: settingsData.modal_allergen_title_color || '#e11d48',
            allergenDescColor: settingsData.modal_allergen_desc_color || '#9f1239'
          });

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

          setCatSettings({
            bgColor: settingsData.cat_bg_color || '#ffffff',
            textColor: settingsData.cat_text_color || '#64748b',
            activeBgColor: settingsData.cat_active_bg_color || '#0f172a',
            activeTextColor: settingsData.cat_active_text_color || '#ffffff',
            borderColor: settingsData.cat_border_color || '#f1f5f9',
            borderWidth: settingsData.cat_border_width || '1px',
            shadow: settingsData.cat_shadow || 'shadow-none'
          });

          setDividerSettings({
            color: settingsData.cat_divider_color || '#e2e8f0',
            thickness: settingsData.cat_divider_thickness || '1px',
            shadow: settingsData.cat_divider_shadow || 'shadow-none'
          });

          setCatTitleColor(settingsData.cat_title_color || '#0f172a');
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
    <div className="min-h-screen flex flex-col animate-fade-in transition-colors duration-500" style={{ backgroundColor: pageBgColor, '--primary-color': primaryColor, '--card-bg': cardBgColor, '--card-shadow-class': cardShadow, fontFamily: `'${fontFamily}', sans-serif` } as any}>
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
          <CategoryFilter products={menuItems} activeCategory={activeCategory} onCategoryChange={(cat) => setActiveCategory(cat)} searchQuery={searchQuery} onSearchChange={setSearchQuery} onProductSelect={setSelectedProduct} searchSettings={searchSettings} catSettings={catSettings} dividerSettings={dividerSettings} />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 pb-32">
            <div className="flex flex-col gap-10">
              {Object.values(CategoryType).map((category) => {
                const productsInCategory = menuItems.filter(p => p.category === category);
                if (productsInCategory.length === 0) return null;
                return (
                  <section key={category} id={category} ref={(el) => { if(el) sectionRefs.current[category] = el; }} className="scroll-mt-[135px]">
                    <h2 className="text-xl font-black mb-6 transition-colors" style={{ color: catTitleColor }}>{category}</h2>
                    <div className="grid grid-cols-2 gap-3 md:gap-6">
                      {productsInCategory.map(product => (<ProductCard key={product.id} product={product} onSelect={setSelectedProduct} onAdd={addToCart} cardSettings={cardSettings} />))}
                    </div>
                  </section>
                );
              })}
            </div>
          </main>
        </>
      )}
      {cartItems.length > 0 && (<button onClick={() => setIsCartOpen(true)} className="fixed bottom-6 right-6 z-[45] text-white p-4 rounded-full shadow-2xl flex items-center gap-3 active:scale-95 transition-transform" style={{ backgroundColor: primaryColor }}><ShoppingBag className="w-6 h-6" /><span className="font-bold text-sm">{cartItems.reduce((s, i) => s + i.quantity, 0)}</span></button>)}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} modalSettings={modalSettings} />
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={(id, d) => setCartItems(p => p.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onRemove={(id) => setCartItems(p => p.filter(i => i.id !== id))} primaryColor={primaryColor} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} primaryColor={primaryColor} />
      <BusinessInfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} restaurantName={restaurantName} profile={businessProfile} />
    </div>
  );
};

export default App;
