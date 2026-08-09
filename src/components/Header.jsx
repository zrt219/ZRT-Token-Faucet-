import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Cpu, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Wallet, 
  Activity, 
  Zap, 
  Box, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { xrplService } from '../services/xrplService';
import { soundEffects } from '../services/audioService';

export default function Header({ systemStatus, onToggleAudio, isAudioMuted, onGenerateWallet, walletInfo }) {
  const [ledgerIndex, setLedgerIndex] = useState(xrplService.currentLedgerIndex);
  const [ledgerHash, setLedgerHash] = useState(xrplService.ledgerHash);
  const [balances, setBalances] = useState(xrplService.balances);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  useEffect(() => {
    // Connect to XRPL service
    xrplService.connect();

    const unsubscribe = xrplService.subscribe((event) => {
      if (event.type === 'TICK') {
        setLedgerIndex(event.ledgerIndex);
        setLedgerHash(event.ledgerHash);
      }
      if (event.type === 'WALLET_UPDATED' || event.type === 'TX_SUBMITTED') {
        setBalances({ ...xrplService.balances });
      }
    });

    return unsubscribe;
  }, []);

  const handleWalletClick = async () => {
    soundEffects.playClick(1000);
    setIsConnectingWallet(true);
    await onGenerateWallet();
    setIsConnectingWallet(false);
  };

  return (
    <header className="glass-panel p-4 mb-4 border-b border-emerald-500/30">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-950/80 border border-emerald-500/50 box-glow-green">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            <div className="absolute inset-0 rounded-lg border border-emerald-400/30 animate-radar" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold tracking-wider font-heading text-white">
                URANIUM INTELLIGENCE <span className="text-emerald-400">ECOSYSTEM</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-hud rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                XRPL TESTNET CONNECTED
              </span>
            </div>
            <p className="text-xs font-hud text-slate-400 flex items-center gap-2 mt-0.5">
              <span>END-TO-END AUTONOMOUS ROBOTIC MINING</span>
              <span className="text-emerald-500/60">•</span>
              <span>CHAIN OF CUSTODY PROVENANCE</span>
            </p>
          </div>
        </div>

        {/* XRPL Ledger & Network Node Status */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800 font-hud text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">XRPL WS NODE:</span>
            <span className="text-cyan-400 font-bold">rippletest.net</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div>
            <span className="text-slate-400">LEDGER:</span>{' '}
            <span className="text-emerald-400 font-bold">#{ledgerIndex}</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="hidden sm:block text-slate-400">
            <span>HASH:</span> <span className="text-slate-300">{ledgerHash.substring(0, 10)}...</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Audio Toggle */}
          <button
            onClick={() => {
              soundEffects.playClick(600);
              onToggleAudio();
            }}
            className={`p-2.5 rounded-lg border transition-all ${
              isAudioMuted 
                ? 'border-slate-700 bg-slate-900/50 text-slate-500' 
                : 'border-emerald-500/50 bg-emerald-950/30 text-emerald-400 box-glow-green'
            }`}
            title={isAudioMuted ? "Unmute Tactical SFX" : "Mute SFX"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* XRPL Wallet Faucet Connect */}
          <button
            onClick={handleWalletClick}
            disabled={isConnectingWallet}
            className="tactical-btn-cyan flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            {isConnectingWallet ? (
              <span>REQUESTING FAUCET...</span>
            ) : walletInfo ? (
              <span>{walletInfo.address.substring(0, 6)}...{walletInfo.address.slice(-4)} ({balances.XRP} XRP)</span>
            ) : (
              <span>CONNECT XRPL FAUCET</span>
            )}
          </button>
        </div>

      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/80 font-hud text-xs">
        <div className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-emerald-400" />
            TOTAL U3O8 RESERVE:
          </span>
          <span className="text-emerald-400 font-bold text-sm">{balances.U3O8} KG</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            ENRICHED U-235:
          </span>
          <span className="text-cyan-400 font-bold text-sm">{balances.U235} KG</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            RADIATION LEVEL:
          </span>
          <span className={`font-bold text-sm ${
            systemStatus.avgRadiation > 15 ? 'text-rose-400 animate-pulse' : 'text-amber-400'
          }`}>
            {systemStatus.avgRadiation.toFixed(2)} µSv/h
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            ROBOTIC FLEET:
          </span>
          <span className="text-white font-bold text-sm">{systemStatus.activeRobots} ACTIVE UNITS</span>
        </div>
      </div>
    </header>
  );
}
