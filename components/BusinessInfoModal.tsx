
import React, { useEffect, useState } from 'react';
import { X, Wifi, Car, Baby, Clock, MapPin, Phone, Instagram, Copy, Check, MessageCircle } from 'lucide-react';

interface BusinessInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BusinessInfoModal: React.FC<BusinessInfoModalProps> = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
    // Sadece şifreyi kopyalar
    navigator.clipboard.writeText('resital2024');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const galleryImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600"
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col animate-fade-in overflow-y-auto">
      {/* Product Detail Style Header */}
      <div className="relative w-full h-[35vh] bg-slate-100 shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200" 
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

      {/* Content Section with Rounded Top */}
      <div className="relative flex-1 bg-white rounded-t-[32px] -mt-8 z-10">
        <div className="max-w-2xl mx-auto w-full px-6 py-10 space-y-10">
          
          {/* Brand Section */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
              <span className="text-3xl font-black text-white">R</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Resital Lounge</h1>
              <p className="text-slate-500 font-medium">Modern Gastronomi Deneyimi</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* WiFi Details with Copy */}
            <div className="col-span-2 bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Wifi className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WIFI BİLGİLERİ</p>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">
                      <span className="text-slate-400 font-medium mr-1">Ağ:</span> Resital_Guest
                    </p>
                    <p className="text-xs font-bold text-slate-800">
                      <span className="text-slate-400 font-medium mr-1">Şifre:</span> resital2024
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleCopyWifi}
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-[10px] font-black text-slate-900 uppercase shadow-sm active:scale-95 transition-all"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Kopyalandı' : 'Şifreyi Kopyala'}
              </button>
            </div>

            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OTOPARK</p>
                <p className="font-bold text-slate-800">Ücretsiz Mevcut</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Baby className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ÇOCUK ALANI</p>
                <p className="font-bold text-slate-800">Oyun Odası Var</p>
              </div>
            </div>

            <div className="col-span-2 bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ÇALIŞMA SAATLERİ</p>
                  <p className="font-bold text-slate-800">Hergün 09:00 - 00:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">İLETİŞİM & KONUM</h3>
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-50 shadow-sm">
              <div className="p-5 flex items-start gap-4">
                <MapPin className="w-6 h-6 text-slate-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Adres</p>
                  <p className="text-sm text-slate-500 leading-relaxed">Bebek, Cevdet Paşa Cd. No:34, Beşiktaş/İstanbul</p>
                </div>
              </div>
              <div className="p-5 flex items-center gap-4">
                <Phone className="w-6 h-6 text-slate-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Telefon</p>
                  <p className="text-sm text-slate-500">+90 (212) 555 00 00</p>
                </div>
              </div>
              <div className="p-5 flex items-center gap-4">
                <MessageCircle className="w-6 h-6 text-slate-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">WhatsApp</p>
                  <p className="text-sm text-slate-500">+90 (555) 000 00 00</p>
                </div>
              </div>
              <div className="p-5 flex items-center gap-4">
                <Instagram className="w-6 h-6 text-slate-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Instagram</p>
                  <p className="text-sm text-slate-500">@resitallounge</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="space-y-4 pb-12">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">GALERİ</h3>
            <div className="grid grid-cols-2 gap-3">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(img)}
                  className="aspect-square rounded-2xl overflow-hidden bg-slate-100 active:scale-95 transition-transform"
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image View */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full">
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="Gallery Fullscreen" 
            className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain animate-scale-in"
          />
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default BusinessInfoModal;
