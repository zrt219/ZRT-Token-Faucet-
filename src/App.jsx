import React from 'react';
import Header from './components/Header';
import SimpleFaucet from './components/SimpleFaucet';
import Footer from './components/Footer';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#f8fafc', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ flex: '1 0 auto' }}>
        {/* Top Header */}
        <Header />
        
        {/* Main Faucet Landing Card */}
        <SimpleFaucet />
      </div>

      {/* Footer with User Links */}
      <Footer />
    </div>
  );
}
