import React from 'react';
import Header from './components/Header';
import SimpleFaucet from './components/SimpleFaucet';
import Footer from './components/Footer';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030303', color: '#f8fafc', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
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
