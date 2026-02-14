
import React from 'react';
import { Info, Star } from 'lucide-react';

interface NavbarProps {
  onFeedbackClick: () => void;
  onInfoClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onFeedbackClick, onInfoClick }) => {
  return (
    <nav className="h-[60px] bg-white px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-[10px]">
        <button 
          onClick={onInfoClick}
          className="w-[42px] h-[42px] bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <Info size={22} className="text-slate-600" />
        </button>
        <span className="text-lg font-bold text-slate-900">
          Resital Lounge
        </span>
      </div>

      <div className="flex items-center">
        <button 
          onClick={onFeedbackClick}
          className="w-[42px] h-[42px] bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <Star size={22} className="text-slate-600" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
