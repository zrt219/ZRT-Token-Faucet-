import React from 'react';

export default function Header() {
  return (
    <header className="flex items-center justify-between w-full max-w-6xl mx-auto py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        {/* Geometric logo icon */}
        <div className="flex flex-col gap-0.5 justify-center">
          <div className="flex gap-0.5">
            <div className="w-2.5 h-2.5 bg-white rotate-45 transform origin-center"></div>
            <div className="w-2.5 h-2.5 bg-white/40 rotate-45 transform origin-center"></div>
          </div>
          <div className="flex gap-0.5 -mt-1 ml-1.5">
            <div className="w-2.5 h-2.5 bg-white/40 rotate-45 transform origin-center"></div>
            <div className="w-2.5 h-2.5 bg-white rotate-45 transform origin-center"></div>
          </div>
        </div>
        
        <div className="leading-tight ml-2">
          <span className="text-white font-bold tracking-wider text-sm block">XRPL EVM</span>
          <span className="text-slate-400 text-[10px] tracking-widest block font-medium">SIDECHAIN</span>
        </div>
      </div>

      {/* Systems Status */}
      <div className="flex items-center gap-2 text-[11px] font-sans">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-emerald-400 font-medium">All systems operational</span>
        <span className="text-slate-600 font-medium ml-1">v2.4</span>
      </div>
    </header>
  );
}
