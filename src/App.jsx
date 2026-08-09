import React from 'react';
import Header from './components/Header';
import SimpleFaucet from './components/SimpleFaucet';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-slate-100 p-4 max-w-6xl mx-auto flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <Header />
        
        {/* Main Faucet Portal */}
        <SimpleFaucet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
