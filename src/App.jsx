import React from 'react';
import Header from './components/Header';
import ZrtFaucetPanel from './components/ZrtFaucetPanel';
import LinkedInProofCard from './components/LinkedInProofCard';
import EVMContractInspector from './components/EVMContractInspector';
import RecruiterCodeShowcase from './components/RecruiterCodeShowcase';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-slate-100 p-4 max-w-6xl mx-auto flex flex-col justify-between font-hud">
      <div className="space-y-6">
        {/* ZRT Cyber HUD Header */}
        <Header />
        
        {/* Main ZRT Multi-Asset Faucet & Flow Map */}
        <ZrtFaucetPanel />

        {/* LinkedIn Recruiter Proof Card Generator */}
        <LinkedInProofCard />

        {/* Live XRPL EVM Smart Contract State Inspector */}
        <EVMContractInspector />

        {/* Recruiter Code Showcase */}
        <RecruiterCodeShowcase />
      </div>

      {/* Footer */}
      <footer className="glass-panel p-4 text-center text-xs font-hud text-slate-400 border-t border-slate-800 mt-12">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>ZRT XRP FAUCET & TACTICAL WEB3 PLATFORM v3.5</span>
          <div className="flex gap-4">
            <a href="https://rpc.testnet.xrplevm.org" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">RPC: rpc.testnet.xrplevm.org</a>
            <a href="https://github.com/zrt219/ZRT-Token-Faucet-" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">GitHub Repository</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
