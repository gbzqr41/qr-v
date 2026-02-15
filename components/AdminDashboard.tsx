
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Settings, LogOut, Utensils, Search, Plus, 
  Edit2, Trash2, Save, QrCode, Palette, X, Loader2, Database,
  TrendingUp, Package, Type as TypeIcon, CreditCard, CheckCircle,
  Type, MousePointer2, Box, Layout, Image as ImageIcon,
  Layers, Minus, Maximize2, Store, Phone, MapPin, Instagram, Wifi, Image,
  MessageCircle, CigaretteOff, Baby, ParkingCircle, Info, Clock, Truck, CreditCard as CardIcon
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase.ts';
import { CategoryType, Product } from '../types.ts';

interface AdminDashboardProps {
  onClose: () => void;
}

type TabType = 'dashboard' | 'menu' | 'qr' | 'design' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [menuItems, setMenuItems] = useState<Product[]>([]);
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

  // Tesis Özellikleri
  const [hasPlayground, setHasPlayground] = useState(false);
  const [hasChildArea, setHasChildArea] = useState(false);
  const [isNoSmoking, setIsNoSmoking] = useState(true);
  const [hasParking, setHasParking] = useState(false);
  
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

        // Tesis Özellikleri
        setHasPlayground(settingsData.has_playground || false);
        setHasChildArea(settingsData.has_child_area || false);
        setIsNoSmoking(settingsData.is_no_smoking ?? true);
        setHasParking(settingsData.has_parking || false);

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
        has_playground: hasPlayground,
        has_child_area: hasChildArea,
        is_no_smoking: isNoSmoking,
        has_parking: hasParking,
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
                   <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center"><TypeIcon className="text-emerald-600" /></div>
                   <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategoriler</p><h4 className="text-2xl font-black text-slate-900">{Object.keys(CategoryType).length}</h4></div>
                </div>
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
              {/* Marka & Tipografi Kartı */}
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
                    <input 
                      value={restaurantName} 
                      onChange={e => setRestaurantName(e.target.value)} 
                      placeholder="Örn: Resital Lounge"
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all font-bold" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Yazı Tipi Ailesi</label>
                    <select 
                      value={fontFamily} 
                      onChange={e => setFontFamily(e.target.value)} 
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-slate-900/5 font-bold appearance-none cursor-pointer"
                    >
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern)</option>
                      <option value="Inter">Inter (Temiz)</option>
                      <option value="Montserrat">Montserrat (Klasik)</option>
                      <option value="Poppins">Poppins (Yumuşak)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Üst Menü (Header) Ayarları */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Layout className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Üst Menü (Header)</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arka Plan</label>
                    <input type="color" value={headerBgColor} onChange={e => setHeaderBgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metin Rengi</label>
                    <input type="color" value={headerTextColor} onChange={e => setHeaderTextColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İkon Dairesi</label>
                    <input type="color" value={headerIconBgColor} onChange={e => setHeaderIconBgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İkon Rengi</label>
                    <input type="color" value={headerIconColor} onChange={e => setHeaderIconColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                </div>
              </div>

              {/* Kategori Buton Ayarları */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Kategori Butonları</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Normal Arka Plan</label>
                    <input type="color" value={catBgColor} onChange={e => setCatBgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Normal Yazı</label>
                    <input type="color" value={catTextColor} onChange={e => setCatTextColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aktif Arka Plan</label>
                    <input type="color" value={catActiveBgColor} onChange={e => setCatActiveBgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aktif Yazı</label>
                    <input type="color" value={catActiveTextColor} onChange={e => setCatActiveTextColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kenarlık Rengi</label>
                    <input type="color" value={catBorderColor} onChange={e => setCatBorderColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kenarlık Kalınlığı</label>
                    <select value={catBorderWidth} onChange={e => setCatBorderWidth(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold text-xs appearance-none">
                      <option value="0px">Yok</option><option value="1px">İnce (1px)</option><option value="2px">Orta (2px)</option><option value="3px">Kalın (3px)</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gölge (Buton Gölgesi)</label>
                    <select value={catShadow} onChange={e => setCatShadow(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold text-xs appearance-none">
                      <option value="shadow-none">Yok</option><option value="shadow-sm">Hafif</option><option value="shadow-md">Belirgin</option><option value="shadow-lg">Güçlü</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Kategori Ayraç ve Başlık Ayarları */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <Minus className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Ayraç ve Başlıklar</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ayraç Rengi</label>
                    <input type="color" value={catDividerColor} onChange={e => setCatDividerColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Başlık Rengi</label>
                    <input type="color" value={catTitleColor} onChange={e => setCatTitleColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ayraç Kalınlığı</label>
                    <select value={catDividerThickness} onChange={e => setCatDividerThickness(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold text-xs appearance-none">
                      <option value="0px">Yok</option><option value="1px">İnce (1px)</option><option value="2px">Orta (2px)</option><option value="4px">Kalın (4px)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ayraç Gölgesi</label>
                    <select value={catDividerShadow} onChange={e => setCatDividerShadow(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold text-xs appearance-none">
                      <option value="shadow-none">Yok</option><option value="shadow-sm">Hafif</option><option value="shadow-md">Belirgin</option><option value="shadow-lg">Güçlü</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ürün Kart Stili */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6 md:col-span-2">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <Box className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Ürün Kart Stili & Renkleri</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kart Arka Plan Rengi</label>
                      <div className="flex flex-wrap gap-4">
                        {['#ffffff', '#f8fafc', '#f1f5f9', '#fff7ed'].map(c => (
                          <button key={c} onClick={() => setCardBgColor(c)} className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-bold text-xs ${cardBgColor === c ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>
                            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} /> {c === '#ffffff' ? 'Beyaz' : c === '#f8fafc' ? 'Buz' : c === '#f1f5f9' ? 'Gümüş' : 'Krem'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Derinlik (Gölge)</label>
                      <div className="flex flex-wrap gap-3">
                        {['shadow-none', 'shadow-sm', 'shadow-md', 'shadow-xl'].map(s => (
                          <button key={s} onClick={() => setCardShadow(s)} className={`flex-1 px-4 py-3 rounded-2xl border-2 transition-all font-bold text-xs text-center ${cardShadow === s ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>{s === 'shadow-none' ? 'Düz' : s === 'shadow-sm' ? 'Hafif' : s === 'shadow-md' ? 'Orta' : 'Yüksek'}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fiyat Rengi</label><input type="color" value={cardPriceColor} onChange={e => setCardPriceColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ürün İsim Rengi</label><input type="color" value={cardTitleColor} onChange={e => setCardTitleColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Açıklama Rengi</label><input type="color" value={cardDescColor} onChange={e => setCardDescColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alt İkon Rengi</label><input type="color" value={cardInfoIconColor} onChange={e => setCardInfoIconColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" /></div>
                    <div className="col-span-2 space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alt Bilgi Yazı Rengi (Dk/Kcal)</label><input type="color" value={cardInfoTextColor} onChange={e => setCardInfoTextColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" /></div>
                  </div>
                </div>
              </div>

              {/* Ürün Detay (Modal) Ayarları */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6 md:col-span-2">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Ürün Detay (Modal) Sayfası Ayarları</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detay Arka Plan</label>
                      <input type="color" value={modalBgColor} onChange={e => setModalBgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ürün Adı Rengi</label>
                      <input type="color" value={modalTitleColor} onChange={e => setModalTitleColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fiyat Rengi</label>
                      <input type="color" value={modalPriceColor} onChange={e => setModalPriceColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Açıklama Rengi</label>
                      <input type="color" value={modalDescColor} onChange={e => setModalDescColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kat. Yazı</label>
                        <input type="color" value={modalCatTextColor} onChange={e => setModalCatTextColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none bg-transparent" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kat. Buton</label>
                        <input type="color" value={modalCatBgColor} onChange={e => setModalCatBgColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none bg-transparent" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Birim Fiyat Başlık</label>
                      <input type="color" value={modalUnitPriceTitleColor} onChange={e => setModalUnitPriceTitleColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none bg-transparent" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hazır. İkon</label>
                        <input type="color" value={modalPrepIconColor} onChange={e => setModalPrepIconColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none bg-transparent" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Süre Yazı</label>
                        <input type="color" value={modalPrepTextColor} onChange={e => setModalPrepTextColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none bg-transparent" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kalori İkon</label>
                        <input type="color" value={modalCalIconColor} onChange={e => setModalCalIconColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none bg-transparent" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kalori Yazı</label>
                        <input type="color" value={modalCalTextColor} onChange={e => setModalCalTextColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none bg-transparent" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İçindekiler Başlık</label>
                      <input type="color" value={modalIngTitleColor} onChange={e => setModalIngTitleColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none bg-transparent" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İçerik Etik. Arka</label>
                        <input type="color" value={modalIngTagBgColor} onChange={e => setModalIngTagBgColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none bg-transparent" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İçerik Etik. Yazı</label>
                        <input type="color" value={modalIngTagTextColor} onChange={e => setModalIngTagTextColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none bg-transparent" />
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Alerjen Kutusu</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="color" value={modalAllergenBgColor} onChange={e => setModalAllergenBgColor(e.target.value)} className="w-full h-8 rounded-lg cursor-pointer" />
                        <input type="color" value={modalAllergenBorderColor} onChange={e => setModalAllergenBorderColor(e.target.value)} className="w-full h-8 rounded-lg cursor-pointer" />
                        <input type="color" value={modalAllergenTitleColor} onChange={e => setModalAllergenTitleColor(e.target.value)} className="w-full h-8 rounded-lg cursor-pointer" />
                        <input type="color" value={modalAllergenDescColor} onChange={e => setModalAllergenDescColor(e.target.value)} className="w-full h-8 rounded-lg cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genel Arka Plan Rengi Kartı */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                    <Palette className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Genel Arka Plan Rengi</h3>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ana Sayfa Arka Plan</label>
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {['#f8fafc', '#ffffff', '#f1f5f9', '#fafaf9', '#fdf2f8'].map(c => (
                      <button 
                        key={c} 
                        onClick={() => setPageBgColor(c)} 
                        className={`aspect-square rounded-2xl border-4 transition-all hover:scale-105 active:scale-95 ${pageBgColor === c ? 'border-slate-900' : 'border-white shadow-sm'}`} 
                        style={{ backgroundColor: c }} 
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Özel Renk Seç</label>
                    <input type="color" value={pageBgColor} onChange={e => setPageBgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                </div>
              </div>

              {/* Slider (Hero) Ayarları */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Slider Başlık Renkleri</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ana Başlık</label>
                    <input type="color" value={heroTitleColor} onChange={e => setHeroTitleColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Üst Başlık</label>
                    <input type="color" value={heroSubtitleColor} onChange={e => setHeroSubtitleColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                </div>
              </div>

              {/* Arama Çubuğu Ayarları */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Arama Çubuğu</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İkon Rengi</label>
                    <input type="color" value={searchIconColor} onChange={e => setSearchIconColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Yazı Rengi</label>
                    <input type="color" value={searchTextColor} onChange={e => setSearchTextColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arka Plan</label>
                    <input type="color" value={searchBgColor} onChange={e => setSearchBgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kenarlık Rengi</label>
                    <input type="color" value={searchBorderColor} onChange={e => setSearchBorderColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kenarlık Kalınlığı</label>
                    <select value={searchBorderWidth} onChange={e => setSearchBorderWidth(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold text-xs appearance-none">
                      <option value="0px">Yok</option><option value="1px">İnce (1px)</option><option value="2px">Orta (2px)</option><option value="3px">Kalın (3px)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gölge</label>
                    <select value={searchShadow} onChange={e => setSearchShadow(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold text-xs appearance-none">
                      <option value="shadow-none">Yok</option><option value="shadow-sm">Hafif</option><option value="shadow-md">Belirgin</option><option value="shadow-lg">Güçlü</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sabit Alt Çubuk */}
            <div className="fixed bottom-6 left-6 right-6 md:left-[calc(16rem+3rem)] md:right-12 z-40">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-2xl flex items-center justify-between">
                <div className="hidden md:block pl-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Bekleyen Değişiklikler</p>
                  <p className="text-[10px] font-bold text-slate-500">Tasarımı yayına almak için kaydet butonuna basın.</p>
                </div>
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
            <div className="w-full space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">QR Renk</label>
               <div className="flex justify-center gap-3">
                 {['#0f172a', '#2563eb', '#059669', '#dc2626'].map(c => (<button key={c} onClick={() => setQrColor(c)} className={`w-10 h-10 rounded-full border-2 ${qrColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />))}
               </div>
               <button onClick={saveDesignSettings} className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold">QR Kaydet</button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-32">
            <header className="flex flex-col gap-2 mb-8">
              <h2 className="text-3xl font-black text-slate-900">İşletme Ayarları</h2>
              <p className="text-slate-500 text-sm font-medium">Profil bilgilerinizi ve tesis özelliklerinizi buradan yönetin.</p>
            </header>

            <div className="space-y-6">
              {/* Grup 1: İletişim & Konum */}
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
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İşletme Adı</label>
                    <input 
                      value={restaurantName} 
                      onChange={e => setRestaurantName(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slogan</label>
                    <input 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                      <input 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        placeholder="+90..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 font-bold outline-none focus:ring-2" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
                    <div className="relative">
                      <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                      <input 
                        value={whatsapp} 
                        onChange={e => setWhatsapp(e.target.value)} 
                        placeholder="+90..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 font-bold outline-none focus:ring-2" 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adres</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-slate-300 w-4 h-4" />
                      <textarea 
                        rows={2}
                        value={address} 
                        onChange={e => setAddress(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 font-bold outline-none focus:ring-2" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grup 2: Hizmet & Ödeme Bilgileri */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <Info className="text-indigo-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Hizmet & Ödeme Bilgileri</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Çalışma Şartları</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ödeme Türleri</label>
                    <div className="relative">
                      <CardIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                      <input 
                        value={paymentMethods} 
                        onChange={e => setPaymentMethods(e.target.value)} 
                        placeholder="Nakit, Kredi Kartı, Sodexo..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 font-bold outline-none focus:ring-2" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Servis Türleri</label>
                    <div className="relative">
                      <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                      <input 
                        value={serviceOptions} 
                        onChange={e => setServiceOptions(e.target.value)} 
                        placeholder="Masaya Servis, Gel-Al, Paket Servis..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 font-bold outline-none focus:ring-2" 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Çalışma Saatleri</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                      <input 
                        value={workingHours} 
                        onChange={e => setWorkingHours(e.target.value)} 
                        placeholder="Pzt-Cmt: 09:00 - 22:00, Paz: Kapalı"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 font-bold outline-none focus:ring-2" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grup 3: Sosyal Medya & Diğer */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                    <Instagram className="text-rose-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Sosyal Medya & Bağlantılar</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instagram & Görseller</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instagram Kullanıcı Adı</label>
                    <input 
                      value={instagramUsername} 
                      onChange={e => setInstagramUsername(e.target.value)} 
                      placeholder="resitallounge"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WiFi Şifresi</label>
                    <input 
                      value={wifiPassword} 
                      onChange={e => setWifiPassword(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kapak Görseli URL</label>
                    <input 
                      value={coverImageUrl} 
                      onChange={e => setCoverImageUrl(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold outline-none focus:ring-2" 
                    />
                  </div>
                </div>
              </div>

              {/* Grup 4: İşletme Özellikleri */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="text-emerald-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">İşletme Özellikleri</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tesis Detayları</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setHasPlayground(!hasPlayground)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${hasPlayground ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    <Baby className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Oyun Parkı</span>
                  </button>
                  <button 
                    onClick={() => setHasChildArea(!hasChildArea)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${hasChildArea ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Çocuk Alanı</span>
                  </button>
                  <button 
                    onClick={() => setIsNoSmoking(!isNoSmoking)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${isNoSmoking ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    <CigaretteOff className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Sigara İçilmez</span>
                  </button>
                  <button 
                    onClick={() => setHasParking(!hasParking)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${hasParking ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    <ParkingCircle className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Otopark</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sabit Alt Çubuk */}
            <div className="fixed bottom-6 left-6 right-6 md:left-[calc(16rem+3rem)] md:right-12 z-40">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-2xl flex items-center justify-between">
                <div className="hidden md:block pl-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ayarları Uygula</p>
                  <p className="text-[10px] font-bold text-slate-500">Tüm değişiklikleri kaydetmek için basın.</p>
                </div>
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
                <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label><select value={editingProduct?.category} onChange={e => setEditingProduct(p => ({...p!, category: e.target.value as CategoryType}))} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2">{Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Görsel</label><input value={editingProduct?.image || ''} onChange={e => setEditingProduct(p => ({...p!, image: e.target.value}))} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2" /></div>
              </div>
              <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Açıklama</label><textarea rows={3} value={editingProduct?.description || ''} onChange={e => setEditingProduct(p => ({...p!, description: e.target.value}))} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2" /></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={editingProduct?.isPopular || false} onChange={e => setEditingProduct(p => ({...p!, isPopular: e.target.checked}))} id="pop" /><label htmlFor="pop" className="text-sm font-bold text-slate-700">Popüler</label></div>
              <button type="submit" disabled={saveLoading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3">{saveLoading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />} {editingProduct?.id ? 'Güncelle' : 'Ekle'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
