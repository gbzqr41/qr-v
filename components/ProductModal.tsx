
import React, { useEffect } from 'react';
import { X, Clock, Flame } from 'lucide-react';
import { Product } from '../types.ts';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product) => void;
  modalSettings?: {
    bgColor: string;
    catTextColor: string;
    catBgColor: string;
    titleColor: string;
    priceColor: string;
    descColor: string;
    unitPriceTitleColor: string;
    prepIconColor: string;
    prepTextColor: string;
    calIconColor: string;
    calTextColor: string;
    ingTitleColor: string;
    ingTagBgColor: string;
    ingTagTextColor: string;
    allergenBgColor: string;
    allergenBorderColor: string;
    allergenBorderWidth: string;
    allergenShadow: string;
    allergenTitleColor: string;
    allergenDescColor: string;
  };
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  onClose,
  modalSettings = {
    bgColor: '#ffffff',
    catTextColor: '#64748b',
    catBgColor: '#f1f5f9',
    titleColor: '#0f172a',
    priceColor: '#0f172a',
    descColor: '#64748b',
    unitPriceTitleColor: '#94a3b8',
    prepIconColor: '#cbd5e1',
    prepTextColor: '#334155',
    calIconColor: '#f97316',
    calTextColor: '#334155',
    ingTitleColor: '#94a3b8',
    ingTagBgColor: '#f8fafc',
    ingTagTextColor: '#475569',
    allergenBgColor: '#fff1f2',
    allergenBorderColor: '#ffe4e6',
    allergenBorderWidth: '1px',
    allergenShadow: 'shadow-none',
    allergenTitleColor: '#e11d48',
    allergenDescColor: '#9f1239'
  }
}) => {
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
    <div className="fixed inset-0 z-[70] bg-white overflow-y-auto" style={{ backgroundColor: modalSettings.bgColor }}>
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="fixed top-6 left-6 z-[80] p-3 bg-black/10 backdrop-blur-xl hover:bg-black/20 rounded-full text-white transition-all shadow-xl"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Scrollable Content */}
      <div className="w-full min-h-full flex flex-col" style={{ backgroundColor: modalSettings.bgColor }}>
        
        {/* Image Section */}
        <div className="relative w-full h-[45vh] bg-slate-100 shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="relative flex-1 rounded-t-[20px] -mt-5 z-10 px-6 py-8 md:px-12 lg:px-16" style={{ backgroundColor: modalSettings.bgColor }}>
          <div className="max-w-2xl mx-auto w-full">
            
            <div className="flex items-center gap-2 mb-4">
              <span 
                className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: modalSettings.catBgColor, color: modalSettings.catTextColor }}
              >
                {product.category}
              </span>
              {product.isPopular && (
                <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  Yıldız Ürün
                </span>
              )}
            </div>

            <h2 className="text-4xl font-black mb-4 leading-tight" style={{ color: modalSettings.titleColor }}>
              {product.name}
            </h2>
            
            <p className="text-lg mb-4 leading-relaxed" style={{ color: modalSettings.descColor }}>
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: modalSettings.unitPriceTitleColor }}>Birim Fiyat</p>
              <p className="text-4xl font-black" style={{ color: modalSettings.priceColor }}>{product.price} TL</p>
            </div>

            {/* Minimalist Info Grid */}
            <div className="flex items-center gap-8 mb-10 py-4 border-y border-slate-50">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: modalSettings.prepIconColor }} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tight" style={{ color: modalSettings.unitPriceTitleColor }}>Hazırlanış</p>
                  <p className="text-sm font-bold" style={{ color: modalSettings.prepTextColor }}>15-20 dk</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5" style={{ color: modalSettings.calIconColor }} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tight" style={{ color: modalSettings.unitPriceTitleColor }}>Kalori</p>
                  <p className="text-sm font-bold" style={{ color: modalSettings.calTextColor }}>{product.calories} kcal</p>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="mb-8">
              <h4 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: modalSettings.ingTitleColor }}>İçindekiler</h4>
              <div className="flex flex-wrap gap-2.5">
                {product.ingredients.map((ing, idx) => (
                  <span 
                    key={idx} 
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                    style={{ backgroundColor: modalSettings.ingTagBgColor, color: modalSettings.ingTagTextColor }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Allergens Section */}
            <div 
              className={`mb-12 p-4 rounded-2xl transition-all ${modalSettings.allergenShadow}`}
              style={{ 
                backgroundColor: modalSettings.allergenBgColor,
                borderColor: modalSettings.allergenBorderColor,
                borderWidth: modalSettings.allergenBorderWidth,
                borderStyle: 'solid'
              }}
            >
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: modalSettings.allergenTitleColor }}>Alerjen Uyarıları</h4>
              <p className="text-xs font-medium leading-relaxed" style={{ color: modalSettings.allergenDescColor }}>
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
