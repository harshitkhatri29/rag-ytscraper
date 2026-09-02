import React from 'react';

interface NavbarProps {
  onHomeClick: () => void;
  onAskClick: () => void;
}

export default function Navbar({ onHomeClick, onAskClick }: NavbarProps) {
  return (
    <header className="relative z-10 w-full">
      <nav className="flex flex-row items-center justify-between px-6 sm:px-8 py-6 max-w-7xl mx-auto">
        {/* Brand Logo - LectureLens in Instrument Serif without ® */}
        <button 
          onClick={onHomeClick}
          className="flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer text-left focus:outline-none group"
        >
          <span 
            className="text-3xl sm:text-4xl tracking-tight text-foreground font-normal group-hover:text-white/90 transition-colors"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            LectureLens
          </span>
        </button>

        {/* Navigation Links - Home and Ask */}
        <div className="hidden md:flex items-center gap-8 font-sans">
          <button 
            onClick={onHomeClick}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={onAskClick}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            Ask
          </button>
        </div>

        {/* CTA Button */}
        <button
          onClick={onAskClick}
          className="liquid-glass rounded-full px-6 py-2.5 text-sm font-medium text-foreground hover:scale-[1.03] transition-all cursor-pointer font-sans"
        >
          Ask a Question
        </button>
      </nav>
    </header>
  );
}
