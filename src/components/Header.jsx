import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Cpu, 
  Wallet, 
  Activity, 
  Zap, 
  Box, 
  CheckCircle2,
  Coins
} from 'lucide-react';
import { faucetService } from '../services/faucetService';
import { soundEffects } from '../services/audioService';

export default function Header() {
  const [ledgerIndex, setLedgerIndex] = useState(faucetService.ledgerIndex || 98410244);
  const [balances, setBalances] = useState(faucetService.balances);

  useEffect(() => {
    faucetService.setupFaucetAccounts();
  }, []);

  return (
    <header className="glass-panel p-4 mb-6 border-b border-cyan-500/40 font-hud">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-purple-950/80 border border-purple-500/50 box-glow-purple">
            <Coins className="w-6 h-6 text-purple-400 animate-pulse" />
            <div className="absolute inset-0 rounded-lg border border-purple-400/30 animate-radar" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold tracking-wider font-heading text-white">
                ZRT XRP <span className="text-cyan-400">FAUCET & TACTICAL DISPENSER</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-hud rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-bold">
                XRPL TESTNET & EVM CONNECTED
              </span>
            </div>
            <p className="text-xs font-hud text-slate-400 flex items-center gap-2 mt-0.5">
              <span>AUTOMATED XRPL DROPS & EVM SIDECHAIN PORTAL</span>
              <span className="text-cyan-500/60">•</span>
              <span>CHAIN OF CUSTODY PROVENANCE</span>
            </p>
          </div>
        </div>

        {/* XRPL Ledger & Network Node Status */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">XRPL WS NODE:</span>
            <span className="text-cyan-400 font-bold">rippletest.net</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div>
            <span className="text-slate-400">LEDGER:</span>{' '}
            <span className="text-purple-400 font-bold">#{ledgerIndex}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div>
            <span className="text-slate-400">CHAIN ID:</span>{' '}
            <span className="text-emerald-400 font-bold">0x161c28</span>
          </div>
        </div>

      </div>
    </header>
  );
}
