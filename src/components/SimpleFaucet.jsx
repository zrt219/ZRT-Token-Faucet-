import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  CheckCircle2, 
  ArrowRight, 
  Lock,
  Wallet,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { faucetService } from '../services/faucetService';
import { soundEffects } from '../services/audioService';
import confetti from 'canvas-confetti';

export default function SimpleFaucet() {
  const [recipient, setRecipient] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('testnet'); // 'testnet' | 'devnet'
  const [claimAmount, setClaimAmount] = useState('98.83');
  
  const [isSending, setIsSending] = useState(false);
  const [isConnectingMM, setIsConnectingMM] = useState(false);
  const [metaMaskAddr, setMetaMaskAddr] = useState('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', msg: '' }

  // Check inputs and validation
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(recipient.trim());

  useEffect(() => {
    faucetService.setupFaucetAccounts();
  }, []);

  const handleConnectWallet = async () => {
    soundEffects.playClick(1000);
    setIsConnectingMM(true);
    setStatus(null);
    try {
      const addr = await faucetService.connectMetaMask();
      setMetaMaskAddr(addr);
      setRecipient(addr);
      soundEffects.playTxConfirmed();
    } catch (e) {
      console.error(e);
      setStatus({ type: 'error', msg: e.message || 'MetaMask connection rejected.' });
      soundEffects.playWarningPulse();
    } finally {
      setIsConnectingMM(false);
    }
  };

  const handleRequestTokens = async () => {
    if (!isValidAddress) return;
    
    soundEffects.playClick(900);
    setIsSending(true);
    setStatus(null);

    // Call service to top-up EVM XRP on-chain
    const result = await faucetService.topupEvmAddress(recipient, claimAmount);
    setIsSending(false);

    if (result && result.status === 'SUCCESS') {
      setStatus({ 
        type: 'success', 
        msg: `Transaction Broadcast! Claim of ${claimAmount} XRP validated.` 
      });
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#8b5cf6', '#06b6d4', '#10b981']
      });
      soundEffects.playTxConfirmed();
    } else {
      setStatus({ 
        type: 'error', 
        msg: result.error || 'Faucet disbursement transaction failed.' 
      });
      soundEffects.playWarningPulse();
    }
  };

  const handleCopy = () => {
    if (!recipient) return;
    navigator.clipboard.writeText(recipient);
    setCopied(true);
    soundEffects.playClick(1100);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="w-full max-w-4xl mx-auto px-4 mt-8 font-sans">
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col gap-3">
        <span className="text-[10px] tracking-widest font-mono text-purple-400 font-bold uppercase block">
          XRPL EVM FAUCET
        </span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Get test XRP, to your wallet <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">in seconds.</span>
        </h1>
        <p className="text-slate-400 text-xs md:text-sm font-normal max-w-lg mx-auto leading-relaxed">
          Get test XRP delivered on the XRPL EVM sidechain. Pick a network, <strong className="text-slate-200">CONNECT</strong> or <strong className="text-slate-200">PASTE</strong> your address, and you're set.
        </p>
      </div>

      {/* Main Faucet Box */}
      <div className="bg-[#0b0c10] border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-2xl relative overflow-hidden items-stretch">
        
        {/* Left Side: Steps (Steps 1, 2, 3) */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Step 1 */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-500 font-mono tracking-widest block uppercase">STEP 1</span>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Connect or paste an address</h3>
              </div>

              {/* Connect Wallet Badge */}
              <button
                type="button"
                onClick={handleConnectWallet}
                disabled={isConnectingMM}
                className="bg-slate-950 border border-slate-800/80 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-mono text-slate-300 hover:border-purple-500/60 hover:text-white transition-all cursor-pointer shrink-0"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${metaMaskAddr ? 'bg-emerald-400' : 'bg-rose-500'} animate-pulse`}></span>
                <span>{metaMaskAddr ? `${metaMaskAddr.slice(0, 6)}...${metaMaskAddr.slice(-4)}` : 'Connect Wallet'}</span>
              </button>
            </div>

            {/* Input Address Field */}
            <div className="relative flex items-center bg-slate-950 border border-slate-900 focus-within:border-purple-500/80 rounded-xl p-3.5 transition-all">
              <span className="text-slate-500 mr-2 shrink-0 font-mono text-xs font-bold">&gt;</span>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x... (MetaMask EVM Address)"
                className="bg-transparent border-none outline-none text-white text-xs w-full font-mono placeholder-slate-600"
              />
              {recipient && (
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button 
                    type="button" 
                    onClick={handleCopy}
                    className="text-slate-500 hover:text-slate-300 text-[10px] uppercase font-mono tracking-wider flex items-center gap-0.5"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  {isValidAddress && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-500 font-mono tracking-widest block uppercase">STEP 2</span>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Pick a network</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSelectedNetwork('testnet')}
                className={`py-3.5 px-4 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  selectedNetwork === 'testnet'
                    ? 'bg-purple-950/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                    : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${selectedNetwork === 'testnet' ? 'bg-purple-400' : 'bg-slate-700'}`}></span>
                Testnet <span className="opacity-60 text-[10px]">98.83 XRP</span>
              </button>

              <button
                type="button"
                disabled
                className="py-3.5 px-4 rounded-xl border border-slate-900/50 bg-slate-950/40 text-slate-700 flex items-center justify-center gap-1.5 cursor-not-allowed font-bold"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                Devnet <span className="opacity-40 text-[10px]">100 XRP</span>
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-500 font-mono tracking-widest block uppercase">STEP 3</span>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Complete to unlock the faucet</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-300 rounded-xl flex items-center justify-between hover:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>Follow @Peersyst on X</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              </a>

              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-300 rounded-xl flex items-center justify-between hover:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>Join our Discord</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              </a>
            </div>
          </div>

        </div>

        {/* Right Side: Claim Summary Card */}
        <div className="w-full md:w-[320px] shrink-0 flex flex-col justify-between bg-slate-950 border border-slate-900 rounded-2xl p-5 md:p-6 gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline gap-1 border-b border-slate-900 pb-3">
              <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">{claimAmount}</span>
              <span className="text-sm font-semibold text-slate-500 font-mono">XRP</span>
            </div>

            <table className="w-full text-xs font-mono text-slate-300">
              <tbody className="divide-y divide-slate-900">
                <tr>
                  <td className="py-2.5 text-slate-500 uppercase text-[10px]">Network</td>
                  <td className="py-2.5 text-right font-bold capitalize">{selectedNetwork}</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-slate-500 uppercase text-[10px]">Chain ID</td>
                  <td className="py-2.5 text-right font-bold">1449000</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-slate-500 uppercase text-[10px]">ETA</td>
                  <td className="py-2.5 text-right font-bold text-purple-400">&lt; 2 min</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-slate-500 uppercase text-[10px]">Method</td>
                  <td className="py-2.5 text-right font-bold">Bridge from XRPL</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3">
            {status && (
              <div className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                status.type === 'success' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
              }`}>
                <Info className={`w-4 h-4 shrink-0 mt-0.5 ${status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`} />
                <p className="text-[10px] font-mono leading-relaxed">{status.msg}</p>
              </div>
            )}

            <button
              onClick={handleRequestTokens}
              disabled={isSending || !isValidAddress}
              className={`w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-lg hover:shadow-purple-500/20 transition-all ${
                (!isValidAddress || isSending) ? 'opacity-50 cursor-not-allowed bg-purple-900/60' : ''
              }`}
            >
              {isSending ? 'REQUESTING FROM BRIDGE...' : `Request ${claimAmount} XRP`}
            </button>
          </div>

        </div>

      </div>

      {/* Network Metadata */}
      <div className="flex justify-center gap-4 text-[10px] font-mono text-slate-600 mt-4">
        <span>RPC: <a href="https://rpc.testnet.xrplevm.org" className="hover:text-slate-400">rpc.testnet.xrplevm.org</a></span>
        <span>•</span>
        <span>Explorer: <a href="https://explorer.realtimelog.org" className="hover:text-slate-400">explorer.testnet.xrplevm.org</a></span>
      </div>
    </main>
  );
}
