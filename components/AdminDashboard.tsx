
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Tasarım Ayarları
  const [qrColor, setQrColor] = useState(() => localStorage.getItem('qresta_qr_color') || '#0f172a');
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('qresta_primary_color') || '#0f172a');
  
  // API Ayarları
  const [sbUrl, setSbUrl] = useState(() => localStorage.getItem('qresta_supabase_url') || '');
  const [sbKey, setSbKey] = useState(() => localStorage.getItem('qresta_supabase_key') || '');
  const [cfBucket, setCfBucket] = useState(() => localStorage.getItem('qresta_cf_bucket') || '');

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
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
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
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
      fetchMenu();
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
      fetchMenu();
    } catch (err) {
      alert('Silinemedi');
    }
  };

  const saveSettings = () => {
    localStorage.setItem('qresta_supabase_url', sbUrl);
    localStorage.setItem('qresta_supabase_key', sbKey);
    localStorage.setItem('qresta_cf_bucket', cfBucket);
    alert('Ayarlar kaydedildi. Sayfa yenileniyor...');
    window.location.reload();
  };

  const renderDashboard = () => (
    <div className="space-y-10 animate-fade-in">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Görüntüleme', value: '1,284', icon: <Eye className="text-blue-500" />, positive: true },
          { label: 'Geri Bildirim', value: '42', icon: <MessageSquare className="text-emerald-500" />, positive: true },
          { label: 'Puan', value: '4.8', icon: <Star className="text-amber-500" />, positive: true },
          { label: 'Ürün Sayısı', value: menuItems.length, icon: <Utensils className="text-purple-500" />, positive: true },
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
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black mb-2">Supabase Bağlantısı</h2>
          <p className="text-white/60 text-sm">Veritabanınız şu an {sbUrl ? 'Aktif' : 'Yapılandırılmamış'}</p>
        </div>
        {!sbUrl && <button onClick={() => setActiveTab('settings')} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm">Şimdi Bağla</button>}
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

  const renderSettings = () => (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-500" />
          <h3 className="font-black text-slate-900">Supabase Yapılandırması</h3>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project URL</label>
            <input type="text" value={sbUrl} onChange={(e) => setSbUrl(e.target.value)} placeholder="https://xyz.supabase.co" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anon Key</label>
            <input type="password" value={sbKey} onChange={(e) => setSbKey(e.target.value)} placeholder="eyJhbG..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center gap-3 mb-4">
          <Cloud className="w-6 h-6 text-orange-500" />
          <h3 className="font-black text-slate-900">Cloudflare R2 Ayarları (Resimler)</h3>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bucket Name / Public URL</label>
          <input type="text" value={cfBucket} onChange={(e) => setCfBucket(e.target.value)} placeholder="https://images.site.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-orange-500/20" />
        </div>
      </div>

      <button onClick={saveSettings} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all">Tüm Ayarları Kaydet</button>
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
          <button onClick={() => setActiveTab('qr')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'qr' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><QrCode className="w-4 h-4" /> QR Yönetimi</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><Settings className="w-4 h-4" /> Ayarlar</button>
        </nav>
        <div className="p-6 border-t border-white/5"><button onClick={onClose} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-rose-500/10 text-rose-500 rounded-xl text-sm font-bold hover:bg-rose-500 hover:text-white transition-all"><LogOut className="w-4 h-4" /> Çıkış Yap</button></div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-10">
          {activeTab === 'dashboard' && 'Genel Durum'}
          {activeTab === 'menu' && 'Ürün Yönetimi'}
          {activeTab === 'settings' && 'Sistem Ayarları'}
          {activeTab === 'qr' && 'QR Kod Özelleştirme'}
        </h1>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'menu' && renderMenuManagement()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'qr' && (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center max-w-lg mx-auto">
            <div className="w-64 h-64 bg-slate-50 p-4 rounded-3xl border flex items-center justify-center mb-8">
              <QRCodeSVG value={window.location.origin} size={220} fgColor={qrColor} />
            </div>
            <div className="w-full space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QR Renk</label>
              <div className="flex gap-3">
                {['#0f172a', '#2563eb', '#059669', '#dc2626'].map(c => (
                  <button key={c} onClick={() => { setQrColor(c); localStorage.setItem('qresta_qr_color', c); }} className={`w-10 h-10 rounded-full border-2 ${qrColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Ürün Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black">{editingProduct?.id ? 'Ürünü Düzenle' : 'Yeni Ürün'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><X /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Ürün Adı</label>
                  <input required value={editingProduct?.name || ''} onChange={e => setEditingProduct(p => ({...p!, name: e.target.value}))} className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-slate-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Fiyat (TL)</label>
                  <input required type="number" value={editingProduct?.price || ''} onChange={e => setEditingProduct(p => ({...p!, price: Number(e.target.value)}))} className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-slate-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Kategori</label>
                  <select value={editingProduct?.category} onChange={e => setEditingProduct(p => ({...p!, category: e.target.value as CategoryType}))} className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-slate-100">
                    {Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Görsel URL (veya Cloudflare Linki)</label>
                  <input required value={editingProduct?.image || ''} onChange={e => setEditingProduct(p => ({...p!, image: e.target.value}))} className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-slate-100" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Açıklama</label>
                  <textarea rows={3} value={editingProduct?.description || ''} onChange={e => setEditingProduct(p => ({...p!, description: e.target.value}))} className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-slate-100 resize-none" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <Save />} {editingProduct?.id ? 'Güncelle' : 'Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
