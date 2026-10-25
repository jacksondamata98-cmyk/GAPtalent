import React from 'react';

interface TalentIconProps {
  className?: string;
  size?: number;
  filled?: boolean;
}

export const TalentIcon: React.FC<TalentIconProps> = ({
  className = '',
  size = 22,
  filled = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform duration-200 ${filled ? 'scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : ''} ${className}`}
    >
      <defs>
        <linearGradient id="talentGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id="talentStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Laurel Wreath Left */}
      <path
        d="M18 42C14 36 14 26 18 19M16 28C11 27 8 22 10 17C12 17 15 20 16 23M18 36C12 36 10 32 11 27C13 28 16 30 17 33M20 44C15 45 13 42 14 37C16 38 18 40 19 42"
        stroke={filled ? 'url(#talentGoldGrad)' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Laurel Wreath Right */}
      <path
        d="M46 42C50 36 50 26 46 19M48 28C53 27 56 22 54 17C52 17 49 20 48 23M46 36C52 36 54 32 53 27C51 28 48 30 47 33M44 44C49 45 51 42 50 37C48 38 46 40 45 42"
        stroke={filled ? 'url(#talentGoldGrad)' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Central Star with sparkling talent core */}
      <path
        d="M32 14L35.6 23.2L45 23.8L37.8 29.8L40.2 39.2L32 34.2L23.8 39.2L26.2 29.8L19 23.8L28.4 23.2L32 14Z"
        fill={filled ? 'url(#talentGoldGrad)' : 'transparent'}
        stroke={filled ? 'url(#talentStrokeGrad)' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Central Talent Sparkle when filled */}
      {filled && (
        <circle cx="32" cy="27" r="2.5" fill="#FFF" className="animate-pulse" />
      )}

      {/* Bottom ribbon/podium base */}
      <path
        d="M26 47C29 49 35 49 38 47L40 52C35 54 29 54 24 52L26 47Z"
        fill={filled ? 'url(#talentGoldGrad)' : 'none'}
        stroke={filled ? 'url(#talentStrokeGrad)' : 'currentColor'}
        strokeWidth="2"
      />
    </svg>
  );
};
