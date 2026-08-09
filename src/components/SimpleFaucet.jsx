import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  ExternalLink,
  Globe,
  Coins,
  Cpu,
  Layers,
  Terminal,
  Activity,
  History,
  TrendingUp,
  Workflow
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

  // Live state details
  const [userBalance, setUserBalance] = useState('0.0000');
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [claimsList, setClaimsList] = useState(faucetService.claimsHistory);
  const [faucetVaultBalance, setFaucetVaultBalance] = useState(faucetService.balances.evmXrp);

  // Collapsible Developer Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('react'); // 'react' | 'ethers' | 'rpc'

  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(recipient.trim());

  // Setup canvas particle flow animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const maxParticles = 35;

    // Source coordinate (Faucet Vault) & Target coordinate (User Address)
    const sourceX = 60;
    const sourceY = height / 2;
    const targetX = width - 60;
    const targetY = height / 2;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = sourceX;
        this.y = sourceY + (Math.random() - 0.5) * 10;
        this.speed = 1.5 + Math.random() * 2;
        this.radius = 1.5 + Math.random() * 2;
        this.color = Math.random() > 0.5 ? '#a855f7' : '#06b6d4';
        this.alpha = 0.8 + Math.random() * 0.2;
      }
      update() {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
          this.reset();
        } else {
          this.x += (dx / dist) * this.speed;
          this.y += (dy / dist) * this.speed;
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw path guide line
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw endpoints
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#10b981';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(targetX, targetY, 6, 0, Math.PI * 2);
      ctx.fillStyle = isValidAddress ? '#a855f7' : '#475569';
      ctx.shadowBlur = 12;
      ctx.shadowColor = isValidAddress ? '#a855f7' : '#475569';
      ctx.fill();

      // Labels
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      ctx.fillText('VAULT', sourceX - 18, sourceY - 12);
      ctx.fillText('WALLET', targetX - 18, targetY - 12);

      // Draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isValidAddress]);

  // Fetch connected account balance dynamically
  useEffect(() => {
    if (isValidAddress) {
      setIsFetchingBalance(true);
      faucetService.getUserBalance(recipient)
        .then(bal => {
          setUserBalance(bal);
          setIsFetchingBalance(false);
        })
        .catch(() => setIsFetchingBalance(false));
    } else {
      setUserBalance('0.0000');
    }
  }, [recipient]);

  // Setup state updates & window.ethereum listeners
  useEffect(() => {
    faucetService.setupFaucetAccounts();

    const sub = faucetService.subscribe((data) => {
      if (data.type === 'BALANCES_UPDATED') {
        setFaucetVaultBalance(data.balances.evmXrp);
      } else if (data.type === 'CLAIM_RECORDED') {
        setClaimsList([...faucetService.claimsHistory]);
      }
    });

    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setMetaMaskAddr(accounts[0]);
          setRecipient(accounts[0]);
        } else {
          setMetaMaskAddr('');
          setRecipient('');
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        sub();
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }

    return sub;
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

    const result = await faucetService.topupEvmAddress(recipient, claimAmount);
    setIsSending(false);

    if (result && result.status === 'SUCCESS') {
      setStatus({ 
        type: 'success', 
        msg: `Transaction Broadcast! Claim of ${claimAmount} XRP validated on-chain.` 
      });
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#a855f7', '#06b6d4', '#10b981']
      });
      soundEffects.playTxConfirmed();

      // Refresh balance after claim
      setTimeout(async () => {
        const bal = await faucetService.getUserBalance(recipient);
        setUserBalance(bal);
      }, 2500);
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

  // Raw code snippet template content
  const codeTemplates = {
    react: `// React Custom Hook for MetaMask Provider Routing
const connectMetaMask = async () => {
  if (!window.ethereum) throw new Error("No Web3 Provider");
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });
  // Trigger direct EIP-3085 custom network setup
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [{
      chainId: "0x161c28",
      chainName: "XRPL EVM Testnet",
      rpcUrls: ["https://rpc.testnet.xrplevm.org"],
      nativeCurrency: { symbol: "XRP", decimals: 18 }
    }]
  });
  return accounts[0];
};`,
    ethers: `// Ethers.js v6 On-Chain Balance Fetching
import { ethers } from "ethers";

const fetchEVMBalance = async (userAddress) => {
  const provider = new ethers.JsonRpcProvider("https://rpc.testnet.xrplevm.org");
  const weiBalance = await provider.getBalance(userAddress);
  const formatted = ethers.formatEther(weiBalance);
  console.log("Balance:", parseFloat(formatted).toFixed(4), "XRP");
  return formatted;
};`,
    rpc: `// Custom JSON-RPC Payment Payload
const payload = {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_sendTransaction",
  params: [{
    from: "0x31A826bB9D5F6087d94CDA31945C1234d061b788",
    to: recipientAddress,
    value: "0x55b1f5d68d1b" // amount in Wei hex
  }]
};`
  };

  return (
    <div style={{ width: '100%', maxWidth: '880px', margin: '40px auto 0 auto', padding: '0 16px', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      
      {/* Title & Subtitle */}
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px auto' }}>
        <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
          XRPL EVM FAUCET & REAL-TIME HUD
        </span>
        <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#ffffff', lineHeight: '1.2', letterSpacing: '-0.8px', marginBottom: '14px' }}>
          Get test XRP, to your wallet <span style={{ background: 'linear-gradient(to right, #c084fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>in seconds.</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 auto' }}>
          Get test XRP delivered on the XRPL EVM sidechain. Pick a network, <strong style={{ color: '#e2e8f0' }}>CONNECT</strong> or <strong style={{ color: '#e2e8f0' }}>PASTE</strong> your address, and you're set.
        </p>
      </div>

      {/* Main Faucet Card Container */}
      <div style={{ 
        backgroundColor: '#0a0c10', 
        border: '1px solid #1e293b', 
        borderRadius: '20px', 
        padding: '36px', 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: '36px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        alignItems: 'stretch',
        marginBottom: '24px'
      }}>
        
        {/* Left Steps Column (Step 1 & Step 2) */}
        <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: '32px', minWidth: '280px' }}>
          
          {/* Step 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', flexWrap: 'wrap', gap: '8px', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '9px', color: '#64748b', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>STEP 1</span>
                <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Connect or paste an address</h3>
              </div>

              {/* Connect Badge */}
              <button
                type="button"
                onClick={handleConnectWallet}
                disabled={isConnectingMM}
                style={{
                  backgroundColor: '#030712',
                  border: '1px solid #334155',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: metaMaskAddr ? '#10b981' : '#ef4444' }}></span>
                <span>{metaMaskAddr ? `${metaMaskAddr.slice(0, 6)}...${metaMaskAddr.slice(-4)}` : 'Connect Wallet'}</span>
              </button>
            </div>

            {/* Input Address Field */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#030712', 
              border: '1px solid #334155', 
              borderRadius: '12px', 
              padding: '14px 16px',
              transition: 'border 0.2s',
              position: 'relative'
            }}>
              <span style={{ color: '#64748b', marginRight: '10px', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold' }}>&gt;</span>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x... (MetaMask EVM Address)"
                style={{ 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  outline: 'none', 
                  color: '#ffffff', 
                  fontSize: '13px', 
                  width: '100%', 
                  fontFamily: 'monospace',
                  fontWeight: '500'
                }}
              />
              {recipient && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px', shrink: 0 }}>
                  <button 
                    type="button" 
                    onClick={handleCopy}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', fontFamily: 'monospace', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  {isValidAddress && <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} />}
                </div>
              )}

              {/* Connected Wallet Live Balance Badge */}
              {isValidAddress && (
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '-22px',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Activity style={{ width: '10px', height: '10px', animation: 'pulse 2s infinite' }} />
                  <span>On-Chain Balance: {isFetchingBalance ? 'fetching...' : `${userBalance} XRP`}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <div>
              <span style={{ fontSize: '9px', color: '#64748b', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>STEP 2</span>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Pick a network</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setSelectedNetwork('testnet')}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: selectedNetwork === 'testnet' ? '1px solid #a855f7' : '1px solid #1e293b',
                  backgroundColor: selectedNetwork === 'testnet' ? 'rgba(168, 85, 247, 0.15)' : '#030712',
                  color: selectedNetwork === 'testnet' ? '#e9d5ff' : '#64748b',
                  fontWeight: '700',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: selectedNetwork === 'testnet' ? '#c084fc' : '#475569' }}></span>
                Testnet <span style={{ opacity: 0.6, fontSize: '10px' }}>{faucetVaultBalance} XRP</span>
              </button>

              <button
                type="button"
                disabled
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  backgroundColor: '#030712',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  fontFamily: 'monospace'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#334155' }}></span>
                Devnet <span style={{ opacity: 0.4, fontSize: '10px' }}>100 XRP</span>
              </button>
            </div>
          </div>

          {/* Interactive Flow Map Canvas inside card */}
          <div style={{ position: 'relative', width: '100%', height: '70px', backgroundColor: '#030712', border: '1px dashed #334155', borderRadius: '12px', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>

        </div>

        {/* Right Claim Summary Card */}
        <div style={{ 
          flex: '0 0 300px', 
          backgroundColor: '#030712', 
          border: '1px solid #1e293b', 
          borderRadius: '16px', 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          justify: 'space-between',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <span style={{ fontSize: '38px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>{claimAmount}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', fontFamily: 'monospace' }}>XRP</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', fontFamily: 'monospace' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #0f172a', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Network</span>
                <span style={{ color: '#f1f5f9', fontWeight: 'bold', textTransform: 'capitalize' }}>{selectedNetwork}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #0f172a', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Chain ID</span>
                <span style={{ color: '#f1f5f9', fontWeight: 'bold' }}>1449000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #0f172a', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>ETA</span>
                <span style={{ color: '#c084fc', fontWeight: 'bold' }}>&lt; 2 min</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Method</span>
                <span style={{ color: '#f1f5f9', fontWeight: 'bold' }}>Bridge from XRPL</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {status && (
              <div style={{ 
                padding: '10px 12px', 
                borderRadius: '10px', 
                border: status.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
                backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                color: status.type === 'success' ? '#6ee7b7' : '#fda4af',
                fontSize: '11px',
                fontFamily: 'monospace',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                  <span>{status.msg}</span>
                </div>
                {status.type === 'success' && (
                  <a 
                    href="https://explorer.testnet.xrplevm.org/" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ color: '#c084fc', textDecoration: 'underline', fontSize: '10px', marginTop: '4px', fontWeight: 'bold' }}
                  >
                    🔍 Inspect Transaction on XRPL EVM Explorer &rarr;
                  </a>
                )}
              </div>
            )}

            <button
              onClick={handleRequestTokens}
              disabled={isSending || !isValidAddress}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: (isValidAddress && !isSending) ? '#7c3aed' : '#4c1d95',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRadius: '12px',
                border: 'none',
                cursor: (isValidAddress && !isSending) ? 'pointer' : 'not-allowed',
                opacity: (isValidAddress && !isSending) ? 1 : 0.6,
                boxShadow: (isValidAddress && !isSending) ? '0 10px 15px -3px rgba(124, 58, 237, 0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {isSending ? 'REQUESTING FROM BRIDGE...' : `REQUEST ${claimAmount} XRP`}
            </button>
          </div>

        </div>

      </div>

      {/* Network Metadata Strip */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '11px', fontFamily: 'monospace', color: '#64748b', marginTop: '24px', marginBottom: '40px' }}>
        <span>RPC: <a href="https://rpc.testnet.xrplevm.org" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>rpc.testnet.xrplevm.org</a></span>
        <span>•</span>
        <span>Explorer: <a href="https://explorer.testnet.xrplevm.org/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>explorer.testnet.xrplevm.org</a></span>
      </div>

      {/* Live On-Chain Transaction Stream */}
      <div style={{ backgroundColor: '#0a0c10', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <History style={{ width: '16px', height: '16px', color: '#c084fc' }} />
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live On-Chain Transaction Stream</h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {claimsList.map((claim) => (
            <div key={claim.hash} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 16px', backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '10px', fontSize: '11px', fontFamily: 'monospace' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ px: '6px', py: '2px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '4px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '9px', padding: '2px 6px' }}>Success</span>
                <span style={{ color: '#cbd5e1' }}>{claim.amount}</span>
                <span style={{ color: '#64748b' }}>&rarr;</span>
                <span style={{ color: '#94a3b8' }}>{claim.recipient.slice(0, 8)}...{claim.recipient.slice(-6)}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#475569' }}>{claim.timestamp}</span>
                <a 
                  href={`https://explorer.testnet.xrplevm.org/tx/${claim.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#c084fc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'bold' }}
                >
                  Inspect <ExternalLink style={{ width: '10px', height: '10px' }} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggleable Collapsible Developer drawer */}
      <div style={{ border: '1px solid #1e293b', borderRadius: '16px', backgroundColor: '#0a0c10', overflow: 'hidden' }}>
        <button
          onClick={() => {
            soundEffects.playClick(950);
            setIsDrawerOpen(!isDrawerOpen);
          }}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: '#070a10',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu style={{ width: '16px', height: '16px', color: '#06b6d4' }} />
            <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>🛠️ DEVELOPER METRICS & SMART CONTRACT DISPENSER</span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{isDrawerOpen ? 'COLLAPSE ▲' : 'EXPAND ▼'}</span>
        </button>

        {isDrawerOpen && (
          <div style={{ padding: '24px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Live On-Chain Parameters */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Layers style={{ width: '14px', height: '14px', color: '#06b6d4' }} />
                <h5 style={{ fontSize: '12px', fontWeight: '700', color: '#f1f5f9', margin: 0, textTransform: 'uppercase' }}>Live On-Chain Deployed Contracts</h5>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '14px', backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '10px', fontSize: '11px', fontFamily: 'monospace' }}>
                  <div style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '4px' }}>ISRNetwork.sol</div>
                  <div style={{ color: '#64748b', fontSize: '10px', marginBottom: '8px' }}>0x219C...85aB</div>
                  <a href="https://explorer.testnet.xrplevm.org/" target="_blank" rel="noreferrer" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 'bold' }}>Inspect Contract &rarr;</a>
                </div>
                <div style={{ padding: '14px', backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '10px', fontSize: '11px', fontFamily: 'monospace' }}>
                  <div style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '4px' }}>CohrLab.sol</div>
                  <div style={{ color: '#64748b', fontSize: '10px', marginBottom: '8px' }}>0x89Fd...C085</div>
                  <a href="https://explorer.testnet.xrplevm.org/" target="_blank" rel="noreferrer" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 'bold' }}>Inspect Contract &rarr;</a>
                </div>
                <div style={{ padding: '14px', backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '10px', fontSize: '11px', fontFamily: 'monospace' }}>
                  <div style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '4px' }}>DarkMatterFarm.sol</div>
                  <div style={{ color: '#64748b', fontSize: '10px', marginBottom: '8px' }}>0x55b1...f5d6</div>
                  <a href="https://explorer.testnet.xrplevm.org/" target="_blank" rel="noreferrer" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 'bold' }}>Inspect Contract &rarr;</a>
                </div>
              </div>
            </div>

            {/* Code Inspector Tabs */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Terminal style={{ width: '14px', height: '14px', color: '#06b6d4' }} />
                <h5 style={{ fontSize: '12px', fontWeight: '700', color: '#f1f5f9', margin: 0, textTransform: 'uppercase' }}>Web3 Integration Code Snippets</h5>
              </div>

              {/* Tab Selector */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {['react', 'ethers', 'rpc'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveCodeTab(tab)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: activeCodeTab === tab ? '#1e293b' : '#030712',
                      border: '1px solid #1e293b',
                      borderRadius: '6px',
                      color: activeCodeTab === tab ? '#ffffff' : '#94a3b8',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Code Panel */}
              <pre style={{
                margin: 0,
                padding: '16px',
                backgroundColor: '#030712',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                color: '#e2e8f0',
                fontSize: '11px',
                fontFamily: 'monospace',
                overflowX: 'auto',
                lineHeight: '1.5',
                textAlign: 'left'
              }}>
                <code>{codeTemplates[activeCodeTab]}</code>
              </pre>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
