import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  ExternalLink,
  Globe
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

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(recipient.trim());

  // Setup account service & window.ethereum listeners
  useEffect(() => {
    faucetService.setupFaucetAccounts();

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
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
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
    <div style={{ width: '100%', maxWidth: '880px', margin: '40px auto 0 auto', padding: '0 16px', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      
      {/* Title & Subtitle */}
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px auto' }}>
        <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
          XRPL EVM FAUCET
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
        alignItems: 'stretch'
      }}>
        
        {/* Left Steps Column (Step 1 & Step 2) */}
        <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: '32px', minWidth: '280px' }}>
          
          {/* Step 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
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
              transition: 'border 0.2s'
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
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                Testnet <span style={{ opacity: 0.6, fontSize: '10px' }}>98.83 XRP</span>
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
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '11px', fontFamily: 'monospace', color: '#64748b', marginTop: '24px' }}>
        <span>RPC: <a href="https://rpc.testnet.xrplevm.org" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>rpc.testnet.xrplevm.org</a></span>
        <span>•</span>
        <span>Explorer: <a href="https://explorer.testnet.xrplevm.org/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>explorer.testnet.xrplevm.org</a></span>
      </div>
    </div>
  );
}
