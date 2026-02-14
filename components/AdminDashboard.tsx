
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Eye, 
  Star, 
  ArrowUpRight, 
  Utensils,
  MessageSquare,
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  QrCode,
  Palette,
  X,
  Loader2,
  Database
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

  // Tasarım Ayarları
  const [qrColor, setQrColor] = useState('#0f172a');
  const [primaryColor, setPrimaryColor] = useState('#0f172a');
  const [restaurantName, setRestaurantName] = useState('Resital Lounge');
  
  // API Ayarları
  const [sbUrl, setSbUrl] = useState(() => localStorage.getItem('qresta_supabase_url') || '');
  const [sbKey, setSbKey] = useState(() => localStorage.getItem('qresta_supabase_key') || '');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (settingsData) {
          setPrimaryColor(settingsData.primary_color || '#0f172a');
          setQrColor(settingsData.qr_color || '#0f172a');
          setRestaurantName(settingsData.restaurant_name || 'Resital Lounge');
        }

        const { data: menuData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
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

  const saveDesignSettings = async () => {
    setSaveLoading(true);
    try {
      const { error } = await supabase.from('settings').upsert({
        id: 1,
        primary_color: primaryColor,
        qr_color: qrColor,
        restaurant_name: restaurantName
      });

      if (error) throw error;
      alert('Değişiklikler tüm müşteriler için aktif edildi.');
    } catch (err: any) {
      alert('Hata: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const getMenuUrl = () => window.location.href.split('#')[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
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
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white/10' : 'text-white/50 hover:bg-white/5'}`}><Settings className="w-4 h-4" /> Sistem</button>
        </nav>
        <div className="p-6"><button onClick={onClose} className="w-full py-3 bg-rose-500/10 text-rose-500 rounded-xl text-sm font-bold"><LogOut className="w-4 h-4 inline mr-2" /> Çıkış</button></div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === 'design' ? (
          <div className="max-w-lg mx-auto space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 text-center">Görsel Kimlik</h3>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Restoran Adı</label>
                <input value={restaurantName} onChange={e => setRestaurantName(e.target.value)} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500/10" />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ana Tema Rengi</label>
                <div className="grid grid-cols-4 gap-4">
                  {['#0f172a', '#2563eb', '#059669', '#dc2626', '#d97706', '#7c3aed', '#000000', '#4b5563'].map(c => (
                    <button key={c} onClick={() => setPrimaryColor(c)} className={`aspect-square rounded-2xl border-4 transition-all ${primaryColor === c ? 'border-slate-900 scale-105 shadow-lg' : 'border-white'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              <button onClick={saveDesignSettings} disabled={saveLoading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl">
                {saveLoading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />} Buluta Kaydet
              </button>
            </div>
          </div>
        ) : activeTab === 'qr' ? (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center max-w-lg mx-auto">
            <div className="w-64 h-64 bg-slate-50 p-4 rounded-3xl border flex items-center justify-center mb-8">
              <QRCodeSVG value={getMenuUrl()} size={220} fgColor={qrColor} />
            </div>
            <div className="w-full space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QR Renk</label>
               <div className="flex gap-3">
                 {['#0f172a', '#2563eb', '#059669', '#dc2626'].map(c => (
                   <button key={c} onClick={() => setQrColor(c)} className={`w-10 h-10 rounded-full border-2 ${qrColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                 ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">Diğer sekmeler aktif</div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
