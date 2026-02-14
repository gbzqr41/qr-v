
import React, { useEffect, useState } from 'react';
import { X, Wifi, Car, Baby, Clock, MapPin, Phone, Instagram, Copy, Check, MessageCircle } from 'lucide-react';

interface BusinessInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
}

const BusinessInfoModal: React.FC<BusinessInfoModalProps> = ({ isOpen, onClose, restaurantName }) => {
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

      <div className="relative flex-1 bg-white rounded-t-[32px] -mt-8 z-10">
        <div className="max-w-2xl mx-auto w-full px-6 py-10 space-y-10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
              <span className="text-3xl font-black text-white">{restaurantName.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{restaurantName}</h1>
              <p className="text-slate-500 font-medium">Modern Gastronomi Deneyimi</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Wifi className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WIFI BİLGİLERİ</p>
                  <p className="text-xs font-bold text-slate-800">Şifre: resital2024</p>
                </div>
              </div>
              <button onClick={handleCopyWifi} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase">
                {copied ? 'Kopyalandı' : 'Kopyala'}
              </button>
            </div>
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
