import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Sun, 
  Wind, 
  Battery, 
  Radio, 
  Wifi, 
  AlertTriangle, 
  Satellite, 
  Zap, 
  ShieldCheck, 
  Activity, 
  HardDrive,
  RefreshCw,
  Anchor
} from 'lucide-react';
import { soundEffects } from '../services/audioService';

export default function FobBaseStation({ balances }) {
  const [activeRoom, setActiveRoom] = useState('COMMS'); // 'COMMS' | 'POWER' | 'WORKSTATION' | 'DOCK' | 'SENSORS'
  const [satUplinkProgress, setSatUplinkProgress] = useState(78);
  const [isScanningSat, setIsScanningSat] = useState(false);

  // FOB Power & Environmental Telemetry State
  const [fobStats, setFobStats] = useState({
    solarPowerKw: 4.2,
    windPowerKw: 2.8,
    batteryBankPct: 94,
    generatorStatus: 'STANDBY (72h Reserve)',
    radon222Bq: 18.4,
    airParticulatesPm: 12.1,
    soilWaterUraniumPpb: 4.8,
    windSpeedKmh: 24,
    windDirection: 'NNW 335°',
    tempC: 22.4,
    humidityPct: 32
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFobStats(prev => ({
        ...prev,
        solarPowerKw: parseFloat((4.0 + Math.random() * 0.6).toFixed(2)),
        windPowerKw: parseFloat((2.5 + Math.random() * 0.8).toFixed(2)),
        radon222Bq: parseFloat((18.0 + Math.random() * 1.2).toFixed(1)),
        windSpeedKmh: Math.round(22 + Math.random() * 6)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleExecuteSatPass = () => {
    soundEffects.playClick(1000);
    setIsScanningSat(true);
    setSatUplinkProgress(0);

    const interval = setInterval(() => {
      setSatUplinkProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanningSat(false);
          soundEffects.playTxConfirmed();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="glass-panel p-4 mb-4 font-hud">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Building2 className="w-5 h-5 text-amber-400" />
          <span>ENVIRONMENTAL RESPONSE & HAZARD MONITORING STATION (ERHMS-7 FOB BASE)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2.5 py-1 rounded flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            SATCOM PRIMARY: LINK ACTIVE (-68 dBm)
          </span>

          <button
            onClick={handleExecuteSatPass}
            disabled={isScanningSat}
            className="tactical-btn-cyan text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Satellite className="w-4 h-4" />
            {isScanningSat ? 'DOWNLINKING SAR PASS...' : 'TRIGGER ORBITAL SAR PASS'}
          </button>
        </div>
      </div>

      {/* Grid Layout: Left (Orbital Satellite & Satcom Link), Right (FOB Station Floor Plan & Power) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* 1. Satellite & Comms Uplink Card */}
        <div className="glass-panel p-4 bg-slate-950/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>ORBITAL SURVEILLANCE & SIGINT RELAY</span>
              </div>
              <span className="text-[10px] text-slate-400">SATCOM-10m MAST</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">ACTIVE SATELLITE:</span>
                <span className="text-cyan-400 font-bold">ORBITAL SAR-SWIR SAT-01</span>
              </div>

              <div className="bg-slate-900/80 p-2 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">UPLINK FREQUENCY:</span>
                <span className="text-emerald-400 font-bold">14.25 GHz (Ku-Band)</span>
              </div>

              <div className="bg-slate-900/80 p-2 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">TELEMETRY LATENCY:</span>
                <span className="text-white font-bold">42 ms</span>
              </div>

              {/* Sat Imaging Downlink Progress */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>SAR HYPERSPECTRAL DOWNLINK FRAME</span>
                  <span className="text-cyan-400 font-bold">{satUplinkProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-cyan-400 transition-all duration-300 box-glow-cyan"
                    style={{ width: `${satUplinkProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>IAEA SAFEGUARDS LOGS SAVED</span>
            <span className="text-emerald-400">60 DAYS LOCAL BUFFER</span>
          </div>
        </div>

        {/* 2. FOB Hybrid Power & Environmental Sensors */}
        <div className="glass-panel p-4 bg-slate-950/80">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>FOB HYBRID POWER & ENVIRONMENT SUITE</span>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-950 border border-amber-500/30 px-2 py-0.5 rounded">
              72H AUTONOMY
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" /> SOLAR INPUT
              </span>
              <span className="text-amber-400 font-bold text-sm">{fobStats.solarPowerKw} kW</span>
            </div>

            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <Wind className="w-3 h-3 text-cyan-400" /> WIND TURBINE
              </span>
              <span className="text-cyan-400 font-bold text-sm">{fobStats.windPowerKw} kW</span>
            </div>

            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <Battery className="w-3 h-3 text-emerald-400" /> LiFePO4 BANK
              </span>
              <span className="text-emerald-400 font-bold text-sm">{fobStats.batteryBankPct}%</span>
            </div>

            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" /> RADON-222
              </span>
              <span className="text-purple-400 font-bold text-sm">{fobStats.radon222Bq} Bq/m³</span>
            </div>
          </div>

          <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">PARTICULATE AIR SAMPLER:</span>
              <span className="text-emerald-400 font-bold">PM2.5: {fobStats.airParticulatesPm} µg/m³</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">SOIL/WATER PROBE:</span>
              <span className="text-cyan-400 font-bold">Uranium: {fobStats.soilWaterUraniumPpb} ppb</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">WIND & WEATHER:</span>
              <span className="text-white">{fobStats.windSpeedKmh} km/h ({fobStats.windDirection})</span>
            </div>
          </div>
        </div>

        {/* 3. Station Floor Plan & Automated Drone Dock */}
        <div className="glass-panel p-4 bg-slate-950/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <Anchor className="w-4 h-4 text-emerald-400" />
                <span>ERHMS-7 FLOOR PLAN & DRONE DOCK</span>
              </div>
              <span className="text-[10px] text-emerald-400">AUTO-CHARGE & DATA OFFLOAD</span>
            </div>

            {/* Interactive Floor Plan Selector */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px] mb-3">
              {[
                { id: 'COMMS', name: 'COMMS ROOM' },
                { id: 'POWER', name: 'POWER MODULE' },
                { id: 'WORKSTATION', name: 'OPS WORKSTATION' },
                { id: 'DOCK', name: 'DRONE DOCK' },
                { id: 'SENSORS', name: 'SENSOR SUITE' },
                { id: 'DECON', name: 'DECON STEP' }
              ].map(room => (
                <button
                  key={room.id}
                  onClick={() => {
                    soundEffects.playClick(750);
                    setActiveRoom(room.id);
                  }}
                  className={`p-1.5 rounded text-[10px] border text-center transition-all ${
                    activeRoom === room.id
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {room.name}
                </button>
              ))}
            </div>

            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs text-slate-300">
              <div className="text-emerald-400 font-bold mb-1">SECTION: {activeRoom}</div>
              {activeRoom === 'DOCK' && (
                <p className="text-[11px] text-slate-400">
                  Inductive fast-charge pad active. Automatic high-speed optical data offload to XRPL node buffer. Weather shield auto-deploys if wind exceeds 80 km/h.
                </p>
              )}
              {activeRoom === 'COMMS' && (
                <p className="text-[11px] text-slate-400">
                  Houses 10m communications mast transceiver, encrypted VHF/UHF mesh modem, and primary Satcom Ku-band terminal.
                </p>
              )}
              {activeRoom === 'POWER' && (
                <p className="text-[11px] text-slate-400">
                  LiFePO4 battery bank with 72-hour autonomy. Automated diesel generator backup auto-starts if total battery drops below 20%.
                </p>
              )}
              {activeRoom !== 'DOCK' && activeRoom !== 'COMMS' && activeRoom !== 'POWER' && (
                <p className="text-[11px] text-slate-400">
                  Radiation hardened workstation & continuous environmental monitor suite. Sealed IP66 aluminum housing.
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 text-[10px] text-slate-500 text-center">
            Designed for harsh climates (-40°C to +50°C) | ISO Container Transportable
          </div>
        </div>

      </div>
    </div>
  );
}
