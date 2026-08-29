import React from 'react';

interface BrandLogoProps {
  logoUrl?: string;
  storeName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  logoUrl,
  storeName = 'SAT LOJA',
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-8 text-lg',
    md: 'h-10 text-xl',
    lg: 'h-14 text-2xl',
    xl: 'h-20 text-3xl',
  };

  const imgHeightClass = {
    sm: 'max-h-8',
    md: 'max-h-10',
    lg: 'max-h-14',
    xl: 'max-h-20',
  };

  if (logoUrl && logoUrl.trim().length > 0) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <img
          src={logoUrl}
          alt={storeName}
          className={`${imgHeightClass[size]} w-auto object-contain drop-shadow-md`}
          referrerPolicy="no-referrer"
        />
        {showText && (
          <span className="font-extrabold tracking-wider bg-gradient-to-r from-white via-zinc-200 to-amber-400 bg-clip-text text-transparent hidden sm:inline-block">
            {storeName}
          </span>
        )}
      </div>
    );
  }

  // Default Vector SAT LOJA Logo based on official brand design
  return (
    <div className={`flex items-center gap-3 select-none cursor-pointer group ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Modern Vector SAT LOJA Emblem */}
        <svg
          viewBox="0 0 160 90"
          className={`${imgHeightClass[size]} w-auto transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_12px_rgba(234,179,8,0.25)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic Silver Gradient */}
            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#d4d4d8" />
              <stop offset="70%" stopColor="#71717a" />
              <stop offset="100%" stopColor="#e4e4e7" />
            </linearGradient>

            {/* Vibrant Gold Metallic Gradient */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#eab308" />
              <stop offset="70%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>

            {/* Subtle Metallic Shadow */}
            <filter id="metalShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Letter 'S' - Metallic Silver 3D Effect */}
          <path
            d="M 16 28 C 16 16, 32 16, 44 16 L 46 25 C 36 25, 27 25, 27 30 C 27 35, 46 36, 46 48 C 46 62, 28 62, 14 62 L 12 53 C 24 53, 35 53, 35 47 C 35 42, 16 41, 16 28 Z"
            fill="url(#silverGrad)"
            filter="url(#metalShadow)"
          />

          {/* Letter 'A' - Bold Vibrant Gold with Tech Notch */}
          <path
            d="M 52 62 L 67 16 L 82 62 L 71 62 L 67 48 L 59 48 L 57 55 L 67 55 L 69 62 Z"
            fill="url(#goldGrad)"
            filter="url(#metalShadow)"
          />

          {/* Letter 'T' - Metallic Silver */}
          <path
            d="M 82 16 L 114 16 L 114 26 L 103 26 L 103 62 L 93 62 L 93 26 L 82 26 Z"
            fill="url(#silverGrad)"
            filter="url(#metalShadow)"
          />

          {/* Golden Orbit Ring wrapping around SAT */}
          <path
            d="M 5 52 C 2 64, 45 74, 95 68 C 125 64, 148 54, 146 44 C 145 40, 137 39, 128 40 C 138 46, 118 55, 80 58 C 38 61, 12 55, 5 52 Z"
            fill="url(#goldGrad)"
          />

          {/* Golden Orb / Sphere on Orbit */}
          <circle cx="132" cy="40" r="5" fill="url(#goldGrad)" filter="url(#metalShadow)" />

          {/* Word 'LOJA' below */}
          <text
            x="80"
            y="84"
            textAnchor="middle"
            fontFamily="'Outfit', sans-serif"
            fontWeight="900"
            fontSize="15"
            letterSpacing="8"
            fill="url(#silverGrad)"
          >
            LOJA
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-black tracking-tight text-white font-['Outfit'] text-lg sm:text-xl">
              SAT
            </span>
            <span className="font-bold text-amber-400 font-['Outfit'] text-lg sm:text-xl tracking-wider">
              LOJA
            </span>
          </div>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400 -mt-1 hidden md:block">
            Tecnologia & Inovação
          </span>
        </div>
      )}
    </div>
  );
};
