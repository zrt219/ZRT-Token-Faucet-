import React, { useState } from 'react';
import { 
  Bug, 
  Plane, 
  Truck, 
  Scan, 
  Radio, 
  Layers, 
  Zap, 
  Crosshair, 
  ShieldCheck, 
  Eye, 
  Maximize2,
  FileText
} from 'lucide-react';
import { soundEffects } from '../services/audioService';

export default function DroneSchematics({ selectedDroneType = 'SPIDER' }) {
  const [activeTab, setActiveTab] = useState(selectedDroneType); // 'SPIDER' | 'AERIAL' | 'ROVER'
  const [xrayActive, setXrayActive] = useState(true);

  const droneSpecs = {
    SPIDER: {
      name: "U-DRONE SP1-UR",
      subtitle: "SUBSURFACE PROSPECTING & INSPECTION SPIDER DRONE",
      mass: "85 kg",
      dims: "L 1.2m x W 0.9m x H 0.45m",
      locomotion: "8-Leg Articulated System w/ Harmonic Drive",
      payload: "Pulsed X-Ray Source, Multi-Spectral Optics, Gamma/Neutron Detector, 360° LiDAR",
      comms: "Tether Umbilical (Fiber/Power) + UHF Mesh Relay",
      speed: "0 - 0.25 m/s",
      notes: "Navigates confined subterranean voids & fractured rock. Penetrates up to 1.5m of dense ore body with pulsed X-Ray density imaging.",
      color: "text-cyan-400",
      border: "border-cyan-500/40"
    },
    AERIAL: {
      name: "ISR AERIAL RECON UAS-4",
      subtitle: "IN-SITU RECOVERY FIELD MONITORING DRONE",
      mass: "14.5 kg",
      dims: "Rotor Span: 1.1m",
      locomotion: "Hexa-Rotor Brushless Drive w/ RTK GPS",
      payload: "Hyperspectral Imager, Magnetometer, LiDAR DTM/DSM, Weather Station",
      comms: "900MHz / 2.4GHz Line-of-Sight Mesh Link",
      speed: "0 - 18 m/s",
      notes: "Monitors injection & recovery wells, surface clay alteration, and real-time groundwater flow vectors in ISR uranium wellfields.",
      color: "text-emerald-400",
      border: "border-emerald-500/40"
    },
    ROVER: {
      name: "URSA-7 HEAVY ROVER",
      subtitle: "AUTONOMOUS CONVOY ESCORT & CONTAINER INSPECTION PLATFORM",
      mass: "3200 kg",
      dims: "L 3.6m x W 2.4m x H 2.6m",
      locomotion: "6-Wheel Independent Suspension w/ All-Wheel Steer",
      payload: "360° PTZ EO/IR Camera, 6-DOF Inspection Arm, Gamma/Neutron Spectrometer, Tamper Verification",
      comms: "UHF / SATCOM Dual Band Data Link",
      speed: "0 - 25 km/h",
      notes: "Provides perimeter security and on-chain verification for UN 2978 Yellowcake transport containers.",
      color: "text-amber-400",
      border: "border-amber-500/40"
    }
  };

  const current = droneSpecs[activeTab] || droneSpecs.SPIDER;

  return (
    <div className="glass-panel p-4 mb-4 font-hud">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Scan className="w-5 h-5 text-cyan-400" />
          <span>ROBOTIC HARDWARE SPECIFICATIONS & SUBSURFACE X-RAY DENSITY SYSTEM</span>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playClick(800);
              setActiveTab('SPIDER');
            }}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all font-bold ${
              activeTab === 'SPIDER'
                ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 box-glow-cyan'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bug className="w-4 h-4" /> U-DRONE SP1-UR (SPIDER)
          </button>

          <button
            onClick={() => {
              soundEffects.playClick(800);
              setActiveTab('AERIAL');
            }}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all font-bold ${
              activeTab === 'AERIAL'
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 box-glow-green'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Plane className="w-4 h-4" /> ISR AERIAL RECON (UAS)
          </button>

          <button
            onClick={() => {
              soundEffects.playClick(800);
              setActiveTab('ROVER');
            }}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all font-bold ${
              activeTab === 'ROVER'
                ? 'bg-amber-950 border border-amber-500 text-amber-300 glow-amber'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" /> URSA-7 HEAVY ROVER
          </button>
        </div>
      </div>

      {/* Main Spec & Interactive Schematic View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left: Spec Sheet */}
        <div className="glass-panel p-4 bg-slate-950/80">
          <div className="border-b border-slate-800 pb-2 mb-3">
            <span className="text-[10px] text-slate-500 block">HARDWARE PLATFORM:</span>
            <h3 className={`text-lg font-bold ${current.color}`}>{current.name}</h3>
            <p className="text-[11px] text-slate-400">{current.subtitle}</p>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">TOTAL MASS:</span>
              <span className="font-bold text-white">{current.mass}</span>
            </div>

            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">DIMENSIONS:</span>
              <span className="font-bold text-white">{current.dims}</span>
            </div>

            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">LOCOMOTION:</span>
              <span className="font-bold text-cyan-300 text-[11px]">{current.locomotion}</span>
            </div>

            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">MAX SPEED:</span>
              <span className="font-bold text-emerald-400">{current.speed}</span>
            </div>

            <div className="border-b border-slate-900 pb-1">
              <span className="text-slate-400 block mb-0.5">PAYLOAD PACKAGE:</span>
              <span className="font-bold text-amber-300 text-[11px] block">{current.payload}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">MISSION PROFILE & NOTES:</span>
              <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800 leading-relaxed">
                {current.notes}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Interactive Schematic & Sensor Simulation View */}
        <div className="lg:col-span-2 glass-panel p-4 bg-slate-950 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              LIVE TELEMETRY & X-RAY DENSITY SCANNER OVERLAY
            </span>
            <button
              onClick={() => {
                soundEffects.playClick(900);
                setXrayActive(!xrayActive);
              }}
              className={`px-3 py-1 rounded text-xs border font-bold flex items-center gap-1 transition-all ${
                xrayActive ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> PULSED X-RAY SCAN {xrayActive ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Schematic Canvas View Simulation */}
          <div className="relative rounded border border-slate-800 bg-black/90 p-4 h-[240px] flex items-center justify-center overflow-hidden">
            {/* Grid Scanline */}
            <div className="animate-scanline" />

            {/* Render Visual based on Active Tab */}
            {activeTab === 'SPIDER' && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Spider Drone Wireframe Icon */}
                <div className="relative flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-cyan-400/80 flex items-center justify-center animate-pulse box-glow-cyan">
                    <Bug className="w-10 h-10 text-cyan-300" />
                  </div>
                  {/* 8 Legs Lines radiating */}
                  <div className="absolute w-36 h-36 border border-dashed border-cyan-500/30 rounded-full animate-radar" />
                </div>

                {/* X-Ray Density Layer Overlay */}
                {xrayActive && (
                  <div className="absolute bottom-2 inset-x-8 h-20 bg-gradient-to-t from-amber-500/30 via-emerald-500/20 to-transparent rounded border border-amber-500/40 p-2 flex items-center justify-between text-[10px] text-amber-300 font-mono">
                    <div>
                      <span className="block font-bold">X-RAY DENSITY COMPOSITE MAP:</span>
                      <span>DENSITY RANGE: 1.0 - 3.2 g/cc (URANIUM-BEARING ZONE CONFIRMED)</span>
                    </div>
                    <span className="px-2 py-1 bg-amber-950 rounded border border-amber-500 text-amber-400 font-bold">
                      U-238 GRADE: 0.85%
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'AERIAL' && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full border-2 border-emerald-400/80 flex items-center justify-center animate-pulse box-glow-green">
                  <Plane className="w-12 h-12 text-emerald-300" />
                </div>
                <div className="absolute inset-x-4 top-4 text-[10px] text-emerald-400 flex justify-between font-mono">
                  <span>ALTITUDE: 120m AGL</span>
                  <span>HYPERSPECTRAL BAND: SWIR 2.2µm (CLAY ALTERATION)</span>
                </div>
              </div>
            )}

            {activeTab === 'ROVER' && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-lg border-2 border-amber-400/80 flex items-center justify-center box-glow-amber">
                  <Truck className="w-12 h-12 text-amber-300" />
                </div>
                <div className="absolute bottom-2 text-[10px] text-amber-300 font-mono">
                  CONTAINER TAMPER SEAL VERIFIED | XRPL PROVENANCE #NFT-8891
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-between text-[10px] text-slate-400">
            <span>HARDWARE COMPLIANCE: IAEA SAFEGUARDS ANNEX II</span>
            <span className="text-cyan-400">XRPL DIRECT LEDGER METADATA MEMO EMBEDDED</span>
          </div>
        </div>

      </div>
    </div>
  );
}
