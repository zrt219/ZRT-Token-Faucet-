import { Disc, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full max-w-6xl mx-auto mt-24 border-t border-slate-900 pt-12 pb-16 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 text-xs">
        
        {/* Brand & Socials */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5 justify-center">
              <div className="flex gap-0.5">
                <div className="w-2.5 h-2.5 bg-white rotate-45"></div>
                <div className="w-2.5 h-2.5 bg-white/40 rotate-45"></div>
              </div>
              <div className="flex gap-0.5 -mt-1 ml-1.5">
                <div className="w-2.5 h-2.5 bg-white/40 rotate-45"></div>
                <div className="w-2.5 h-2.5 bg-white rotate-45"></div>
              </div>
            </div>
            <div className="leading-tight ml-2">
              <span className="text-white font-bold tracking-wider text-sm block">XRPL EVM</span>
              <span className="text-slate-400 text-[10px] tracking-widest block font-medium">SIDECHAIN</span>
            </div>
          </div>

          <div className="flex gap-2">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="https://discord.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
            >
              <Disc className="w-4 h-4" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Build Links */}
        <div className="space-y-3">
          <h4 className="text-slate-200 font-bold tracking-wider uppercase text-[10px]">Build</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-white flex items-center gap-1">Cross-Chain apps <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1">Docs <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1">API Docs <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
            <li><a href="#" className="hover:text-white">Github</a></li>
            <li><a href="#" className="hover:text-white">FAQs</a></li>
          </ul>
        </div>

        {/* Ecosystem Links */}
        <div className="space-y-3">
          <h4 className="text-slate-200 font-bold tracking-wider uppercase text-[10px]">Ecosystem</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-white flex items-center gap-1">Bridge <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1">Status <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1">EVM Explorer <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1">Cosmos Explorer <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1">Wallets <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1">All dApps <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
          </ul>
        </div>

        {/* Community Links */}
        <div className="space-y-3">
          <h4 className="text-slate-200 font-bold tracking-wider uppercase text-[10px]">Community</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-white flex items-center gap-1">Governance <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1">Grants <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
            <li><a href="#" className="hover:text-white">Events</a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1">Discord <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1">Twitter/X <ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
