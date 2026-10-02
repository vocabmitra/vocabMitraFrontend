import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

export interface LongCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  cardBgClass: string;
  shapeBgClass: string;
  buttonBgClass: string;
  iconBoxBgClass: string;
  onClick: () => void;
}

export function LongCard({
  icon,
  title,
  description,
  cardBgClass,
  shapeBgClass,
  buttonBgClass,
  iconBoxBgClass,
  onClick
}: LongCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 sm:p-6 rounded-[28px] flex flex-col h-[320px] cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md group ${cardBgClass} border border-black/5`}
    >
      {/* Bottom Left Diagonal Shape */}
      <div
        className={`absolute bottom-0 left-0 w-3/4 h-[100px] ${shapeBgClass}`}
        style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 100%)' }}
      />

      {/* Content Container (z-10 to stay above the shape) */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Large Puffy Icon Box */}
        <div className={`w-[100px] h-[100px] rounded-[24px] flex self-center items-center justify-center mb-2 shadow-[0_12px_24px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.8)] ${iconBoxBgClass}`}>
          {icon}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5 mt-2 pb-2">
          <h3 className="font-bricolage font-bold text-[26px] text-[#0f172a] leading-tight tracking-tight">
            {title}
          </h3>
          <p className="font-inter text-[15px] text-[#475569] leading-snug pr-4 font-medium">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom Right Button */}
      <div className={`absolute bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 z-10 shadow-sm ${buttonBgClass}`}>
        <ArrowRight size={22} className="text-[#0f172a] stroke-[2.5]" />
      </div>
    </div>
  );
}
