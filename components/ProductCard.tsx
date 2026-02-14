
import React from 'react';
import { Clock, Flame, Zap } from 'lucide-react';
import { Product } from '../types.ts';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAdd: (product: Product) => void;
  cardSettings?: {
    priceColor: string;
    titleColor: string;
    descColor: string;
    infoIconColor: string;
    infoTextColor: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onSelect, 
  onAdd,
  cardSettings = {
    priceColor: '#0f172a',
    titleColor: '#1e293b',
    descColor: '#64748b',
    infoIconColor: '#cbd5e1',
    infoTextColor: '#94a3b8'
  }
}) => {
  return (
    <div 
      className={`group rounded-3xl overflow-hidden border border-slate-100 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full var-shadow`}
      style={{ backgroundColor: 'var(--card-bg, #ffffff)' }}
    >
      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        {/* Image Container */}
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {product.isPopular && (
          <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 shadow-lg">
            <Zap className="w-3 h-3 fill-amber-900" /> Popüler
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-col mb-2">
          <h3 
            className="font-bold text-base leading-snug transition-colors mb-1"
            style={{ color: cardSettings.titleColor }}
          >
            {product.name}
          </h3>
          <span 
            className="font-extrabold text-lg"
            style={{ color: cardSettings.priceColor }}
          >
            {product.price} TL
          </span>
        </div>
        
        <p 
          className="text-xs line-clamp-2 mb-4 flex-1"
          style={{ color: cardSettings.descColor }}
        >
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock size={12} style={{ color: cardSettings.infoIconColor }} />
              <span 
                className="text-[10px] font-medium"
                style={{ color: cardSettings.infoTextColor }}
              >
                15-20 dk
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Flame size={12} style={{ color: cardSettings.infoIconColor }} />
              <span 
                className="text-[10px] font-medium"
                style={{ color: cardSettings.infoTextColor }}
              >
                {product.calories} kcal
              </span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .var-shadow {
          box-shadow: var(--card-shadow-value, 0 1px 2px 0 rgb(0 0 0 / 0.05));
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
