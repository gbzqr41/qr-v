
import React, { useEffect } from 'react';
import { X, Clock, Flame } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  // Açıldığında arka planı kilitle
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-white overflow-y-auto">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="fixed top-6 left-6 z-[80] p-3 bg-black/10 backdrop-blur-xl hover:bg-black/20 rounded-full text-white transition-all shadow-xl"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Scrollable Content */}
      <div className="w-full min-h-full bg-white flex flex-col">
        
        {/* Image Section */}
        <div className="relative w-full h-[45vh] bg-slate-100 shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="relative flex-1 bg-white rounded-t-[20px] -mt-5 z-10 px-6 py-8 md:px-12 lg:px-16">
          <div className="max-w-2xl mx-auto w-full">
            
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                {product.category}
              </span>
              {product.isPopular && (
                <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  Yıldız Ürün
                </span>
              )}
            </div>

            <h2 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
              {product.name}
            </h2>
            
            <p className="text-slate-500 text-lg mb-4 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Birim Fiyat</p>
              <p className="text-4xl font-black text-slate-900">{product.price} TL</p>
            </div>

            {/* Minimalist Info Grid */}
            <div className="flex items-center gap-8 mb-10 py-4 border-y border-slate-50">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-300" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Hazırlanış</p>
                  <p className="text-sm font-bold text-slate-700">15-20 dk</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Kalori</p>
                  <p className="text-sm font-bold text-slate-700">{product.calories} kcal</p>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="mb-8">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">İçindekiler</h4>
              <div className="flex flex-wrap gap-2.5">
                {product.ingredients.map((ing, idx) => (
                  <span key={idx} className="bg-slate-50 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Allergens Section */}
            <div className="mb-12 p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50">
              <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Alerjen Uyarıları</h4>
              <p className="text-xs text-rose-700 font-medium leading-relaxed">
                Gluten, Süt Ürünleri ve Yumurta içerebilir. Alerjiniz varsa lütfen personelimizi bilgilendiriniz.
              </p>
            </div>

            <div className="h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
