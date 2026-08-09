import React, { useState, useEffect, useRef } from 'react';
import { 
  Coins, 
  Wallet, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  ExternalLink,
  Copy,
  Zap,
  Lock,
  Settings,
  Download,
  AlertTriangle,
  Radio,
  Share2
} from 'lucide-react';
import { faucetService } from '../services/faucetService';
import { soundEffects } from '../services/audioService';
import confetti from 'canvas-confetti';
import * as xrpl from 'xrpl';

export default function ZrtFaucetPanel() {
  const [recipient, setRecipient] = useState('');
  const [claimAmount, setClaimAmount] = useState('100');
  const [balances, setBalances] = useState({ ...faucetService.balances });
  const [claimsHistory, setClaimsHistory] = useState([...faucetService.claimsHistory]);
  
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(null);
  
  // Local test wallet generation
  const [localWallet, setLocalWallet] = useState(null);
  const [localZrtBalance, setLocalZrtBalance] = useState('0.00');
  const [localXrpBalance, setLocalXrpBalance] = useState('0.00');
  const [isCreatingLocal, setIsCreatingLocal] = useState(false);
  const [trustlineSet, setTrustlineSet] = useState(false);

  // Address validation state
  const [addressStatus, setAddressStatus] = useState({
    isValid: false,
    hasTrustline: false,
    checking: false,
    msg: 'Enter recipient address'
  });

  // Admin controls
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [mintAmount, setMintAmount] = useState('1000000');
  
  // Status notifications
  const [status, setStatus] = useState(null);

  // Visual flow canvas ref
  const canvasRef = useRef(null);
  const [pulses, setPulses] = useState([]); // Array of active transfer pulses on map

  useEffect(() => {
    initFaucet();

    const unsubscribe = faucetService.subscribe((event) => {
      if (event.type === 'BALANCES_UPDATED' || event.type === 'CLAIM_RECORDED') {
        setBalances({ ...faucetService.balances });
        setClaimsHistory([...faucetService.claimsHistory]);
      }
    });

    return unsubscribe;
  }, []);

  // Check recipient address status as they type
  useEffect(() => {
    const checkAddress = async () => {
      const addr = recipient.trim();
      if (!addr) {
        setAddressStatus({ isValid: false, hasTrustline: false, checking: false, msg: 'Enter recipient address' });
        return;
      }

      // Basic XRPL address regex check
      const xrplRegex = /^r[0-9a-zA-Z]{24,34}$/;
      if (!xrplRegex.test(addr)) {
        setAddressStatus({ isValid: false, hasTrustline: false, checking: false, msg: 'Invalid XRPL address format' });
        return;
      }

      setAddressStatus(prev => ({ ...prev, checking: true, msg: 'Querying ledger state...' }));

      if (faucetService.simulationMode) {
        // Mock verification
        setTimeout(() => {
          const hasTrust = localWallet && addr === localWallet.address ? trustlineSet : Math.random() > 0.3;
          setAddressStatus({
            isValid: true,
            hasTrustline: hasTrust,
            checking: false,
            msg: hasTrust ? 'Trustline Active (Ready to receive ZRT)' : 'Missing ZRT trustline'
          });
        }, 600);
        return;
      }

      try {
        if (!faucetService.client || !faucetService.client.isConnected()) {
          setAddressStatus({ isValid: true, hasTrustline: true, checking: false, msg: 'Connected (Ready)' });
          return;
        }

        // Verify account exists
        const accountInfo = await faucetService.client.request({
          command: 'account_info',
          account: addr
        }).catch(() => null);

        if (!accountInfo) {
          setAddressStatus({ isValid: true, hasTrustline: false, checking: false, msg: 'Unfunded Address (Need XRP to activate)' });
          return;
        }

        // Verify trustline to Issuer for ZRT
        const lines = await faucetService.client.request({
          command: 'account_lines',
          account: addr
        });
        
        const zrtLine = lines.result.lines.find(l => 
          l.currency === faucetService.tokenCode && 
          l.account === faucetService.issuerWallet?.address
        );

        if (zrtLine) {
          setAddressStatus({ isValid: true, hasTrustline: true, checking: false, msg: 'Verified (Ready to receive ZRT)' });
        } else {
          setAddressStatus({ isValid: true, hasTrustline: false, checking: false, msg: 'Missing ZRT Trustline' });
        }
      } catch (err) {
        setAddressStatus({ isValid: true, hasTrustline: false, checking: false, msg: 'Error verifying trustline' });
      }
    };

    const timer = setTimeout(checkAddress, 500);
    return () => clearTimeout(timer);
  }, [recipient, trustlineSet, localWallet]);

  // Canvas visual flow loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    // Node coordinates
    const nodes = {
      issuer: { x: 50, y: 70, label: 'ZRT ISSUER', glow: '#a855f7' },
      faucet: { x: 190, y: 70, label: 'FAUCET VAULT', glow: '#a855f7' },
      recipient: { x: 330, y: 70, label: 'RECIPIENT', glow: '#06b6d4' }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw connection wires
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      
      // Wire 1: Issuer -> Faucet
      ctx.beginPath();
      ctx.moveTo(nodes.issuer.x, nodes.issuer.y);
      ctx.lineTo(nodes.faucet.x, nodes.faucet.y);
      ctx.stroke();

      // Wire 2: Faucet -> Recipient
      ctx.beginPath();
      ctx.moveTo(nodes.faucet.x, nodes.faucet.y);
      ctx.lineTo(nodes.recipient.x, nodes.recipient.y);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Update and draw pulses
      setPulses(prevPulses => {
        const nextPulses = [];
        prevPulses.forEach(p => {
          const updated = { ...p, progress: p.progress + 0.03 };
          if (updated.progress < 1.0) {
            // Draw pulse particle
            const start = nodes[p.from];
            const end = nodes[p.to];
            const currentX = start.x + (end.x - start.x) * updated.progress;
            const currentY = start.y + (end.y - start.y) * updated.progress;

            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
            ctx.fill();

            // Sparks
            for (let i = 0; i < 3; i++) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.beginPath();
              ctx.arc(
                currentX + (Math.random() - 0.5) * 8, 
                currentY + (Math.random() - 0.5) * 8, 
                1.5, 0, Math.PI * 2
              );
              ctx.fill();
            }

            nextPulses.push(updated);
          }
        });
        return nextPulses;
      });
      ctx.shadowBlur = 0; // Reset shadow

      // Draw node points
      Object.keys(nodes).forEach(key => {
        const node = nodes[key];
        
        // Outer glowing ring
        ctx.strokeStyle = node.glow;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Inner solid core
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = node.glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 8px "Share Tech Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y - 24);
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const triggerPulse = (from, to, color) => {
    setPulses(prev => [...prev, { from, to, color, progress: 0 }]);
  };

  const initFaucet = async () => {
    setIsInitializing(true);
    await faucetService.setupFaucetAccounts();
    setBalances({ ...faucetService.balances });
    setIsInitializing(false);
  };

  const handleGenerateTestWallet = async () => {
    soundEffects.playClick(1000);
    setIsCreatingLocal(true);
    setStatus({ type: 'info', msg: 'Generating wallet & requesting testnet XRP...' });
    
    try {
      const wallet = xrpl.Wallet.generate();
      
      if (!faucetService.simulationMode && faucetService.client) {
        const { balance } = await faucetService.client.fundWallet(wallet);
        setLocalWallet(wallet);
        setLocalXrpBalance(balance.toString());
        
        setStatus({ type: 'info', msg: 'Establishing trustline limits for ZRT...' });
        const ok = await faucetService.setupUserTrustline(wallet);
        
        if (ok) {
          setTrustlineSet(true);
          setRecipient(wallet.address);
          setStatus({ type: 'success', msg: 'Playground account ready! ZRT trustline verified.' });
          triggerPulse('faucet', 'recipient', '#06b6d4');
        } else {
          setStatus({ type: 'error', msg: 'XRP funded, but ZRT trustline config failed.' });
        }
      } else {
        // Simulation mode
        setLocalWallet(wallet);
        setLocalXrpBalance('100.00');
        setTrustlineSet(true);
        setRecipient(wallet.address);
        setStatus({ type: 'success', msg: 'Simulated playground account seeded!' });
        triggerPulse('faucet', 'recipient', '#06b6d4');
      }
    } catch (e) {
      console.error(e);
      setStatus({ type: 'error', msg: `Wallet seed failure: ${e.message}` });
    } finally {
      setIsCreatingLocal(false);
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!recipient.trim()) return;

    soundEffects.playClick(900);
    setIsSending(true);
    setStatus({ type: 'info', msg: 'Executing top-up on-chain transaction...' });

    // Trigger visual pulse from faucet to recipient
    triggerPulse('faucet', 'recipient', '#a855f7');

    const result = await faucetService.topupAddress(recipient, claimAmount);
    setIsSending(false);

    if (result && result.status === 'SUCCESS') {
      setStatus({ 
        type: 'success', 
        msg: `Top-up processed! Sent ${claimAmount} ZRT to ${recipient}` 
      });
      
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#06b6d4', '#10b981']
      });
      soundEffects.playTxConfirmed();

      if (localWallet && recipient === localWallet.address) {
        setLocalZrtBalance(prev => (parseFloat(prev) + parseFloat(claimAmount)).toFixed(2));
      }
    } else {
      setStatus({ 
        type: 'error', 
        msg: `Payout rejected: ${result.error || 'Destination account requires an established trustline.'}` 
      });
      soundEffects.playWarningPulse();
    }
  };

  // Admin function: Refill distributor from issuer
  const handleFaucetRefill = async () => {
    soundEffects.playClick(1050);
    setIsRefilling(true);
    setStatus({ type: 'info', msg: `Refilling Faucet vault with ${parseInt(mintAmount).toLocaleString()} ZRT...` });
    
    // Visual pulse from issuer to Faucet
    triggerPulse('issuer', 'faucet', '#a855f7');

    if (faucetService.simulationMode) {
      await new Promise(r => setTimeout(r, 1200));
      faucetService.balances.faucetZrt = (parseFloat(faucetService.balances.faucetZrt) + parseFloat(mintAmount)).toFixed(2);
      setBalances({ ...faucetService.balances });
      setIsRefilling(false);
      setStatus({ type: 'success', msg: 'Simulated refill complete!' });
      return;
    }

    try {
      const refillTx = {
        TransactionType: "Payment",
        Account: faucetService.issuerWallet.address,
        Destination: faucetService.faucetWallet.address,
        Amount: {
          currency: faucetService.tokenCode,
          issuer: faucetService.issuerWallet.address,
          value: mintAmount
        }
      };

      await faucetService.client.submitAndWait(refillTx, { wallet: faucetService.issuerWallet });
      await faucetService.updateBalances();
      setStatus({ type: 'success', msg: `Refilled Faucet Reserves with ${parseInt(mintAmount).toLocaleString()} ZRT!` });
    } catch (e) {
      setStatus({ type: 'error', msg: `Refill failed: ${e.message}` });
    } finally {
      setIsRefilling(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    soundEffects.playClick(1200);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleExportLogs = () => {
    soundEffects.playClick(1000);
    const content = claimsHistory.map(c => `${c.timestamp},${c.recipient},${c.amount},${c.status},${c.hash}`).join('\n');
    const blob = new Blob([`Timestamp,Recipient,Amount,Status,Hash\n${content}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zrt_faucet_ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel p-4 mb-4 font-hud">
      {/* Top Banner Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-purple-500/30 pb-3">
        <div className="flex items-center gap-2 text-white">
          <Coins className="w-5 h-5 text-purple-400 animate-pulse" />
          <h2 className="text-base font-bold font-heading text-white tracking-wider">
            ZRT (ZEPHYR RADIANT TOKEN) ULTIMATE FAUCET & LEDGER HUB
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className={`p-1.5 rounded border text-xs flex items-center gap-1.5 cursor-pointer ${
              isAdminOpen ? 'bg-purple-950 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> VAULT ADMIN
          </button>
          <span className="text-xs text-purple-400 bg-purple-950/60 border border-purple-500/40 px-2.5 py-1 rounded font-bold">
            {faucetService.simulationMode ? 'SIMULATION MODE' : 'LIVE XRPL TESTNET'}
          </span>
        </div>
      </div>

      {/* Admin Operations Sub-panel */}
      {isAdminOpen && (
        <div className="glass-panel p-3 bg-purple-950/20 border-purple-500/30 mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs animate-fadeIn">
          <div>
            <h3 className="text-purple-400 font-bold mb-1.5 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> REFILL FAUCET RESERVES (MINT TOKENS)
            </h3>
            <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
              Mints additional ZRT from the issuer root address directly into the Distributor Faucet vault to ensure continuous test network claims.
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-mono outline-none flex-1"
                placeholder="Amount to mint..."
              />
              <button 
                onClick={handleFaucetRefill}
                disabled={isRefilling || !mintAmount}
                className="tactical-btn py-1 px-4 bg-purple-950 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black cursor-pointer"
              >
                {isRefilling ? 'MINTING...' : 'EXECUTE MINT'}
              </button>
            </div>
          </div>

          <div className="border-l border-slate-800/80 pl-3 flex flex-col justify-between">
            <div>
              <h3 className="text-slate-400 font-bold mb-1.5">ISSUING METADATA DIRECTIVES</h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300">
                <div>TOKEN CODE: <span className="text-purple-400">ZRT</span></div>
                <div>DECIMALS: <span className="text-purple-400">15 Limit</span></div>
                <div>AUTOTRUST: <span className="text-purple-400">ENABLED</span></div>
                <div>CONGESTION: <span className="text-emerald-400">NORMAL</span></div>
              </div>
            </div>
            <div className="text-[10px] text-yellow-500 bg-yellow-550/10 border border-yellow-500/20 p-1.5 rounded flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
              <span>Minting is cryptographically locked to Issuer private keys.</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Col 1: Vault Reserves and Live Map Flow */}
        <div className="glass-panel p-4 bg-slate-950/80 border-purple-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-xs">
              <span className="text-purple-400 font-bold">VAULT DISTRIBUTOR CORE</span>
              <button 
                onClick={initFaucet} 
                disabled={isInitializing}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isInitializing ? 'animate-spin' : ''}`} /> RELOAD
              </button>
            </div>

            {/* Canvas Visualizer */}
            <div className="bg-slate-900/40 rounded border border-slate-800/60 p-2 mb-3 flex flex-col items-center">
              <span className="text-[9px] text-slate-500 mb-1 font-mono tracking-wider">LIVE TRANSACTION FLOW VECTOR</span>
              <canvas 
                ref={canvasRef} 
                width={380} 
                height={120} 
                className="w-full h-[120px] bg-slate-950 border border-purple-950 rounded"
              />
            </div>

            <div className="space-y-2.5">
              <div className="bg-slate-900/60 p-2 rounded border border-slate-850">
                <span className="text-slate-400 text-[10px] block">ISSUER ADDR:</span>
                <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                  <span className="truncate">{faucetService.issuerWallet?.address || 'Initialising...'}</span>
                  <button onClick={() => copyToClipboard(faucetService.issuerWallet?.address)} className="text-slate-500 hover:text-white ml-2">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/60 p-2 rounded border border-slate-850">
                <span className="text-slate-400 text-[10px] block">FAUCET VAULT ADDR:</span>
                <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                  <span className="truncate">{faucetService.faucetWallet?.address || 'Initialising...'}</span>
                  <button onClick={() => copyToClipboard(faucetService.faucetWallet?.address)} className="text-slate-500 hover:text-white ml-2">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850">
                  <span className="text-slate-400 text-[9px] block">ZRT TOTAL VAULT</span>
                  <span className="text-purple-400 font-bold text-sm leading-tight block mt-0.5">
                    {parseFloat(balances.faucetZrt).toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850">
                  <span className="text-slate-400 text-[9px] block">GAS RESERVES</span>
                  <span className="text-emerald-400 font-bold text-sm leading-tight block mt-0.5">
                    {balances.faucetXrp} XRP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Payout Wizard with Dynamic Trustline validation */}
        <div className="glass-panel p-4 bg-slate-950/80">
          <div className="border-b border-slate-800 pb-2 mb-3 text-xs text-purple-400 font-bold flex items-center justify-between">
            <span>CLAIM PAYOUT DISPENSARY</span>
            <span className="text-[10px] text-slate-500">TRUSTLINE VERIFICATION</span>
          </div>

          <form onSubmit={handleClaim} className="space-y-3 text-xs">
            <div>
              <label htmlFor="payout-recipient" className="text-slate-400 block mb-1">DESTINATION ACCOUNT ADDRESS:</label>
              <input
                id="payout-recipient"
                name="payoutRecipient"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="r... (Target wallet)"
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono outline-none focus:border-purple-500 text-xs"
              />

              {/* Dynamic Validation Sub-Label */}
              <div className="mt-1 flex items-center justify-between text-[9px] font-mono px-1">
                <span className="text-slate-500">STATUS:</span>
                <span className={`font-semibold flex items-center gap-1 ${
                  addressStatus.checking ? 'text-slate-400' :
                  addressStatus.isValid && addressStatus.hasTrustline ? 'text-emerald-400' :
                  addressStatus.isValid && !addressStatus.hasTrustline ? 'text-yellow-500' : 'text-slate-500'
                }`}>
                  {addressStatus.checking && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
                  {addressStatus.isValid && addressStatus.hasTrustline && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />}
                  {addressStatus.isValid && !addressStatus.hasTrustline && <AlertTriangle className="w-2.5 h-2.5 text-yellow-500" />}
                  {addressStatus.msg.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">SELECT TOP-UP DISBURSEMENT:</label>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {['50', '100', '250'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick(800);
                      setClaimAmount(val);
                    }}
                    className={`p-2 rounded text-center border font-bold text-xs cursor-pointer ${
                      claimAmount === val
                        ? 'bg-purple-950 border-purple-500 text-purple-300'
                        : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white'
                    }`}
                  >
                    {val} ZRT
                  </button>
                ))}
              </div>
            </div>

            {status && (
              <div className={`p-2 rounded border flex items-start gap-2 ${
                status.type === 'success' ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' :
                status.type === 'error' ? 'bg-rose-950/50 border-rose-500/40 text-rose-300' :
                'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />}
                <p className="text-[10px] leading-relaxed font-mono">{status.msg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSending || !recipient || !addressStatus.isValid}
              className={`tactical-btn w-full justify-center py-2.5 mt-2 bg-purple-950/40 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black hover:box-shadow-purple cursor-pointer ${
                (!recipient || !addressStatus.isValid) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSending ? 'BROADCASTING TRANSACTION...' : 'EXECUTE TOP-UP TRANSACTION'}
            </button>
          </form>
        </div>

        {/* Col 3: Sandbox Playground Wallet & Guides */}
        <div className="glass-panel p-4 bg-slate-950/80 flex flex-col justify-between border-slate-900">
          <div>
            <div className="border-b border-slate-800 pb-2 mb-3 text-xs text-purple-400 font-bold flex items-center justify-between">
              <span>PLAYGROUND DEPLOYER</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-800 px-1 rounded font-mono">1-CLICK</span>
            </div>

            {localWallet ? (
              <div className="space-y-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800/80 font-mono space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>PLAYGROUND ACCOUNT:</span>
                    <span className="text-emerald-400">TRUSTLINE VERIFIED</span>
                  </div>
                  <div className="text-cyan-300 text-[11px] truncate flex items-center justify-between">
                    <span className="truncate">{localWallet.address}</span>
                    <button onClick={() => copyToClipboard(localWallet.address)} className="text-slate-500 ml-1">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">ACCOUNT XRP</span>
                    <span className="text-emerald-400 font-bold text-xs">{localXrpBalance} XRP</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">ZRT TOKENS</span>
                    <span className="text-purple-400 font-bold text-xs">{localZrtBalance} ZRT</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    soundEffects.playClick(1000);
                    setRecipient(localWallet.address);
                  }}
                  className="w-full text-center py-1.5 border border-dashed border-purple-500/30 rounded text-slate-400 hover:text-white hover:border-purple-500/60 text-[10px] font-mono cursor-pointer"
                >
                  INSERT PLAYGROUND ADDR TO TOP-UP INPUT
                </button>
              </div>
            ) : (
              <div className="text-center py-3 space-y-2.5">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Need a playground address to receive test tokens? Click below to instantly generate a temporary wallet funded with XRP and configured with a ZRT trustline.
                </p>
                <button
                  onClick={handleGenerateTestWallet}
                  disabled={isCreatingLocal}
                  className="tactical-btn-cyan text-xs py-2 w-full justify-center cursor-pointer"
                >
                  {isCreatingLocal ? 'CREATING & TRUSTING...' : 'GENERATE TESTNET PLAYGROUND'}
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 bg-slate-900/40 p-2 rounded border border-slate-800/80 text-[9px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-400">
              <Lock className="w-3 h-3 text-purple-400" /> XRPL TRUSTLINE REGULATION GUIDE:
            </div>
            <p className="leading-normal">
              1. Recipient must establish a trustline to the Issuer before they can hold ZRT.
            </p>
            <p className="leading-normal">
              2. TrustSet tx format: LimitAmount = `{`currency: "ZRT", issuer: issuerWallet, value: "1000000"`}`.
            </p>
          </div>
        </div>

      </div>

      {/* Claims Ledger Stream */}
      <div className="mt-4 pt-3 border-t border-slate-850">
        <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
          <span className="font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            LIVE TRANSACTION LEDGER & FAUCET STATS
          </span>
          <button 
            onClick={handleExportLogs}
            disabled={claimsHistory.length === 0}
            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
          >
            <Download className="w-3.5 h-3.5" /> EXPORT CSV
          </button>
        </div>

        <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1 text-[11px]">
          {claimsHistory.length === 0 ? (
            <div className="text-slate-500 text-center py-4 font-mono flex flex-col items-center gap-1">
              <Radio className="w-4 h-4 text-slate-600 animate-pulse" />
              <span>Awaiting transaction disbursement orders...</span>
            </div>
          ) : (
            claimsHistory.map(claim => (
              <div 
                key={claim.hash}
                className="p-2 rounded bg-slate-900 border border-slate-850 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 font-bold text-[10px] border border-purple-500/20">
                    {claim.amount}
                  </span>
                  <span className="text-slate-400 font-mono truncate max-w-[280px]">
                    TO: <strong className="text-slate-300 font-semibold">{claim.recipient}</strong>
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-slate-500 font-mono">{claim.timestamp}</span>
                  <span className="text-emerald-400 font-bold font-mono">{claim.status}</span>
                  <a 
                    href={`https://testnet.bithomp.com/explorer/${claim.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    EXPLORER <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
