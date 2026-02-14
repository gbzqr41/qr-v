
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Settings, LogOut, Utensils, Search, Plus, 
  Edit2, Trash2, Save, QrCode, Palette, X, Loader2, Database,
  TrendingUp, Package, Type as TypeIcon, CreditCard, CheckCircle,
  Type, MousePointer2, Box, Layout, Image as ImageIcon
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
  
  // Header Ayarları
  const [headerBgColor, setHeaderBgColor] = useState('#ffffff');
  const [headerTextColor, setHeaderTextColor] = useState('#0f172a');
  const [headerIconBgColor, setHeaderIconBgColor] = useState('#f1f5f9');
  const [headerIconColor, setHeaderIconColor] = useState('#475569');

  // Slider (Hero) Ayarları
  const [heroTitleColor, setHeroTitleColor] = useState('#0f172a');
  const [heroSubtitleColor, setHeroSubtitleColor] = useState('#0f172a');

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
        setHeaderBgColor(settingsData.header_bg_color || '#ffffff');
        setHeaderTextColor(settingsData.header_text_color || '#0f172a');
        setHeaderIconBgColor(settingsData.header_icon_bg_color || '#f1f5f9');
        setHeaderIconColor(settingsData.header_icon_color || '#475569');
        setHeroTitleColor(settingsData.hero_title_color || '#0f172a');
        setHeroSubtitleColor(settingsData.hero_subtitle_color || '#0f172a');
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
        header_bg_color: headerBgColor,
        header_text_color: headerTextColor,
        header_icon_bg_color: headerIconBgColor,
        header_icon_color: headerIconColor,
        hero_title_color: heroTitleColor,
        hero_subtitle_color: heroSubtitleColor
      };

      const { error } = await supabase.from('settings').upsert(payload);
      if (error) throw error;
      alert('Tasarım başarıyla güncellendi.');
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
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-24">
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

              {/* Renk Teması Kartı */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                    <Palette className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Vurgu Rengi</h3>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vurgu Rengi (Accent)</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['#0f172a', '#2563eb', '#059669', '#dc2626', '#d97706', '#7c3aed', '#000000', '#4b5563'].map(c => (
                      <button 
                        key={c} 
                        onClick={() => setPrimaryColor(c)} 
                        className={`aspect-square rounded-2xl border-4 transition-all hover:scale-105 active:scale-95 ${primaryColor === c ? 'border-slate-900' : 'border-white shadow-sm'}`} 
                        style={{ backgroundColor: c }} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Kart Stilleri Kartı */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6 md:col-span-2">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <Box className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800">Menü Kart Stili</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kart Arka Plan Rengi</label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { val: '#ffffff', label: 'Beyaz' },
                        { val: '#f8fafc', label: 'Buz' },
                        { val: '#f1f5f9', label: 'Gümüş' },
                        { val: '#fff7ed', label: 'Krem' }
                      ].map(item => (
                        <button 
                          key={item.val} 
                          onClick={() => setCardBgColor(item.val)} 
                          className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-bold text-xs ${cardBgColor === item.val ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-600'}`}
                        >
                          <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: item.val }} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Derinlik (Gölge)</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { val: 'shadow-none', label: 'Düz' },
                        { val: 'shadow-sm', label: 'Hafif' },
                        { val: 'shadow-md', label: 'Orta' },
                        { val: 'shadow-xl', label: 'Yüksek' }
                      ].map(item => (
                        <button 
                          key={item.val} 
                          onClick={() => setCardShadow(item.val)} 
                          className={`flex-1 px-4 py-3 rounded-2xl border-2 transition-all font-bold text-xs text-center ${cardShadow === item.val ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-600'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sabit Alt Çubuk (Kaydet) */}
            <div className="fixed bottom-6 left-6 right-6 md:left-[calc(16rem+3rem)] md:right-12 z-40">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-2xl flex items-center justify-between">
                <div className="hidden md:block pl-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Bekleyen Değişiklikler</p>
                  <p className="text-[10px] font-bold text-slate-500">Tasarımı yayına almak için kaydet butonuna basın.</p>
                </div>
                <button 
                  onClick={saveDesignSettings} 
                  disabled={saveLoading} 
                  className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center max-w-lg mx-auto animate-fade-in">
            <div className="w-64 h-64 bg-slate-50 p-4 rounded-3xl border flex items-center justify-center mb-8">
              <QRCodeSVG value={getMenuUrl()} size={220} fgColor={qrColor} />
            </div>
            <div className="w-full space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">QR Renk</label>
               <div className="flex justify-center gap-3">
                 {['#0f172a', '#2563eb', '#059669', '#dc2626'].map(c => (
                   <button key={c} onClick={() => setQrColor(c)} className={`w-10 h-10 rounded-full border-2 ${qrColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                 ))}
               </div>
               <button onClick={saveDesignSettings} className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold">QR Kaydet</button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-lg mx-auto space-y-8 animate-fade-in">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
               <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                 <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="text-emerald-500 w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-black text-slate-900">Hesap Durumu</h3>
                   <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Premium Plan Aktif</p>
                 </div>
               </div>
               <div className="space-y-6">
                 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                   <div className="flex items-center gap-3">
                     <CreditCard className="w-5 h-5 text-slate-400" />
                     <span className="text-sm font-bold text-slate-600">Aktif Paket</span>
                   </div>
                   <span className="text-sm font-black text-slate-900">Qresta PLUS+</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                   <div className="flex items-center gap-3">
                     <Database className="w-5 h-5 text-slate-400" />
                     <span className="text-sm font-bold text-slate-600">Bitiş Tarihi</span>
                   </div>
                   <span className="text-sm font-black text-slate-900">31.12.2025</span>
                 </div>
               </div>
               <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                 <p className="text-xs font-medium text-blue-700 leading-relaxed">
                   Premium üye olduğunuz için tüm özelliklere sınırsız erişiminiz bulunmaktadır.
                 </p>
               </div>
            </div>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 md:p-12 animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900">{editingProduct?.id ? 'Ürünü Düzenle' : 'Yeni Ürün'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-full"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Adı</label><input required value={editingProduct?.name || ''} onChange={e => setEditingProduct(p => ({...p!, name: e.target.value}))} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2" /></div>
                <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fiyat</label><input required type="number" value={editingProduct?.price || ''} onChange={e => setEditingProduct(p => ({...p!, price: Number(e.target.value)}))} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2" /></div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                  <select value={editingProduct?.category} onChange={e => setEditingProduct(p => ({...p!, category: e.target.value as CategoryType}))} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2">
                    {Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Görsel</label><input value={editingProduct?.image || ''} onChange={e => setEditingProduct(p => ({...p!, image: e.target.value}))} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2" /></div>
              </div>
              <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Açıklama</label><textarea rows={3} value={editingProduct?.description || ''} onChange={e => setEditingProduct(p => ({...p!, description: e.target.value}))} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 outline-none focus:ring-2" /></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={editingProduct?.isPopular || false} onChange={e => setEditingProduct(p => ({...p!, isPopular: e.target.checked}))} id="pop" /><label htmlFor="pop" className="text-sm font-bold text-slate-700">Popüler</label></div>
              <button type="submit" disabled={saveLoading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3">
                {saveLoading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />} {editingProduct?.id ? 'Güncelle' : 'Ekle'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
