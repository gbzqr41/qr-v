
import React from 'react';
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
  MessageSquare
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
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
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-sm font-bold">
            <LayoutDashboard className="w-4 h-4" /> Panel
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:bg-white/5 hover:text-white rounded-xl text-sm font-bold transition-all">
            <Utensils className="w-4 h-4" /> Menü Yönetimi
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:bg-white/5 hover:text-white rounded-xl text-sm font-bold transition-all">
            <BarChart3 className="w-4 h-4" /> Raporlar
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:bg-white/5 hover:text-white rounded-xl text-sm font-bold transition-all">
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
            <h1 className="text-3xl font-black text-slate-900">Hoş Geldiniz, Yönetici</h1>
            <p className="text-slate-500 font-medium">İşletmenizin performansına göz atın.</p>
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

        {/* Stats Grid */}
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
          {/* Main Chart Area (Visual Representation) */}
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

          {/* Popular Items */}
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

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feedbacks */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 mb-8">Son Geri Bildirimler</h3>
            <div className="space-y-6">
              {recentFeedbacks.map(f => (
                <div key={f.id} className="p-4 bg-slate-50 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-xs">
                        {f.user[0]}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{f.user}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{f.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium italic">"{f.comment}"</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={10} className={`${s <= f.score ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / System Info */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-black mb-2">Sistem Bilgisi</h3>
              <p className="text-white/50 text-xs font-medium mb-8">Lisans: Premium Digital QR (Ömür Boyu)</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-xs font-bold text-white/70">Sunucu Durumu</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase">Aktif</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-xs font-bold text-white/70">Yedekleme</span>
                  <span className="text-[10px] font-black uppercase text-white/40">2 saat önce</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-xs font-bold text-white/70">QR Okuma Toplam</span>
                  <span className="text-[10px] font-black uppercase">12,402</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] mt-8 text-center">
              Qresta Digital Solutions
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
