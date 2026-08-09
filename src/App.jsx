import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OperationsMap from './components/OperationsMap';
import FleetControl from './components/FleetControl';
import FobBaseStation from './components/FobBaseStation';
import HeavyLogisticsUSV from './components/HeavyLogisticsUSV';
import DroneSchematics from './components/DroneSchematics';
import CommandTerminal from './components/CommandTerminal';
import CertificateModal from './components/CertificateModal';
import XRPLPanel from './components/XRPLPanel';
import FuelCycleTracker from './components/FuelCycleTracker';
import RadiationMonitor from './components/RadiationMonitor';
import ZrtFaucetPanel from './components/ZrtFaucetPanel';

import { xrplService } from './services/xrplService';
import { soundEffects } from './services/audioService';

export default function App() {
  // Robotic Fleet State
  const [fleet, setFleet] = useState([
    {
      id: 'SPIDER-01',
      type: 'SPIDER',
      status: 'SCANNING',
      battery: 88,
      radUSv: 14.2,
      orePurity: 0.85,
      x: 240,
      y: 260,
      depth: 240
    },
    {
      id: 'SPIDER-02',
      type: 'SPIDER',
      status: 'MINING',
      battery: 74,
      radUSv: 18.5,
      orePurity: 1.15,
      x: 310,
      y: 340,
      depth: 180
    },
    {
      id: 'ROVER-ALPHA',
      type: 'ROVER',
      status: 'MINING',
      battery: 92,
      radUSv: 8.4,
      orePurity: 0.45,
      x: 410,
      y: 210,
      depth: 0
    },
    {
      id: 'ROVER-BETA',
      type: 'ROVER',
      status: 'STANDBY',
      battery: 96,
      radUSv: 2.1,
      orePurity: 0.12,
      x: 580,
      y: 180,
      depth: 0
    },
    {
      id: 'UAS-QUAD-01',
      type: 'DRONE',
      status: 'PATROLLING',
      battery: 65,
      radUSv: 3.2,
      orePurity: 0.0,
      x: 720,
      y: 120,
      depth: -120
    },
    {
      id: 'GROUND-GEIGER-01',
      type: 'SENSOR',
      status: 'TRANSMITTING',
      battery: 100,
      radUSv: 1.8,
      orePurity: 0.0,
      x: 480,
      y: 350,
      depth: 0
    }
  ]);

  const [selectedUnit, setSelectedUnit] = useState(fleet[0]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certModalData, setCertModalData] = useState(null);
  const [activeDashboard, setActiveDashboard] = useState('FAUCET'); // 'MINING' | 'FAUCET'

  // Periodic Telemetry Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setFleet(prevFleet => {
        return prevFleet.map(unit => {
          // Slight position jitter simulating autonomous navigation
          const dx = (Math.random() - 0.5) * 3;
          const dy = (Math.random() - 0.5) * 3;
          const newX = Math.max(50, Math.min(850, unit.x + dx));
          const newY = Math.max(50, Math.min(430, unit.y + dy));

          // Radiation subtle pulse
          const radDelta = (Math.random() - 0.5) * 0.4;
          const newRad = Math.max(0.5, parseFloat((unit.radUSv + radDelta).toFixed(2)));

          // Battery slow drain
          const newBat = Math.max(10, unit.battery - 0.05);

          return {
            ...unit,
            x: newX,
            y: newY,
            radUSv: newRad,
            battery: Math.round(newBat)
          };
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Compute average fleet radiation
  const avgRadiation = fleet.reduce((acc, u) => acc + u.radUSv, 0) / fleet.length;

  const handleToggleAudio = () => {
    const muted = soundEffects.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleGenerateWallet = async () => {
    const info = await xrplService.generateTestnetWallet();
    setWalletInfo(info);
    soundEffects.playTxConfirmed();
  };

  const handleMineOreBatch = async (unit) => {
    soundEffects.playClick(1000);
    const minedTx = await xrplService.tokenizeUraniumBatch({
      roverId: unit.id,
      oreWeightKg: 200 + Math.floor(Math.random() * 300),
      gradePurity: unit.orePurity || 0.65,
      radiationUSv: unit.radUSv,
      coords: { lat: (34.5 + unit.x / 10000).toFixed(4), lng: (-115.8 - unit.y / 10000).toFixed(4) },
      depositType: unit.type === 'SPIDER' ? 'SUBSURFACE_SHAFT_VOID' : 'SURFACE_PIT'
    });

    soundEffects.playTxConfirmed();
    setCertModalData({
      hash: minedTx.hash,
      sequence: minedTx.sequence,
      amount: minedTx.amount,
      unit: unit.id,
      radUSv: unit.radUSv
    });
    setIsCertModalOpen(true);
  };

  const handleScanUnit = (unit) => {
    soundEffects.playClick(850);
    setFleet(prev => prev.map(u => u.id === unit.id ? { ...u, status: 'SCANNING' } : u));
    setTimeout(() => {
      setFleet(prev => prev.map(u => u.id === unit.id ? { ...u, status: 'STANDBY' } : u));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-2 sm:p-4 max-w-7xl mx-auto">
      {/* Top Tactical Header */}
      <Header
        systemStatus={{
          avgRadiation: avgRadiation,
          activeRobots: fleet.length
        }}
        onToggleAudio={handleToggleAudio}
        isAudioMuted={isAudioMuted}
        onGenerateWallet={handleGenerateWallet}
        walletInfo={walletInfo}
      />

      {/* Dashboard Mode Selection Tabs */}
      <div className="flex gap-3 mb-4 font-hud text-xs">
        <button
          onClick={() => {
            soundEffects.playClick(1000);
            setActiveDashboard('FAUCET');
          }}
          className={`flex-1 py-3 rounded-lg border font-bold text-center cursor-pointer transition-all ${
            activeDashboard === 'FAUCET'
              ? 'bg-purple-950/80 border-purple-500 text-purple-300'
              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🪙 ZRT TOKENS FAUCET & TOP-UP PLATFORM
        </button>

        <button
          onClick={() => {
            soundEffects.playClick(1000);
            setActiveDashboard('MINING');
          }}
          className={`flex-1 py-3 rounded-lg border font-bold text-center cursor-pointer transition-all ${
            activeDashboard === 'MINING'
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🛰 URANIUM ROBOTIC EXTRACTION SYSTEM
        </button>
      </div>

      {activeDashboard === 'FAUCET' ? (
        /* 1. ZRT Faucet Dashboard */
        <ZrtFaucetPanel />
      ) : (
        /* 2. Uranium Intelligence Operations Dashboard */
        <>
          {/* Radiation Spectrum & Emergency Lead Shield Control */}
          <RadiationMonitor
            avgRadiation={avgRadiation}
            onShieldToggle={() => setIsShieldActive(!isShieldActive)}
            isShieldActive={isShieldActive}
          />

          {/* Live Tactical Map */}
          <OperationsMap
            fleet={fleet}
            selectedUnit={selectedUnit}
            onSelectUnit={setSelectedUnit}
            onMineOreBatch={handleMineOreBatch}
          />

          {/* Autonomous Fleet Roster Controls */}
          <FleetControl
            fleet={fleet}
            selectedUnit={selectedUnit}
            onSelectUnit={setSelectedUnit}
            onMineOreBatch={handleMineOreBatch}
            onScanUnit={handleScanUnit}
          />

          {/* ERHMS-7 Forward Operating Base (FOB) Station & Satellite Link */}
          <FobBaseStation
            balances={xrplService.balances}
          />

          {/* UO2X Planetary Fuel Command: USV-22 'ARES' Maritime Escort & UF6 Armored Heavy Rail Freight */}
          <HeavyLogisticsUSV />

          {/* Drone Hardware Schematics & X-Ray Scanner (Subsurface Spider Drones + Aerial UAS) */}
          <DroneSchematics
            selectedDroneType={selectedUnit ? selectedUnit.type : 'SPIDER'}
          />

          {/* XRPL Testnet On-Chain Blockchain Hub */}
          <XRPLPanel
            walletInfo={walletInfo}
            fleet={fleet}
          />

          {/* Nuclear Fuel Cycle & IAEA Safeguards Chain of Custody */}
          <FuelCycleTracker
            balances={xrplService.balances}
          />
        </>
      )}

      {/* Real-time Command Terminal & CLI Log Stream */}
      <CommandTerminal />

      {/* Printable IAEA Nuclear Safeguards & XRPL Provenance Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certData={certModalData}
      />

      {/* Tactical Footer */}
      <footer className="glass-panel p-3 text-center text-xs font-hud text-slate-400 border-t border-slate-800">
        <span>URANIUM INTELLIGENCE ECOSYSTEM v2.4</span>
        <span className="mx-2 text-slate-500">•</span>
        <span>CONNECTED TO XRPL TESTNET LEDGER</span>
        <span className="mx-2 text-slate-500">•</span>
        <span>END-TO-END AUTONOMOUS ROBOTIC MINING & PROVENANCE</span>
      </footer>
    </div>
  );
}
