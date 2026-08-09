import React, { useState, useEffect } from 'react';
import { 
  Ship, 
  Train, 
  ShieldCheck, 
  Anchor, 
  Radio, 
  ArrowRight, 
  AlertTriangle, 
  Compass, 
  Lock,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { xrplService } from '../services/xrplService';
import { soundEffects } from '../services/audioService';
import confetti from 'canvas-confetti';

export default function HeavyLogisticsUSV() {
  const [usvSpeed, setUsvSpeed] = useState(28);
  const [trainStatus, setTrainStatus] = useState('IN TRANSIT (CONVERSION -> ENRICHMENT)');
  const [isHandoffRunning, setIsHandoffRunning] = useState(false);
  const [handoffLog, setHandoffLog] = useState(null);

  // USV & Rail Freight Telemetry State
  const [usvStats, setUsvStats] = useState({
    name: "USV-22 'ARES'",
    mission: "NUCLEAR MARITIME CONVOY ESCORT",
    status: "PERIMETER SECURE",
    radUSv: 1.45,
    seaState: "FORCE 3 (MODERATE)",
    heading: "245° WSW",
    convoyVessels: 4
  });

  const [railStats, setRailStats] = useState({
    trainId: "UF6-FREIGHT-HX77",
    locoSpeed: 64, // km/h
    containerTemp: 18.2, // °C
    cylinderPressure: 1.84, // bar
    geofenceStatus: "LOCKED ON GEOFENCE ROUTE 12-B",
    tamperSeal: "INTACT (HASH VERIFIED)"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setUsvStats(prev => ({
        ...prev,
        radUSv: parseFloat((1.4 + Math.random() * 0.2).toFixed(2))
      }));

      setRailStats(prev => ({
        ...prev,
        locoSpeed: Math.round(62 + Math.random() * 5),
        cylinderPressure: parseFloat((1.82 + Math.random() * 0.04).toFixed(2))
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleTriggerTransitHandoff = async () => {
    soundEffects.playClick(1000);
    setIsHandoffRunning(true);

    try {
      const handoffTx = await xrplService.tokenizeUraniumBatch({
        roverId: "RAIL-HX77-TO-USV22",
        oreWeightKg: 1250, // kg UF6
        gradePurity: 3.5, // 3.5% Low Enriched U-235
        radiationUSv: 2.1,
        coords: { lat: 34.892, lng: -115.102 },
        depositType: 'INTERMODAL_RAIL_MARITIME_TRANSIT'
      });

      setHandoffLog(handoffTx);
      soundEffects.playTxConfirmed();

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00ff9d', '#00e5ff', '#ffaa00']
      });
    } catch (e) {
      console.error("Handoff error:", e);
    } finally {
      setIsHandoffRunning(false);
    }
  };

  return (
    <div className="glass-panel p-4 mb-4 font-hud">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Ship className="w-5 h-5 text-cyan-400" />
          <span>UO2X PLANETARY FUEL COMMAND: MARITIME USV & ARMORED HEAVY RAIL FREIGHT</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 bg-amber-950 border border-amber-500/30 px-2.5 py-1 rounded flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> GEOFENCED NUCLEAR FREIGHT CORRIDOR
          </span>

          <button
            onClick={handleTriggerTransitHandoff}
            disabled={isHandoffRunning}
            className="tactical-btn py-1.5 px-3 text-xs flex items-center gap-1.5"
          >
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            {isHandoffRunning ? 'RECORDING TRANSIT HANDOFF...' : 'MINT RAIL-TO-MARITIME HANDOFF ON XRPL'}
          </button>
        </div>
      </div>

      {/* Main Grid: Left (USV-22 Maritime Escort), Right (Armored Heavy Rail Freight) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 1. USV-22 'ARES' Maritime Escort Vessel */}
        <div className="glass-panel p-4 bg-slate-950/80 glass-panel-cyan border-cyan-500/30">
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-3">
            <div>
              <span className="text-[10px] text-slate-400 block">UNMANNED SURFACE VESSEL:</span>
              <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <Ship className="w-4 h-4 text-cyan-400" /> {usvStats.name}
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
              {usvStats.status}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 mb-3">
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">MISSION PROFILE:</span>
              <span className="text-white font-bold text-[11px]">{usvStats.mission}</span>
            </div>

            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">CRUISING SPEED:</span>
              <span className="text-cyan-400 font-bold">{usvSpeed} KNOTS (AESA RADAR LOCK)</span>
            </div>

            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">WATER DOSIMETER:</span>
              <span className="text-amber-300 font-bold">{usvStats.radUSv} µSv/h</span>
            </div>

            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">ESCORTEES:</span>
              <span className="text-emerald-400 font-bold">{usvStats.convoyVessels} CARGO FREIGHTERS</span>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>EO/IR TURRET: ACTIVE PATROL</span>
            <span className="text-cyan-300 font-bold">HEADING: {usvStats.heading}</span>
          </div>
        </div>

        {/* 2. Armored Heavy Rail Freight (UF6 HX-77) */}
        <div className="glass-panel p-4 bg-slate-950/80 glass-panel-amber border-amber-500/30">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-3">
            <div>
              <span className="text-[10px] text-slate-400 block">HEAVY RAIL FREIGHT:</span>
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Train className="w-4 h-4 text-amber-400" /> {railStats.trainId}
              </h3>
            </div>
            <span className="text-[10px] text-amber-300 bg-amber-950 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
              {trainStatus}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 mb-3">
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">LOCOMOTIVE SPEED:</span>
              <span className="text-amber-400 font-bold">{railStats.locoSpeed} KM/H</span>
            </div>

            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">UF6 CYLINDER PRESSURE:</span>
              <span className="text-emerald-400 font-bold">{railStats.cylinderPressure} BAR (STABLE)</span>
            </div>

            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">CONTAINER TEMP:</span>
              <span className="text-cyan-300 font-bold">{railStats.containerTemp} °C</span>
            </div>

            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-400">TAMPER SEAL SENSOR:</span>
              <span className="text-emerald-400 font-bold">{railStats.tamperSeal}</span>
            </div>
          </div>

          {/* Render Last Handoff Hash if available */}
          {handoffLog ? (
            <div className="bg-emerald-950/60 p-2 rounded border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> TRANSIT HANDOFF VALIDATED:
              </span>
              <span className="font-mono text-[10px] text-cyan-300">{handoffLog.hash.substring(0, 14)}...</span>
            </div>
          ) : (
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-slate-400 text-center">
              Ready for Intermodal Rail-to-Maritime Ledger Handoff
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
