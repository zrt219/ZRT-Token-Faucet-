import React, { useState } from 'react';
import { 
  Award, 
  Share2, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Code2, 
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../services/audioService';

export default function LinkedInProofCard({ walletInfo }) {
  const [developerName, setDeveloperName] = useState('Alex Vance');
  const [roleTitle, setRoleTitle] = useState('Senior Web3 & XRPL Systems Engineer');
  const [copiedPost, setCopiedPost] = useState(false);
  const [cardTheme, setCardTheme] = useState('cyber-purple');

  const skills = [
    'XRPL Ledger v5',
    'XRPL EVM Sidechain (0x161c28)',
    'React 19 & Vite',
    'Tailwind CSS v4',
    'Solidity 0.8.24',
    'Foundry / Forge',
    'Automated Token Faucets',
    'MetaMask & Xaman Integration'
  ];

  const sampleLedgerHash = '0xaeef85d278a53eadf5bd23ea4c6ac428a194b3056a583233a425063f5e9c5cb9';
  const deployedContractAddr = '0xA57BE310E3f2eC228600A7A309A16aDb569fAD28';

  const linkedInPostText = `🚀 Excited to share my latest Web3 project: ZRT XRP Faucet & XRPL Tactical Mining Infrastructure!

🛠️ Tech Stack:
• Frontend: React 19, Vite, Tailwind CSS v4, HTML5 Canvas
• Blockchain: XRPL Ledger (xrpl.js v5) & XRPL EVM Sidechain Testnet
• Smart Contracts: Solidity 0.8.24, Foundry/Forge

⚡ Key Architectural Features:
✅ Native XRPL Drops & Issued Currency (ZRT) Token Faucet
✅ MetaMask Web3 Provider integration (Chain ID 0x161c28)
✅ Deployed & Verified EVM Smart Contracts (ISRNetwork, CohrLab, DarkMatterFarm)
✅ Live Canvas Transaction Vector Stream & Ledger Ticker

🔗 Verified Live Deployment: https://zrt-xrp-faucet.vercel.app
📂 GitHub Repository: https://github.com/zrt219/ZRT-Token-Faucet-

#Web3 #XRPL #Solidity #ReactJS #BlockchainEngineering #BuildInPublic #SoftwareEngineering`;

  const handleCopyPost = () => {
    soundEffects.playClick(1000);
    navigator.clipboard.writeText(linkedInPostText);
    setCopiedPost(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });
    setTimeout(() => setCopiedPost(false), 2500);
  };

  const handleShareLinkedIn = () => {
    soundEffects.playClick(1100);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://zrt-xrp-faucet.vercel.app')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="glass-panel p-4 mb-4 font-hud border-purple-500/30">
      <div className="flex items-center justify-between border-b border-purple-500/30 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400 animate-pulse" />
          <h2 className="text-base font-bold font-heading text-white tracking-wider">
            LINKEDIN PROOF-OF-BUILD CERTIFICATE & RECRUITER CARD GENERATOR
          </h2>
        </div>
        <span className="text-xs text-purple-400 bg-purple-950/60 border border-purple-500/40 px-2 py-0.5 rounded font-bold">
          RECRUITER READY
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Inputs */}
        <div className="lg:col-span-4 space-y-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">DEVELOPER NAME / HANDLE:</label>
            <input
              type="text"
              value={developerName}
              onChange={(e) => setDeveloperName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">ROLE / TITLE:</label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">CARD COLOR THEME:</label>
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
              {['cyber-purple', 'emerald-green', 'cyan-neon'].map(theme => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setCardTheme(theme)}
                  className={`p-1.5 rounded border text-center font-bold cursor-pointer capitalize ${
                    cardTheme === theme
                      ? 'bg-purple-950 border-purple-500 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {theme.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={handleShareLinkedIn}
              className="tactical-btn w-full justify-center py-2.5 bg-blue-950/60 border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> SHARE ON LINKEDIN
            </button>

            <button
              onClick={handleCopyPost}
              className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
            >
              {copiedPost ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedPost ? 'POST COPY COPIED TO CLIPBOARD!' : 'COPY LINKEDIN POST TEMPLATE'}
            </button>
          </div>
        </div>

        {/* Right Preview Card */}
        <div className="lg:col-span-8">
          <div className={`glass-panel p-5 relative overflow-hidden rounded-xl border transition-all ${
            cardTheme === 'emerald-green' ? 'border-emerald-500/40 bg-emerald-950/20' :
            cardTheme === 'cyan-neon' ? 'border-cyan-500/40 bg-cyan-950/20' :
            'border-purple-500/40 bg-purple-950/20'
          }`}>
            {/* Background Holographic Lines */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Cpu className="w-48 h-48 text-purple-400" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-purple-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest block">VERIFIED WEB3 PROOF OF BUILD</span>
                    <h3 className="text-lg font-bold text-white font-heading tracking-wide">{developerName}</h3>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[9px] text-slate-400 block">XRPL & EVM COMPLIANT</span>
                  <span className="text-xs font-bold text-emerald-400">PASSED VERIFICATION</span>
                </div>
              </div>

              <div className="text-xs text-purple-300 font-bold font-mono">
                {roleTitle.toUpperCase()}
              </div>

              {/* Skills Tags */}
              <div>
                <span className="text-[10px] text-slate-400 font-mono block mb-1.5">VERIFIED SKILL STACK:</span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Provenance Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950/80 p-2.5 rounded border border-slate-850">
                <div>
                  <span className="text-slate-500 block">EVM CONTRACT ADDRESS:</span>
                  <span className="text-cyan-400 truncate block font-bold">{deployedContractAddr}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">LATEST LEDGER HASH:</span>
                  <span className="text-purple-400 truncate block font-bold">{sampleLedgerHash}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
                <span>PROJECT: ZRT XRP FAUCET</span>
                <span>DEPLOYED VIA FOUNDRY & VITE</span>
                <a 
                  href="https://github.com/zrt219/ZRT-Token-Faucet-" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                >
                  GITHUB REPO <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
