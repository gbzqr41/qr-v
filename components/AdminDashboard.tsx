
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Settings, LogOut, Utensils, Search, Plus, 
  Edit2, Trash2, Save, QrCode, Palette, X, Loader2, Database,
  TrendingUp, Package, Type as TypeIcon, CreditCard, CheckCircle,
  Type, MousePointer2, Box, Layout, Image as ImageIcon,
  Layers, Minus, Maximize2, Store, Phone, MapPin, Instagram, Wifi, Image,
  MessageCircle, CigaretteOff, Baby, ParkingCircle, Info, Clock, Truck, CreditCard as CardIcon,
  Music, Sun, Dog, Key, Wine, Coffee, HelpCircle, Star, MessageSquare
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase.ts';
import { CategoryType, Product } from '../types.ts';

interface AdminDashboardProps {
  onClose: () => void;
}

interface BusinessFeature {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

interface Feedback {
  id: string;
  created_at: string;
  food_rating: number;
  service_rating: number;
  ambiance_rating: number;
  name: string;
  comment: string;
}

type TabType = 'dashboard' | 'menu' | 'qr' | 'design' | 'settings' | 'evaluations';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Tasarım Ayarları
  const [qrColor, setQrColor] = useState('#0f172a');
  const [primaryColor, setPrimaryColor] = useState('#0f172a');
  const [restaurantName, setRestaurantName] = useState('Resital Lounge');
  const [fontFamily, setFontFamily] = useState('Plus Jakarta Sans');
  const [cardBgColor, setCardBgColor] = useState('#ffffff');
  const [cardShadow, setCardShadow] = useState('shadow-sm');
  const [pageBgColor, setPageBgColor] = useState('#f8fafc');

  // İşletme Profili Ayarları
  const [description, setDescription] = useState('Modern Gastronomi Deneyimi');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [wifiPassword, setWifiPassword] = useState('resital2024');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200');
  
  // Hizmet & Çalışma Ayarları
  const [paymentMethods, setPaymentMethods] = useState('Nakit, Kredi Kartı');
  const [serviceOptions, setServiceOptions] = useState('Masaya Servis, Gel-Al');
  const [workingHours, setWorkingHours] = useState('Her gün: 09:00 - 22:00');

  // Dinamik İşletme Özellikleri
  const [businessFeatures, setBusinessFeatures] = useState<BusinessFeature[]>([]);
  
  // Ürün Kartı Detay Ayarları
  const [cardPriceColor, setCardPriceColor] = useState('#0f172a');
  const [cardTitleColor, setCardTitleColor] = useState('#1e293b');
  const [cardDescColor, setCardDescColor] = useState('#64748b');
  const [cardInfoIconColor, setCardInfoIconColor] = useState('#cbd5e1');
  const [cardInfoTextColor, setCardInfoTextColor] = useState('#94a3b8');

  // Ürün Detay (Modal) Ayarları
  const [modalBgColor, setModalBgColor] = useState('#ffffff');
  const [modalCatTextColor, setModalCatTextColor] = useState('#64748b');
  const [modalCatBgColor, setModalCatBgColor] = useState('#f1f5f9');
  const [modalTitleColor, setModalTitleColor] = useState('#0f172a');
  const [modalPriceColor, setModalPriceColor] = useState('#0f172a');
  const [modalDescColor, setModalDescColor] = useState('#64748b');
  const [modalUnitPriceTitleColor, setModalUnitPriceTitleColor] = useState('#94a3b8');
  const [modalPrepIconColor, setModalPrepIconColor] = useState('#cbd5e1');
  const [modalPrepTextColor, setModalPrepTextColor] = useState('#334155');
  const [modalCalIconColor, setModalCalIconColor] = useState('#f97316');
  const [modalCalTextColor, setModalCalTextColor] = useState('#334155');
  const [modalIngTitleColor, setModalIngTitleColor] = useState('#94a3b8');
  const [modalIngTagBgColor, setModalIngTagBgColor] = useState('#f8fafc');
  const [modalIngTagTextColor, setModalIngTagTextColor] = useState('#475569');
  const [modalAllergenBgColor, setModalAllergenBgColor] = useState('#fff1f2');
  const [modalAllergenBorderColor, setModalAllergenBorderColor] = useState('#ffe4e6');
  const [modalAllergenBorderWidth, setModalAllergenBorderWidth] = useState('1px');
  const [modalAllergenShadow, setModalAllergenShadow] = useState('shadow-none');
  const [modalAllergenTitleColor, setModalAllergenTitleColor] = useState('#e11d48');
  const [modalAllergenDescColor, setModalAllergenDescColor] = useState('#9f1239');
  
  // Header Ayarları
  const [headerBgColor, setHeaderBgColor] = useState('#ffffff');
  const [headerTextColor, setHeaderTextColor] = useState('#0f172a');
  const [headerIconBgColor, setHeaderIconBgColor] = useState('#f1f5f9');
  const [headerIconColor, setHeaderIconColor] = useState('#475569');

  // Slider (Hero) Ayarları
  const [heroTitleColor, setHeroTitleColor] = useState('#0f172a');
  const [heroSubtitleColor, setHeroSubtitleColor] = useState('#0f172a');

  // Arama Çubuğu Ayarları
  const [searchIconColor, setSearchIconColor] = useState('#94a3b8');
  const [searchTextColor, setSearchTextColor] = useState('#0f172a');
  const [searchBgColor, setSearchBgColor] = useState('#ffffff');
  const [searchBorderColor, setSearchBorderColor] = useState('#e2e8f0');
  const [searchBorderWidth, setSearchBorderWidth] = useState('1px');
  const [searchShadow, setSearchShadow] = useState('shadow-sm');

  // Kategori Buton Ayarları
  const [catBgColor, setCatBgColor] = useState('#ffffff');
  const [catTextColor, setCatTextColor] = useState('#64748b');
  const [catActiveBgColor, setCatActiveBgColor] = useState('#0f172a');
  const [catActiveTextColor, setCatActiveTextColor] = useState('#ffffff');
  const [catBorderColor, setCatBorderColor] = useState('#f1f5f9');
  const [catBorderWidth, setCatBorderWidth] = useState('1px');
  const [catShadow, setCatShadow] = useState('shadow-none');

  // Kategori Ayraç ve Başlık Ayarları
  const [catDividerColor, setCatDividerColor] = useState('#e2e8f0');
  const [catDividerThickness, setCatDividerThickness] = useState('1px');
  const [catDividerShadow, setCatDividerShadow] = useState('shadow-none');
  const [catTitleColor, setCatTitleColor] = useState('#0f172a');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: settingsData, error: settingsError } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
      
      if (!settingsError && settingsData) {
        setPrimaryColor(settingsData.primary_color || '#0f172a');
        setQrColor(settingsData.qr_color || '#0f172a');
        setRestaurantName(settingsData.restaurant_name || 'Resital Lounge');
        setFontFamily(settingsData.font_family || 'Plus Jakarta Sans');
        setCardBgColor(settingsData.card_bg_color || '#ffffff');
        setCardShadow(settingsData.card_shadow || 'shadow-sm');
        setPageBgColor(settingsData.page_bg_color || '#f8fafc');

        // İşletme Profili
        setDescription(settingsData.description || 'Modern Gastronomi Deneyimi');
        setPhone(settingsData.phone || '');
        setWhatsapp(settingsData.whatsapp || '');
        setAddress(settingsData.address || '');
        setWifiPassword(settingsData.wifi_password || 'resital2024');
        setInstagramUsername(settingsData.instagram_username || '');
        setCoverImageUrl(settingsData.cover_image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200');
        
        // Hizmet & Çalışma
        setPaymentMethods(settingsData.payment_methods || 'Nakit, Kredi Kartı');
        setServiceOptions(settingsData.service_options || 'Masaya Servis, Gel-Al');
        setWorkingHours(settingsData.working_hours || 'Her gün: 09:00 - 22:00');

        // Dinamik Özellikler
        setBusinessFeatures(settingsData.business_features || []);

        // Kart Detayları
        setCardPriceColor(settingsData.card_price_color || '#0f172a');
        setCardTitleColor(settingsData.card_title_color || '#1e293b');
        setCardDescColor(settingsData.card_desc_color || '#64748b');
        setCardInfoIconColor(settingsData.card_info_icon_color || '#cbd5e1');
        setCardInfoTextColor(settingsData.card_info_text_color || '#94a3b8');

        // Modal Detayları
        setModalBgColor(settingsData.modal_bg_color || '#ffffff');
        setModalCatTextColor(settingsData.modal_cat_text_color || '#64748b');
        setModalCatBgColor(settingsData.modal_cat_bg_color || '#f1f5f9');
        setModalTitleColor(settingsData.modal_title_color || '#0f172a');
        setModalPriceColor(settingsData.modal_price_color || '#0f172a');
        setModalDescColor(settingsData.modal_desc_color || '#64748b');
        setModalUnitPriceTitleColor(settingsData.modal_unit_price_title_color || '#94a3b8');
        setModalPrepIconColor(settingsData.modal_prep_icon_color || '#cbd5e1');
        setModalPrepTextColor(settingsData.modal_prep_text_color || '#334155');
        setModalCalIconColor(settingsData.modal_cal_icon_color || '#f97316');
        setModalCalTextColor(settingsData.modal_cal_text_color || '#334155');
        setModalIngTitleColor(settingsData.modal_ing_title_color || '#94a3b8');
        setModalIngTagBgColor(settingsData.modal_ing_tag_bg_color || '#f8fafc');
        setModalIngTagTextColor(settingsData.modal_ing_tag_text_color || '#475569');
        setModalAllergenBgColor(settingsData.modal_allergen_bg_color || '#fff1f2');
        setModalAllergenBorderColor(settingsData.modal_allergen_border_color || '#ffe4e6');
        setModalAllergenBorderWidth(settingsData.modal_allergen_border_width || '1px');
        setModalAllergenShadow(settingsData.modal_allergen_shadow || 'shadow-none');
        setModalAllergenTitleColor(settingsData.modal_allergen_title_color || '#e11d48');
        setModalAllergenDescColor(settingsData.modal_allergen_desc_color || '#9f1239');

        setHeaderBgColor(settingsData.header_bg_color || '#ffffff');
        setHeaderTextColor(settingsData.header_text_color || '#0f172a');
        setHeaderIconBgColor(settingsData.header_icon_bg_color || '#f1f5f9');
        setHeaderIconColor(settingsData.header_icon_color || '#475569');
        setHeroTitleColor(settingsData.hero_title_color || '#0f172a');
        setHeroSubtitleColor(settingsData.hero_subtitle_color || '#0f172a');
        
        setSearchIconColor(settingsData.search_icon_color || '#94a3b8');
        setSearchTextColor(settingsData.search_text_color || '#0f172a');
        setSearchBgColor(settingsData.search_bg_color || '#ffffff');
        setSearchBorderColor(settingsData.search_border_color || '#e2e8f0');
        setSearchBorderWidth(settingsData.search_border_width || '1px');
        setSearchShadow(settingsData.search_shadow || 'shadow-sm');

        setCatBgColor(settingsData.cat_bg_color || '#ffffff');
        setCatTextColor(settingsData.cat_text_color || '#64748b');
        setCatActiveBgColor(settingsData.cat_active_bg_color || '#0f172a');
        setCatActiveTextColor(settingsData.cat_active_text_color || '#ffffff');
        setCatBorderColor(settingsData.cat_border_color || '#f1f5f9');
        setCatBorderWidth(settingsData.cat_border_width || '1px');
        setCatShadow(settingsData.cat_shadow || 'shadow-none');

        setCatDividerColor(settingsData.cat_divider_color || '#e2e8f0');
        setCatDividerThickness(settingsData.cat_divider_thickness || '1px');
        setCatDividerShadow(settingsData.cat_divider_shadow || 'shadow-none');
        setCatTitleColor(settingsData.cat_title_color || '#0f172a');
      }

      const { data: menuData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      setMenuItems((menuData || []).map(item => ({
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

      const { data: feedbackData } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
      setFeedbacks(feedbackData || []);

    } catch (err) {
      console.error('Veri çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;
    setSaveLoading(true);
    try {
      const productData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        category_name: editingProduct.category,
        image_url: editingProduct.image,
        is_popular: editingProduct.isPopular,
        calories: editingProduct.calories,
        ingredients: editingProduct.ingredients
      };
      if (editingProduct.id) await supabase.from('products').update(productData).eq('id', editingProduct.id);
      else await supabase.from('products').insert([productData]);
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      alert('Kaydedilirken hata oluştu.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    } catch (err) {
      alert('Silinemedi.');
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Bu değerlendirmeyi silmek istediğinize emin misiniz?')) return;
    try {
      await supabase.from('feedbacks').delete().eq('id', id);
      setFeedbacks(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      alert('Hata: Silinemedi.');
    }
  };

  const toggleFeature = (id: string) => {
    setBusinessFeatures(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const addFeature = () => {
    const newFeature: BusinessFeature = {
      id: Date.now().toString(),
      label: 'Yeni Özellik',
      icon: 'HelpCircle',
      active: true
    };
    setBusinessFeatures(prev => [...prev, newFeature]);
  };

  const removeFeature = (id: string) => {
    setBusinessFeatures(prev => prev.filter(f => f.id !== id));
  };

  const updateFeature = (id: string, updates: Partial<BusinessFeature>) => {
    setBusinessFeatures(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const saveDesignSettings = async () => {
    setSaveLoading(true);
    try {
      const payload = { 
        id: 1,
        primary_color: primaryColor,
        qr_color: qrColor,
        restaurant_name: restaurantName,
        font_family: fontFamily,
        card_bg_color: cardBgColor,
        card_shadow: cardShadow,
        page_bg_color: pageBgColor,
        description: description,
        phone: phone,
        whatsapp: whatsapp,
        address: address,
        wifi_password: wifiPassword,
        instagram_username: instagramUsername,
        cover_image_url: coverImageUrl,
        payment_methods: paymentMethods,
        service_options: serviceOptions,
        working_hours: workingHours,
        business_features: businessFeatures,
        card_price_color: cardPriceColor,
        card_title_color: cardTitleColor,
        card_desc_color: cardDescColor,
        card_info_icon_color: cardInfoIconColor,
        card_info_text_color: cardInfoTextColor,
        modal_bg_color: modalBgColor,
        modal_cat_text_color: modalCatTextColor,
        modal_cat_bg_color: modalCatBgColor,
        modal_title_color: modalTitleColor,
        modal_price_color: modalPriceColor,
        modal_desc_color: modalDescColor,
        modal_unit_price_title_color: modalUnitPriceTitleColor,
        modal_prep_icon_color: modalPrepIconColor,
        modal_prep_text_color: modalPrepTextColor,
        modal_cal_icon_color: modalCalIconColor,
        modal_cal_text_color: modalCalTextColor,
        modal_ing_title_color: modalIngTitleColor,
        modal_ing_tag_bg_color: modalIngTagBgColor,
        modal_ing_tag_text_color: modalIngTagTextColor,
        modal_allergen_bg_color: modalAllergenBgColor,
        modal_allergen_border_color: modalAllergenBorderColor,
        modal_allergen_border_width: modalAllergenBorderWidth,
        modal_allergen_shadow: modalAllergenShadow,
        modal_allergen_title_color: modalAllergenTitleColor,
        modal_allergen_desc_color: modalAllergenDescColor,
        header_bg_color: headerBgColor,
        header_text_color: headerTextColor,
        header_icon_bg_color: headerIconBgColor,
        header_icon_color: headerIconColor,
        hero_title_color: heroTitleColor,
        hero_subtitle_color: heroSubtitleColor,
        search_icon_color: searchIconColor,
        search_text_color: searchTextColor,
        search_bg_color: searchBgColor,
        search_border_color: searchBorderColor,
        search_border_width: searchBorderWidth,
        search_shadow: searchShadow,
        cat_bg_color: catBgColor,
        cat_text_color: catTextColor,
        cat_active_bg_color: catActiveBgColor,
        cat_active_text_color: catActiveTextColor,
        cat_border_color: catBorderColor,
        cat_border_width: catBorderWidth,
        cat_shadow: catShadow,
        cat_divider_color: catDividerColor,
        cat_divider_thickness: catDividerThickness,
        cat_divider_shadow: catDividerShadow,
        cat_title_color: catTitleColor
      };

      const { error } = await supabase.from('settings').upsert(payload);
      if (error) throw error;
      alert('Tasarım ve Ayarlar başarıyla güncellendi.');
    } catch (err: any) {
      alert('Hata: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const getMenuUrl = () => window.location.href.split('#')[0];
  const filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
    const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
  };

  const Stars = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3 h-3 ${i <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center"><span className="text-slate-900 font-black">R</span></div>
          <span className="font-black tracking-tight">Admin Paneli</span>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white/10' : 'text-white/50 hover:bg-white/5'}`}><LayoutDashboard className="w-4 h-4" /> Panel</button>
          <button onClick={() => setActiveTab('menu')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'menu' ? 'bg-white/10' : 'text-white/50 hover:bg-white/5'}`}><Utensils className="w-4 h-4" /> Ürünler</button>
          <button onClick={() => setActiveTab('evaluations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'evaluations' ? 'bg-white/10' : 'text-white/50 hover:bg-white/5'}`}><MessageSquare className="w-4 h-4" /> Değerlendirmeler</button>
          <button onClick={() => setActiveTab('design')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'design' ? 'bg-white/10' : 'text-white/50 hover:bg-white/5'}`}><Palette className="w-4 h-4" /> Tasarım</button>
          <button onClick={() => setActiveTab('qr')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'qr' ? 'bg-white/10' : 'text-white/50 hover:bg-white/5'}`}><QrCode className="w-4 h-4" /> QR Kod</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white/10' : 'text-white/50 hover:bg-white/5'}`}><Settings className="w-4 h-4" /> Ayarlar</button>
        </nav>
        <div className="p-6"><button onClick={onClose} className="w-full py-3 bg-rose-500/10 text-rose-500 rounded-xl text-sm font-bold"><LogOut className="w-4 h-4 inline mr-2" /> Çıkış</button></div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                   <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center"><Package className="text-blue-600" /></div>
                   <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Toplam Ürün</p><h4 className="text-2xl font-black text-slate-900">{menuItems.length}</h4></div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                   <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center"><TrendingUp className="text-amber-600" /></div>
                   <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Popüler Ürünler</p><h4 className="text-2xl font-black text-slate-900">{menuItems.filter(i => i.isPopular).length}</h4></div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                   <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center"><MessageSquare className="text-emerald-600" /></div>
                   <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Yeni Yorumlar</p><h4 className="text-2xl font-black text-slate-900">{feedbacks.length}</h4></div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-black text-slate-900">Müşteri Değerlendirmeleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-slate-100">
                  <p className="text-slate-400 font-bold">Henüz bir değerlendirme yapılmamış.</p>
                </div>
              ) : (
                feedbacks.map(fb => (
                  <div key={fb.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 flex flex-col relative group">
                    <button 
                      onClick={() => handleDeleteFeedback(fb.id)}
                      className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {fb.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{fb.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">{new Date(fb.created_at).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-50">
                      <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Lezzet</p><Stars rating={fb.food_rating} /></div>
                      <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Servis</p><Stars rating={fb.service_rating} /></div>
                      <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Ortam</p><Stars rating={fb.ambiance_rating} /></div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed flex-1 italic">
                      {fb.comment || 'Yorum bırakılmadı.'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl font-black text-slate-900">Menü Yönetimi</h2>
              <button onClick={() => { setEditingProduct({ category: CategoryType.STARTERS, ingredients: [] }); setIsModalOpen(true); }} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5" /> Yeni Ürün Ekle</button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Ürün ara..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-slate-900/5 shadow-sm" />
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="px-6 py-4">Ürün</th><th className="px-6 py-4">Kategori</th><th className="px-6 py-4">Fiyat</th><th className="px-6 py-4">İşlemler</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3"><img src={item.image} className="w-10 h-10 rounded-lg object-cover" /><span className="font-bold text-slate-700">{item.name}</span></td>
                      <td className="px-6 py-4"><span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-600">{item.category}</span></td>
                      <td className="px-6 py-4 font-black text-slate-900">{item.price} TL</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => { setEditingProduct(item); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteProduct(item.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-32">
            <header className="flex flex-col gap-2 mb-8">
              <h2 className="text-3xl font-black text-slate-900">Görsel Kimlik</h2>
              <p className="text-slate-500 text-sm font-medium">Restoranınızın dijital dünyadaki görünümünü buradan özelleştirin.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Type className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Marka & Yazı Tipi</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İşletme Adı</label>
                    <input value={restaurantName} onChange={e => setRestaurantName(e.target.value)} placeholder="Örn: Resital Lounge" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Yazı Tipi Ailesi</label>
                    <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-slate-900/5 font-bold appearance-none cursor-pointer">
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern)</option>
                      <option value="Inter">Inter (Temiz)</option>
                      <option value="Montserrat">Montserrat (Klasik)</option>
                      <option value="Poppins">Poppins (Yumuşak)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Layout className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Üst Menü (Header)</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arka Plan</label><input type="color" value={headerBgColor} onChange={e => setHeaderBgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metin Rengi</label><input type="color" value={headerTextColor} onChange={e => setHeaderTextColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" /></div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-6 left-6 right-6 md:left-[calc(16rem+3rem)] md:right-12 z-40">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-2xl flex items-center justify-between">
                <button onClick={saveDesignSettings} disabled={saveLoading} className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                  {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center max-w-lg mx-auto animate-fade-in">
            <div className="w-64 h-64 bg-slate-50 p-4 rounded-3xl border flex items-center justify-center mb-8"><QRCodeSVG value={getMenuUrl()} size={220} fgColor={qrColor} /></div>
            <button onClick={saveDesignSettings} className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold">QR Kaydet</button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-32">
            <header className="flex flex-col gap-2 mb-8">
              <h2 className="text-3xl font-black text-slate-900">İşletme Ayarları</h2>
              <p className="text-slate-500 text-sm font-medium">Profil bilgilerinizi ve tesis özelliklerinizi buradan yönetin.</p>
            </header>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Store className="text-blue-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">İletişim & Konum</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Temel Bilgiler</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İşletme Adı</label><input value={restaurantName} onChange={e => setRestaurantName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slogan</label><input value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefon</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+90..." className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label><input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+90..." className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" /></div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center"><Info className="text-indigo-500 w-6 h-6" /></div>
                  <div><h3 className="font-black text-slate-900">Hizmet & Ödeme Bilgileri</h3><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Çalışma Şartları</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ödeme Türleri</label><input value={paymentMethods} onChange={e => setPaymentMethods(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Servis Türleri</label><input value={serviceOptions} onChange={e => setServiceOptions(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" /></div>
                  <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Çalışma Saatleri</label><input value={workingHours} onChange={e => setWorkingHours(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" /></div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="text-emerald-500 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">İşletme Özellikleri</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tesis Detayları</p>
                    </div>
                  </div>
                  <button 
                    onClick={addFeature}
                    className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businessFeatures.map((feature) => (
                    <div key={feature.id} className={`p-4 rounded-2xl border-2 flex flex-col gap-4 transition-all ${feature.active ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 opacity-60'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => toggleFeature(feature.id)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${feature.active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                          >
                            <IconRenderer name={feature.icon} className="w-5 h-5" />
                          </div>
                          <input 
                            value={feature.label} 
                            onChange={(e) => updateFeature(feature.id, { label: e.target.value })}
                            className="bg-transparent font-black text-xs uppercase tracking-tight outline-none w-full"
                          />
                        </div>
                        <button onClick={() => removeFeature(feature.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">İkon Adı (Lucide)</label>
                        <input 
                          value={feature.icon} 
                          onChange={(e) => updateFeature(feature.id, { icon: e.target.value })}
                          placeholder="Örn: Wifi, Dog, Baby..."
                          className="w-full bg-white border border-slate-100 rounded-lg p-2 text-[10px] font-bold outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="fixed bottom-6 left-6 right-6 md:left-[calc(16rem+3rem)] md:right-12 z-40">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-2xl flex items-center justify-between">
                <button onClick={saveDesignSettings} disabled={saveLoading} className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                  {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Ayarları Kaydet
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 md:p-12 animate-scale-in">
            <div className="flex items-center justify-between mb-8"><h3 className="text-2xl font-black text-slate-900">{editingProduct?.id ? 'Ürünü Düzenle' : 'Yeni Ürün'}</h3><button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-full"><X className="w-6 h-6 text-slate-400" /></button></div>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Adı</label><input required value={editingProduct?.name || ''} onChange={e => setEditingProduct(p => ({...p!, name: e.target.value}))} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2" /></div>
                <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fiyat</label><input required type="number" value={editingProduct?.price || ''} onChange={e => setEditingProduct(p => ({...p!, price: Number(e.target.value)}))} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2" /></div>
              </div>
              <button type="submit" disabled={saveLoading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3">{saveLoading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />} {editingProduct?.id ? 'Güncelle' : 'Ekle'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
