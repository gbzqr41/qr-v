
import React, { useEffect, useState } from 'react';
import { X, Wifi, Clock, MapPin, Phone, Instagram, Copy, Check } from 'lucide-react';

interface BusinessInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  profile?: {
    description: string;
    phone: string;
    address: string;
    wifiPassword: string;
    instagramUsername: string;
    coverImageUrl: string;
  };
}

const BusinessInfoModal: React.FC<BusinessInfoModalProps> = ({ isOpen, onClose, restaurantName, profile }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCopyWifi = () => {
    if (profile?.wifiPassword) {
      navigator.clipboard.writeText(profile.wifiPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col animate-fade-in overflow-y-auto">
      <div className="relative w-full h-[35vh] bg-slate-100 shrink-0">
        <img 
          src={profile?.coverImageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200"} 
          alt="Business Cover" 
          className="w-full h-full object-cover"
        />
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-3 bg-black/20 backdrop-blur-xl hover:bg-black/30 rounded-full text-white transition-all shadow-xl z-20"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative flex-1 bg-white rounded-t-[32px] -mt-8 z-10 pb-20">
        <div className="max-w-2xl mx-auto w-full px-6 py-10 space-y-10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
              <span className="text-3xl font-black text-white">{restaurantName.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{restaurantName}</h1>
              <p className="text-slate-500 font-medium">{profile?.description || 'Modern Gastronomi Deneyimi'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* WiFi Bilgisi */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Wifi className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WIFI BİLGİLERİ</p>
                  <p className="text-xs font-bold text-slate-800">Şifre: {profile?.wifiPassword || 'resital2024'}</p>
                </div>
              </div>
              <button onClick={handleCopyWifi} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Kopyalandı' : 'Kopyala'}
              </button>
            </div>

            {/* Sosyal Medya ve İletişim */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile?.phone && (
                <a href={`tel:${profile.phone}`} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-center gap-4 hover:bg-slate-100 transition-colors">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TELEFON</p>
                    <p className="text-xs font-bold text-slate-800">{profile.phone}</p>
                  </div>
                </a>
              )}
              {profile?.instagramUsername && (
                <a href={`https://instagram.com/${profile.instagramUsername}`} target="_blank" rel="noopener noreferrer" className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-center gap-4 hover:bg-slate-100 transition-colors">
                  <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center shrink-0">
                    <Instagram className="w-6 h-6 text-rose-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">INSTAGRAM</p>
                    <p className="text-xs font-bold text-slate-800">@{profile.instagramUsername}</p>
                  </div>
                </a>
              )}
            </div>

            {/* Adres */}
            {profile?.address && (
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ADRES</p>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed">{profile.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default BusinessInfoModal;
