
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
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
  MapPin,
  Phone,
  MessageCircle,
  Wifi,
  ChevronRight
} from 'lucide-react';
import { MENU_DATA } from '../constants.tsx';
import { CategoryType } from '../types.ts';

interface AdminDashboardProps {
  onClose: () => void;
}

type TabType = 'dashboard' | 'menu' | 'reports' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const stats = [
    { label: 'Günlük Görüntüleme', value: '1,284', change: '+12.5%', icon: <Eye className="text-blue-500" />, positive: true },
    { label: 'Toplam Geri Bildirim', value: '42', change: '+5.2%', icon: <MessageSquare className="text-emerald-500" />, positive: true },
    { label: 'Ortalama Puan', value: '4.8', change: '-0.1%', icon: <Star className="text-amber-500" />, positive: false },
    { label: 'Aktif Kullanıcı', value: '18', change: '+2', icon: <Users className="text-purple-500" />, positive: true },
  ];

  const recentFeedbacks = [
    { id: 1, user: 'Ahmet Y.', score: 5, comment: 'Yemekler harikaydı, servis çok hızlıydı.', time: '10 dk önce' },
    { id: 2, user: 'Zeynep K.', score: 4, comment: 'Ambiyans çok güzel ama müzik biraz yüksekti.', time: '45 dk önce' },
    { id: 3, user: 'Can B.', score: 5, comment: 'Trüflü patates mutlaka denenmeli!', time: '2 saat önce' },
  ];

  const popularItems = [
    { name: 'Trüflü Patates', views: 420, price: '145 TL' },
    { name: 'Signature Burger', views: 385, price: '320 TL' },
    { name: 'San Sebastian', views: 290, price: '185 TL' },
    { name: 'Dana Bonfile', views: 150, price: '680 TL' },
  ];

  const renderDashboard = () => (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${stat.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900">Haftalık Ziyaretçi Akışı</h3>
            <select className="bg-slate-50 border-none rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-0">
              <option>Son 7 Gün</option>
              <option>Son 30 Gün</option>
            </select>
          </div>
          <div className="flex items-end justify-between h-48 gap-3">
            {[60, 45, 80, 55, 95, 70, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer">
                <div 
                  className="w-full bg-slate-100 rounded-t-xl relative group-hover:bg-slate-900 transition-colors"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {Math.round(h * 15.4)}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-900 mb-8">En Çok Görüntülenenler</h3>
          <div className="space-y-6">
            {popularItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{item.views}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">Tık</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMenuManagement = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Ürünlerde ara..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-slate-900/5 outline-none"
          />
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
          <Plus className="w-5 h-5" /> Yeni Ürün Ekle
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Görsel & İsim</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fiyat</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MENU_DATA.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={item.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                    <span className="text-sm font-bold text-slate-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-black text-slate-900 text-sm">
                  {item.price} TL
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl text-slate-400 hover:text-rose-500 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toplam QR Okuma</p>
          <div className="flex items-end justify-between">
            <h4 className="text-4xl font-black text-slate-900">24,502</h4>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+18%</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Geri Dönüş Oranı</p>
          <div className="flex items-end justify-between">
            <h4 className="text-4xl font-black text-slate-900">4.2%</h4>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+0.5%</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Yoğun Saat</p>
          <div className="flex items-end justify-between">
            <h4 className="text-4xl font-black text-slate-900">20:30</h4>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Akşam</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-900 mb-8">Kategori Dağılımı</h3>
        <div className="space-y-6">
          {Object.values(CategoryType).map((cat, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 uppercase tracking-wider">{cat}</span>
                <span className="text-slate-900">%{Math.floor(Math.random() * 30) + 5}</span>
              </div>
              <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-900 rounded-full" 
                  style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900">Genel Ayarlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İşletme Adı</label>
              <input type="text" defaultValue="Resital Lounge" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instagram Kullanıcı Adı</label>
              <input type="text" defaultValue="@resitallounge" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefon Numarası</label>
              <input type="text" defaultValue="+90 212 555 00 00" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Numarası</label>
              <input type="text" defaultValue="+90 555 000 00 00" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900">WiFi Ayarları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ağ Adı (SSID)</label>
              <input type="text" defaultValue="Resital_Guest" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WiFi Şifresi</label>
              <input type="text" defaultValue="resital2024" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 outline-none" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50">
          <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <Save className="w-5 h-5" /> Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Plus_Jakarta_Sans']">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-slate-900 font-black">R</span>
            </div>
            <span className="font-black tracking-tight">Qresta Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Panel
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'menu' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <Utensils className="w-4 h-4" /> Menü Yönetimi
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <BarChart3 className="w-4 h-4" /> Raporlar
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <Settings className="w-4 h-4" /> Ayarlar
          </button>
        </nav>

        <div className="p-6">
          <button 
            onClick={onClose}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-sm font-bold transition-all"
          >
            <LogOut className="w-4 h-4" /> Kapat
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 space-y-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {activeTab === 'dashboard' && 'Hoş Geldiniz, Yönetici'}
              {activeTab === 'menu' && 'Menü Yönetimi'}
              {activeTab === 'reports' && 'Performans Raporları'}
              {activeTab === 'settings' && 'İşletme Ayarları'}
            </h1>
            <p className="text-slate-500 font-medium">
              {activeTab === 'dashboard' && 'İşletmenizin performansına göz atın.'}
              {activeTab === 'menu' && 'Ürünleri düzenleyin, fiyatları güncelleyin.'}
              {activeTab === 'reports' && 'Ziyaretçi ve geri bildirim verilerini inceleyin.'}
              {activeTab === 'settings' && 'İletişim ve profil bilgilerinizi yönetin.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GÜNCEL DURUM</span>
              <span className="text-xs font-bold text-slate-900">Çevrimiçi</span>
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-full border-2 border-white shadow-lg overflow-hidden">
               <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'menu' && renderMenuManagement()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
