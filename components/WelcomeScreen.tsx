
import React from 'react';
import { ChevronRight, Globe } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  config?: {
    logo?: string;
    title: string;
    subtitle: string;
    bgType: string;
    bgUrl: string;
  };
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStart, 
  // Added logo: '' to the default config to ensure TypeScript recognizes the property
  config = {
    logo: '',
    title: 'Resital Lounge',
    subtitle: 'Gastronomi Sanatıyla Tanışın',
    bgType: 'image',
    bgUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=60&w=800'
  }
}) => {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-slate-900">
        {config.bgType === 'video' ? (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover opacity-60"
          >
            <source src={config.bgUrl} type="video/mp4" />
          </video>
        ) : (
          <img 
            src={config.bgUrl} 
            alt="Welcome Background" 
            className="w-full h-full object-cover opacity-60"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-between px-8 py-16 text-center">
        {/* Top: Language Selection */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          <Globe className="w-4 h-4 text-white/70" />
          <button className="text-sm font-bold text-white">TR</button>
          <div className="w-px h-3 bg-white/20" />
          <button className="text-sm font-medium text-white/50 hover:text-white transition-colors">EN</button>
        </div>

        {/* Middle: Brand Logo & Title */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-white/10 overflow-hidden">
            {/* config.logo is now properly typed due to the default value fix above */}
            {config.logo ? (
              <img src={config.logo} className="w-full h-full object-contain p-2" alt="Logo" />
            ) : (
              <span className="text-4xl font-black text-slate-900">{config.title.charAt(0)}</span>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tight">{config.title}</h1>
            <p className="text-slate-300 font-medium">{config.subtitle}</p>
          </div>
        </div>

        {/* Bottom: Action Button */}
        <div className="w-full max-w-xs space-y-6">
          <button 
            onClick={onStart}
            className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all group"
          >
            Menüye Git
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
            Qresta Premium Experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
