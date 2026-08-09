import React from 'react';

export default function Header() {
  return (
    <header style={{ width: '100%', maxWidth: '880px', margin: '0 auto', padding: '24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
          <span style={{ color: '#ffffff', fontWeight: '800', letterSpacing: '1px', fontSize: '14px', display: 'block', fontFamily: 'sans-serif' }}>XRPL EVM</span>
          <span style={{ color: '#94a3b8', fontSize: '9px', letterSpacing: '2px', display: 'block', fontWeight: '600', fontFamily: 'sans-serif' }}>SIDECHAIN</span>
        </div>
      </div>

      {/* Systems Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'sans-serif' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
        <span style={{ color: '#10b981', fontWeight: '600' }}>All systems operational</span>
        <span style={{ color: '#64748b', fontWeight: '500', marginLeft: '4px' }}>v2.4</span>
      </div>
    </header>
  );
}
