import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ArrowUpRight, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Coins, 
  FileText, 
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { xrplService } from '../services/xrplService';
import { soundEffects } from '../services/audioService';

export default function XRPLPanel({ walletInfo, fleet }) {
  const [txHistory, setTxHistory] = useState([...xrplService.txHistory]);
  const [balances, setBalances] = useState({ ...xrplService.balances });
  const [selectedRover, setSelectedRover] = useState(fleet[0] ? fleet[0].id : 'ROVER-ALPHA');
  const [oreWeight, setOreWeight] = useState(250);
  const [orePurity, setOrePurity] = useState(0.85);
  const [isMinting, setIsMinting] = useState(false);
  const [copiedHash, setCopiedHash] = useState(null);

  useEffect(() => {
    const unsubscribe = xrplService.subscribe((event) => {
      if (event.type === 'TX_SUBMITTED' || event.type === 'WALLET_UPDATED') {
        setTxHistory([...xrplService.txHistory]);
        setBalances({ ...xrplService.balances });
      }
    });

    return unsubscribe;
  }, []);

  const handleManualMint = async (e) => {
    e.preventDefault();
    soundEffects.playClick(1000);
    setIsMinting(true);

    try {
      const activeUnit = fleet.find(u => u.id === selectedRover) || fleet[0];
      const newTx = await xrplService.tokenizeUraniumBatch({
        roverId: selectedRover,
        oreWeightKg: parseFloat(oreWeight),
        gradePurity: parseFloat(orePurity),
        radiationUSv: activeUnit ? activeUnit.radUSv : 12.4,
        coords: { lat: 34.521, lng: -115.892 },
        depositType: 'UNCONFORMITY_YELLOWCAKE'
      });

      // Confetti visual feedback
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ff9d', '#00e5ff', '#ffaa00']
      });

      soundEffects.playTxConfirmed();
    } catch (err) {
      console.error("Tokenization error:", err);
    } finally {
      setIsMinting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    soundEffects.playClick(1200);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 font-hud">
      
      {/* 1. Wallet & Token Balances */}
      <div className="glass-panel p-4 glass-panel-cyan flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-cyan-500/30 pb-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>XRPL TESTNET WALLET & ASSET POOL</span>
            </div>
            <span className="text-[10px] text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-2 py-0.5 rounded">
              XRPL LEDGER ASSETS
            </span>
          </div>

          {/* Account Address Box */}
          <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 mb-3">
            <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
              <span>ACTIVE TESTNET ADDRESS:</span>
              <span className="text-emerald-400 font-bold">CONNECTED</span>
            </div>
            <div className="flex items-center justify-between text-xs text-cyan-300 font-mono">
              <span className="truncate">
                {walletInfo ? walletInfo.address : "rUraniumRoboticNode77777777777"}
              </span>
              <button 
                onClick={() => copyToClipboard(walletInfo ? walletInfo.address : "rUraniumRoboticNode77777777777")}
                className="text-slate-400 hover:text-white ml-2"
                title="Copy Address"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">NATIVE XRP BALANCE</span>
              <span className="text-emerald-400 font-bold text-base">{balances.XRP} XRP</span>
            </div>

            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">ISSUED U3O8 ASSET</span>
              <span className="text-cyan-400 font-bold text-base">{balances.U3O8} KG</span>
            </div>

            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">ENRICHED U-235</span>
              <span className="text-amber-400 font-bold text-base">{balances.U235} KG</span>
            </div>

            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">PROVENANCE NFTS</span>
              <span className="text-purple-400 font-bold text-base">{balances.NFTs} ISSUED</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>All uranium tokens cryptographically bound to XRPL ledger sequence.</span>
        </div>
      </div>

      {/* 2. Manual Ore Batch Tokenization Form */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>MINT ORE BATCH TOKEN ON XRPL</span>
          </div>
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
        </div>

        <form onSubmit={handleManualMint} className="space-y-3 text-xs">
          <div>
            <label htmlFor="unit-select" className="text-slate-400 block mb-1">SELECT ROBOTIC EXTRACTION UNIT:</label>
            <select
              id="unit-select"
              name="unitSelect"
              value={selectedRover}
              onChange={(e) => setSelectedRover(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:border-emerald-500 outline-none"
            >
              {fleet.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} ({u.type}) - {u.radUSv} µSv/h
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="ore-weight" className="text-slate-400 block mb-1">ORE MASS (KG U3O8):</label>
              <input
                id="ore-weight"
                name="oreWeight"
                type="number"
                value={oreWeight}
                onChange={(e) => setOreWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-emerald-400 font-bold focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="ore-purity" className="text-slate-400 block mb-1">GRADE PURITY (%):</label>
              <input
                id="ore-purity"
                name="orePurity"
                type="number"
                step="0.05"
                value={orePurity}
                onChange={(e) => setOrePurity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-cyan-400 font-bold focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-950/80 p-2 rounded border border-slate-800 text-[11px] text-slate-400">
            <div className="flex justify-between mb-0.5">
              <span>CALCULATED PURE U3O8 ASSET:</span>
              <span className="text-emerald-400 font-bold">
                {(oreWeight * (orePurity / 100)).toFixed(2)} KG
              </span>
            </div>
            <div className="flex justify-between">
              <span>XRPL NETWORK TRANSACTION FEE:</span>
              <span className="text-cyan-400 font-bold">0.000012 XRP</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isMinting}
            className="tactical-btn w-full justify-center py-2.5 mt-2"
          >
            {isMinting ? 'VALIDATING ON XRPL TESTNET...' : 'EXECUTE ON-CHAIN TOKENIZATION'}
          </button>
        </form>
      </div>

      {/* 3. Live XRPL Ledger Transaction Feed */}
      <div className="glass-panel p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>LIVE XRPL LEDGER TRANSACTIONS</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
              VALIDATED STREAM
            </span>
          </div>

          {/* Tx List */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {txHistory.map((tx) => (
              <div 
                key={tx.hash}
                className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-emerald-400 font-bold">{tx.type}</span>
                  <span className="text-slate-400 text-[10px]">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-slate-300 flex justify-between mb-1">
                  <span>AMOUNT: <strong className="text-cyan-300">{tx.amount}</strong></span>
                  <span className="text-slate-400">SEQ #{tx.sequence}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mb-1">
                  MEMO: <span className="text-slate-300">{tx.memo}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-900">
                  <button
                    onClick={() => copyToClipboard(tx.hash)}
                    className="text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                  >
                    <span>HASH: {tx.hash.substring(0, 10)}...</span>
                    {copiedHash === tx.hash ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>

                  <a
                    href={`https://testnet.bithomp.com/explorer/${tx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-0.5"
                  >
                    BITHOMP <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-500 text-center">
          Real-time XRPL WebSocket Ledger Feed
        </div>
      </div>

    </div>
  );
}
