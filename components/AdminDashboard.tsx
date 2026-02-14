
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Users, 
  Eye, 
  Star, 
  ArrowUpRight, 
  ArrowDownRight,
  Utensils,
  MessageSquare,
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  Clock,
  QrCode,
  Palette,
  Download,
  Printer,
  X,
  Loader2,
  Globe,
  Database,
  Cloud
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase.ts';
import { CategoryType, Product } from '../types.ts';

interface AdminDashboardProps {
  onClose: () => void;
}

type TabType = 'dashboard' | 'menu' | 'qr' | 'reports' | 'design' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Tasarım Ayarları (Başlangıçta veritabanından çekilecek)
  const [qrColor, setQrColor] = useState('#0f172a');
  const [primaryColor, setPrimaryColor] = useState('#0f172a');
  
  // API Ayarları
  const [sbUrl, setSbUrl] = useState(() => localStorage.getItem('qresta_supabase_url') || '');
  const [sbKey, setSbKey] = useState(() => localStorage.getItem('qresta_supabase_key') || '');
  const [cfBucket, setCfBucket] = useState(() => localStorage.getItem('qresta_cf_bucket') || '');

  // Başlangıçta ayarları ve menüyü çek
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Ayarları Çek
        const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (settingsData) {
          setPrimaryColor(settingsData.primary_color || '#0f172a');
          setQrColor(settingsData.qr_color || '#0f172a');
        }

        // 2. Menüyü Çek
        const { data: menuData, error: menuError } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (menuError) throw menuError;
        setMenuItems((menuData || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category_name as CategoryType,
          image: item.image_url,
          isPopular: item.is_popular,
          calories: item.calories,
          ingredients: item.ingredients || []
        })));
      } catch (err) {
        console.error('Hata:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setLoading(true);

    const productData = {
      name: editingProduct.name,
      description: editingProduct.description,
      price: Number(editingProduct.price),
      category_name: editingProduct.category,
      image_url: editingProduct.image,
      is_popular: editingProduct.isPopular,
      calories: Number(editingProduct.calories),
      ingredients: editingProduct.ingredients || []
    };

    try {
      if (editingProduct.id) {
        await supabase.from('products').update(productData).eq('id', editingProduct.id);
      } else {
        await supabase.from('products').insert([productData]);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      // Menüyü yenile
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      setMenuItems((data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category_name as CategoryType,
        image: item.image_url,
        isPopular: item.is_popular,
        calories: item.calories,
        ingredients: item.ingredients || []
      })));
    } catch (err) {
      alert('Kaydedilemedi: ' + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await supabase.from('products').delete().eq('id', id);
      setMenuItems(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Silinemedi');
    }
  };

  const saveSettings = () => {
    localStorage.setItem('qresta_supabase_url', sbUrl);
    localStorage.setItem('qresta_supabase_key', sbKey);
    localStorage.setItem('qresta_cf_bucket', cfBucket);
    alert('Sistem ayarları kaydedildi. Sayfa yenileniyor...');
    window.location.reload();
  };

  const saveDesignSettings = async () => {
    setSaveLoading(true);
    try {
      const { error } = await supabase.from('settings').upsert({
        id: 1,
        primary_color: primaryColor,
        qr_color: qrColor
      });

      if (error) throw error;
      alert('Tasarım ayarları başarıyla buluta kaydedildi. Tüm müşteriler artık bu rengi görecek.');
    } catch (err: any) {
      alert('Veritabanına kaydedilemedi: ' + err.message + '\nLütfen "settings" tablosunun Supabase üzerinde mevcut olduğundan emin olun.');
    } finally {
      setSaveLoading(false);
    }
  };

  const getMenuUrl = () => {
    const currentUrl = window.location.href;
    return currentUrl.split('#')[0];
  };

  const renderDashboard = () => (
    <div className="space-y-10 animate-fade-in">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Görüntüleme', value: '1,284', icon: <Eye className="text-blue-500" /> },
          { label: 'Geri Bildirim', value: '42', icon: <MessageSquare className="text-emerald-500" /> },
          { label: 'Puan', value: '4.8', icon: <Star className="text-amber-500" /> },
          { label: 'Ürün Sayısı', value: menuItems.length, icon: <Utensils className="text-purple-500" /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">{stat.icon}</div>
              <div className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +12%</div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMenuManagement = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input type="text" placeholder="Ürünlerde ara..." className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none" />
        </div>
        <button onClick={() => { setEditingProduct({ category: CategoryType.MAIN_COURSES, ingredients: [], isPopular: false }); setIsModalOpen(true); }} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
          <Plus className="w-5 h-5" /> Yeni Ürün Ekle
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ürün</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fiyat</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">Yükleniyor...</td></tr>
            ) : menuItems.length === 0 ? (
              <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">Ürün Bulunamadı</td></tr>
            ) : (
              menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <span className="text-sm font-bold text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase">{item.category}</span></td>
                  <td className="px-6 py-4 font-black text-slate-900 text-sm">{item.price} TL</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingProduct(item); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-slate-900"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteProduct(item.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDesignSettings = () => (
    <div className="max-w-lg mx-auto space-y-10 animate-fade-in">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-slate-900" />
        </div>
        <h3 className="text-xl font-black text-slate-900">Bulut Tabanlı Tasarım</h3>
        
        <div className="space-y-6 text-left">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Müşteri Paneli Ana Rengi</label>
            <div className="grid grid-cols-4 gap-4">
              {['#0f172a', '#2563eb', '#059669', '#dc2626', '#d97706', '#7c3aed', '#000000', '#4b5563'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setPrimaryColor(c)}
                  className={`aspect-square rounded-2xl border-4 transition-all ${primaryColor === c ? 'border-slate-900 scale-105 shadow-lg' : 'border-white'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">QR Kod Rengi</label>
            <div className="flex gap-3">
              {['#0f172a', '#2563eb', '#059669', '#dc2626'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setQrColor(c)} 
                  className={`w-10 h-10 rounded-full border-2 ${qrColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} 
                  style={{ backgroundColor: c }} 
                />
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={saveDesignSettings} 
          disabled={saveLoading}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {saveLoading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />} 
          Tüm Cihazlara Uygula (Buluta Kaydet)
        </button>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest text-center mb-1">PRO BİLGİ</p>
        <p className="text-xs text-blue-700 text-center font-medium leading-relaxed">
          Buradaki değişiklikler anında Supabase veritabanına kaydedilir ve müşterileriniz sayfayı yenilediğinde yeni renkleri görür.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center"><span className="text-slate-900 font-black">R</span></div>
          <span className="font-black tracking-tight">Admin Paneli</span>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><LayoutDashboard className="w-4 h-4" /> Panel</button>
          <button onClick={() => setActiveTab('menu')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'menu' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><Utensils className="w-4 h-4" /> Menü Yönetimi</button>
          <button onClick={() => setActiveTab('design')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'design' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><Palette className="w-4 h-4" /> Tasarım Ayarları</button>
          <button onClick={() => setActiveTab('qr')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'qr' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><QrCode className="w-4 h-4" /> QR Yönetimi</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><Settings className="w-4 h-4" /> Ayarlar</button>
        </nav>
        <div className="p-6 border-t border-white/5"><button onClick={onClose} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-rose-500/10 text-rose-500 rounded-xl text-sm font-bold hover:bg-rose-500 hover:text-white transition-all"><LogOut className="w-4 h-4" /> Çıkış Yap</button></div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-10">
          {activeTab === 'dashboard' && 'Genel Durum'}
          {activeTab === 'menu' && 'Ürün Yönetimi'}
          {activeTab === 'design' && 'Tasarım Ayarları'}
          {activeTab === 'settings' && 'Sistem Ayarları'}
          {activeTab === 'qr' && 'QR Kod Önizleme'}
        </h1>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'menu' && renderMenuManagement()}
        {activeTab === 'design' && renderDesignSettings()}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-8 animate-fade-in">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-blue-500" />
                <h3 className="font-black text-slate-900">Supabase Bağlantısı</h3>
              </div>
              <div className="space-y-4">
                <input type="text" value={sbUrl} onChange={e => setSbUrl(e.target.value)} placeholder="Project URL" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none" />
                <input type="password" value={sbKey} onChange={e => setSbKey(e.target.value)} placeholder="Anon Key" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none" />
              </div>
              <button onClick={saveSettings} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Ayarları Kaydet</button>
            </div>
          </div>
        )}
        {activeTab === 'qr' && (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center max-w-lg mx-auto">
            <div className="w-64 h-64 bg-slate-50 p-4 rounded-3xl border flex items-center justify-center mb-8">
              <QRCodeSVG value={getMenuUrl()} size={220} fgColor={qrColor} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center break-all">{getMenuUrl()}</p>
          </div>
        )}
      </main>

      {/* Ürün Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black">{editingProduct?.id ? 'Ürünü Düzenle' : 'Yeni Ürün'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><X /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <input required placeholder="Ürün Adı" value={editingProduct?.name || ''} onChange={e => setEditingProduct(p => ({...p!, name: e.target.value}))} className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-slate-100" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Fiyat" value={editingProduct?.price || ''} onChange={e => setEditingProduct(p => ({...p!, price: Number(e.target.value)}))} className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-slate-100" />
                <select value={editingProduct?.category} onChange={e => setEditingProduct(p => ({...p!, category: e.target.value as CategoryType}))} className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-slate-100">
                  {Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <input required placeholder="Görsel URL" value={editingProduct?.image || ''} onChange={e => setEditingProduct(p => ({...p!, image: e.target.value}))} className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-slate-100" />
              <textarea placeholder="Açıklama" value={editingProduct?.description || ''} onChange={e => setEditingProduct(p => ({...p!, description: e.target.value}))} className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-slate-100 resize-none" rows={3} />
              <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
