
import React, { useState, useEffect } from 'react';
import { X, Star, Send, User, Phone, CheckCircle2 } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, primaryColor }) => {
  const [ratings, setRatings] = useState({ food: 0, service: 0, ambiance: 0 });
  const [hovers, setHovers] = useState({ food: 0, service: 0, ambiance: 0 });
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSubmitted(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const RatingRow = ({ label, category }: { label: string, category: keyof typeof ratings }) => (
    <div className="w-full mb-10">
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <span className="text-[10px] font-bold text-amber-500 uppercase">{ratings[category] > 0 ? `${ratings[category]}/5` : ''}</span>
      </div>
      <div className="flex gap-3 justify-between">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHovers(prev => ({ ...prev, [category]: star }))}
            onMouseLeave={() => setHovers(prev => ({ ...prev, [category]: 0 }))}
            onClick={() => setRatings(prev => ({ ...prev, [category]: star }))}
            className="flex-1 py-3 bg-slate-50 rounded-2xl flex justify-center transition-transform active:scale-95 border border-slate-100/50"
          >
            <Star 
              className={`w-6 h-6 transition-colors ${
                (hovers[category] || ratings[category]) >= star ? 'text-amber-500 fill-amber-500' : 'text-slate-200'
              }`} 
            />
          </button>
        ))}
      </div>
    </div>
  );

  const canSubmit = ratings.food > 0 && ratings.service > 0 && ratings.ambiance > 0;

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in">
      <div className="h-[60px] px-4 flex items-center justify-between border-b border-slate-100 shrink-0">
        <h2 className="text-lg font-bold text-slate-900 pl-2">Geri Bildirim</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-50 rounded-full transition-colors border border-slate-200"
        >
          <X className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center max-w-lg mx-auto w-full">
        {isSubmitted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-scale-in py-20">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Teşekkür Ederiz!</h2>
            <p className="text-slate-500 leading-relaxed mb-10 max-w-xs">
              Geri bildiriminiz başarıyla iletildi. Görüşleriniz bizim için çok değerli.
            </p>
            <button 
              onClick={onClose}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl shadow-slate-200 active:scale-95 transition-all"
            >
              Kapat
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 text-center mb-2">Deneyiminizi Paylaşın</h1>
            <p className="text-slate-500 text-center mb-12 leading-relaxed px-4">
              Size daha iyi hizmet verebilmemiz için görüşleriniz bizim için çok değerli.
            </p>

            <div className="w-full mb-12">
              <RatingRow label="Yemek Lezzeti" category="food" />
              <RatingRow label="Servis Kalitesi" category="service" />
              <RatingRow label="Ambiyans & Atmosfer" category="ambiance" />
            </div>

            <div className="w-full space-y-10 mb-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center">
                  * <span className="inline-block w-3"></span> Ad Soyad (Opsiyonel)
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="İsim belirtmek isterseniz..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 text-base focus:ring-2 focus:ring-slate-900/5 outline-none no-zoom"
                  />
                </div>
              </div>
            </div>

            <div className="w-full space-y-4 mb-12">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ek Notlarınız</label>
              <textarea
                placeholder="Yemeğimiz, servisimiz veya atmosferimiz hakkında eklemek istediğiniz bir şey var mı?"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-base focus:ring-2 focus:ring-slate-900/5 outline-none resize-none no-zoom"
              />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl
                ${canSubmit 
                  ? 'text-white shadow-slate-200 hover:opacity-90' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'}
              `}
              style={canSubmit ? { backgroundColor: primaryColor } : {}}
            >
              <Send className="w-5 h-5" /> Gönder
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .no-zoom { font-size: 16px !important; }
      `}</style>
    </div>
  );
};

export default FeedbackModal;
