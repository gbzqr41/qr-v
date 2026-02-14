
import React from 'react';
import { Clock, Flame, Zap } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAdd }) => {
  return (
    <div 
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
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
          <h3 className="font-bold text-base text-slate-800 leading-snug group-hover:text-slate-900 transition-colors mb-1">
            {product.name}
          </h3>
          <span className="font-extrabold text-slate-900 text-lg">
            {product.price} TL
          </span>
        </div>
        
        <p className="text-slate-500 text-xs line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-slate-300" />
              <span className="text-[10px] font-medium text-slate-400">
                15-20 dk
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Flame size={12} className="text-orange-400" />
              <span className="text-[10px] font-medium text-slate-400">
                {product.calories} kcal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
