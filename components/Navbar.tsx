
import React from 'react';
import { Info, Star } from 'lucide-react';

interface NavbarProps {
  onFeedbackClick: () => void;
  onInfoClick: () => void;
  restaurantName: string;
  headerSettings?: {
    bg: string;
    text: string;
    iconBg: string;
    iconColor: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({ 
  onFeedbackClick, 
  onInfoClick, 
  restaurantName,
  headerSettings = {
    bg: '#ffffff',
    text: '#0f172a',
    iconBg: '#f1f5f9',
    iconColor: '#475569'
  }
}) => {
  return (
    <nav 
      className="h-[60px] px-4 md:px-8 flex items-center justify-between shadow-sm sticky top-0 z-50 transition-colors"
      style={{ backgroundColor: headerSettings.bg }}
    >
      <div className="flex items-center gap-[10px]">
        <button 
          onClick={onInfoClick}
          className="w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: headerSettings.iconBg }}
        >
          <Info size={22} style={{ color: headerSettings.iconColor }} />
        </button>
        <span 
          className="text-lg font-bold transition-colors"
          style={{ color: headerSettings.text }}
        >
          {restaurantName}
        </span>
      </div>

      <div className="flex items-center">
        <button 
          onClick={onFeedbackClick}
          className="w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: headerSettings.iconBg }}
        >
          <Star size={22} style={{ color: headerSettings.iconColor }} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
