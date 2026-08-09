import React from 'react';
import { ExternalLink, Disc, Globe, BookOpen, Award, Briefcase, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ width: '100%', maxWidth: '880px', margin: '80px auto 0 auto', borderTop: '1px solid #1e293b', paddingTop: '48px', paddingBottom: '64px', paddingLeft: '16px', paddingRight: '16px', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', fontSize: '12px' }}>
        
        {/* Brand & Creator Social Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                <div style={{ width: '9px', height: '9px', backgroundColor: '#c084fc', transform: 'rotate(45deg)' }}></div>
                <div style={{ width: '9px', height: '9px', backgroundColor: 'rgba(192, 132, 252, 0.4)', transform: 'rotate(45deg)' }}></div>
              </div>
              <div style={{ display: 'flex', gap: '2px', marginTop: '-3px', marginLeft: '6px' }}>
                <div style={{ width: '9px', height: '9px', backgroundColor: 'rgba(192, 132, 252, 0.4)', transform: 'rotate(45deg)' }}></div>
                <div style={{ width: '9px', height: '9px', backgroundColor: '#c084fc', transform: 'rotate(45deg)' }}></div>
              </div>
            </div>
            <div style={{ lineHeight: '1.1' }}>
              <span style={{ color: '#ffffff', fontWeight: '800', letterSpacing: '1px', fontSize: '14px', display: 'block' }}>ZRT FAUCET</span>
              <span style={{ color: '#c084fc', fontSize: '9px', letterSpacing: '2px', display: 'block', fontWeight: '600' }}>OFFICIAL ECOSYSTEM</span>
            </div>
          </div>

          {/* Social Icons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <a 
              href="https://x.com/zrt_219" 
              target="_blank" 
              rel="noreferrer"
              title="Main X / Twitter"
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none' }}
            >
              <svg style={{ width: '14px', height: '14px', fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/zrt219" 
              target="_blank" 
              rel="noreferrer"
              title="GitHub Profile"
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none' }}
            >
              <svg style={{ width: '14px', height: '14px', fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a 
              href="https://discord.gg/ZBAvzE76pB" 
              target="_blank" 
              rel="noreferrer"
              title="Discord Community"
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none' }}
            >
              <Disc style={{ width: '14px', height: '14px' }} />
            </a>
            <a 
              href="https://www.linkedin.com/in/zhane-umattr/" 
              target="_blank" 
              rel="noreferrer"
              title="LinkedIn Profile"
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none' }}
            >
              <span style={{ fontSize: '11px', fontWeight: 'bold' }}>in</span>
            </a>
          </div>
        </div>

        {/* Column 1: ZRT Apps & Ecosystem */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ color: '#f1f5f9', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', margin: 0 }}>Ecosystem Apps</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
            <li><a href="https://www.umattr.ca/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Umattr Official <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
            <li><a href="https://careercircle.app/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Career Circle <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
            <li><a href="https://vercel-build-doctor-agent.vercel.app/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>ZRT Build Doctor <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
            <li><a href="https://substack.com/@zrt1" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Substack Journal <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
            <li><a href="https://coinmarketcap.com/community/profile/ZRT_219/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>CoinMarketCap <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
          </ul>
        </div>

        {/* Column 2: Creator & Community */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ color: '#f1f5f9', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', margin: 0 }}>Community & Socials</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
            <li><a href="https://x.com/zrt_219" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>X / @zrt_219 <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
            <li><a href="https://x.com/ZRT219_Research" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>X / @ZRT219_Research <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
            <li><a href="https://discord.gg/ZBAvzE76pB" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>ZRT Discord <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
            <li><a href="https://www.linkedin.com/in/zhane-umattr/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>LinkedIn / zhane-umattr <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
            <li><a href="https://github.com/zrt219?tab=achievements" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>GitHub Achievements <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
          </ul>
        </div>

        {/* Column 3: XRPL & EVM Infrastructure */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ color: '#f1f5f9', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', margin: 0 }}>XRPL Infrastructure</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
            <li><a href="https://xrpl.org/" target="_blank" rel="noreferrer" style={{ color: '#06b6d4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>Official XRPL.org <ExternalLink style={{ width: '11px', height: '11px', color: '#06b6d4' }} /></a></li>
            <li><a href="https://explorer.testnet.xrplevm.org/" target="_blank" rel="noreferrer" style={{ color: '#c084fc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>EVM Sidechain Explorer <ExternalLink style={{ width: '11px', height: '11px', color: '#c084fc' }} /></a></li>
            <li><a href="https://testnet.xrpl.org/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>XRPL Testnet Explorer <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
            <li><a href="https://testnet.bithomp.com/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Bithomp Explorer <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
            <li><a href="https://rpc.testnet.xrplevm.org" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>XRPL EVM RPC <ExternalLink style={{ width: '11px', height: '11px', color: '#475569' }} /></a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
