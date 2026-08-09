import React from 'react';

export default function Header() {
  return (
    <header style={{ width: '100%', maxWidth: '880px', margin: '0 auto', padding: '24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            <div style={{ width: '9px', height: '9px', backgroundColor: '#ffffff', transform: 'rotate(45deg)' }}></div>
            <div style={{ width: '9px', height: '9px', backgroundColor: 'rgba(255, 255, 255, 0.4)', transform: 'rotate(45deg)' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '2px', marginTop: '-3px', marginLeft: '6px' }}>
            <div style={{ width: '9px', height: '9px', backgroundColor: 'rgba(255, 255, 255, 0.4)', transform: 'rotate(45deg)' }}></div>
            <div style={{ width: '9px', height: '9px', backgroundColor: '#ffffff', transform: 'rotate(45deg)' }}></div>
          </div>
        </div>
        
        <div style={{ lineHeight: '1.1' }}>
          <span style={{ color: '#ffffff', fontWeight: '800', letterSpacing: '1px', fontSize: '14px', display: 'block', fontFamily: 'sans-serif' }}>ZRT XRP FAUCET</span>
          <span style={{ color: '#c084fc', fontSize: '9px', letterSpacing: '2px', display: 'block', fontWeight: '600', fontFamily: 'sans-serif' }}>XRPL EVM SIDECHAIN</span>
        </div>
      </div>

      {/* Systems Status & Explorer Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontFamily: 'sans-serif', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          <span style={{ color: '#10b981', fontWeight: '600' }}>All systems operational</span>
          <span style={{ color: '#64748b', fontWeight: '500', marginLeft: '4px' }}>v2.4</span>
        </div>

        <span style={{ color: '#334155' }}>•</span>

        <a 
          href="https://explorer.testnet.xrplevm.org/" 
          target="_blank" 
          rel="noreferrer"
          style={{
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            color: '#c084fc',
            padding: '4px 10px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '10px',
            fontWeight: '700',
            fontFamily: 'monospace',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          🔍 XRPL EVM EXPLORER
        </a>
      </div>
    </header>
  );
}
