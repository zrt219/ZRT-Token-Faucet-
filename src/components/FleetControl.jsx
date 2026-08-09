import React from 'react';
import { 
  Bot, 
  Battery, 
  Radio, 
  Activity, 
  Compass, 
  Shield, 
  Pickaxe, 
  Sparkles,
  Zap
} from 'lucide-react';
import { soundEffects } from '../services/audioService';

export default function FleetControl({ fleet, selectedUnit, onSelectUnit, onMineOreBatch, onScanUnit }) {
  return (
    <div className="glass-panel p-4 mb-4">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 font-hud text-sm font-bold text-white">
          <Bot className="w-4 h-4 text-emerald-400" />
          <span>AUTONOMOUS ROBOTIC MINING & SENSOR FLEET</span>
        </div>
        <span className="text-xs font-hud text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          {fleet.filter(u => u.status !== 'CHARGING').length}/{fleet.length} ONLINE
        </span>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {fleet.map((unit) => {
          const isSelected = selectedUnit && selectedUnit.id === unit.id;

          return (
            <div
              key={unit.id}
              onClick={() => {
                soundEffects.playClick(850);
                onSelectUnit(unit);
              }}
              className={`p-3 rounded-lg border transition-all cursor-pointer font-hud text-xs ${
                isSelected
                  ? 'bg-slate-900/90 border-emerald-500 box-glow-green'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              {/* Unit Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    unit.status === 'MINING' ? 'bg-amber-400 animate-pulse' :
                    unit.status === 'SCANNING' ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'
                  }`} />
                  <span className="font-bold text-white text-sm">{unit.id}</span>
                </div>
                <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {unit.type}
                </span>
              </div>

              {/* Status & Telemetry */}
              <div className="space-y-1.5 text-slate-300 mb-3">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">ACTION:</span>
                  <span className={`font-bold ${
                    unit.status === 'MINING' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {unit.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">RAD LEVEL:</span>
                  <span className="text-amber-300 font-bold">{unit.radUSv} µSv/h</span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">ORE GRADE:</span>
                  <span className="text-cyan-300 font-bold">{unit.orePurity}% U3O8</span>
                </div>

                {/* Battery bar */}
                <div className="pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="flex items-center gap-1">
                      <Battery className="w-3 h-3 text-emerald-400" /> BATTERY
                    </span>
                    <span>{unit.battery}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full transition-all ${
                        unit.battery > 50 ? 'bg-emerald-500' : unit.battery > 20 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${unit.battery}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEffects.playClick(900);
                    onScanUnit(unit);
                  }}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 flex items-center justify-center gap-1"
                >
                  <Activity className="w-3 h-3 text-cyan-400" /> SCAN
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEffects.playClick(1100);
                    onMineOreBatch(unit);
                  }}
                  className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-[10px] text-emerald-300 flex items-center justify-center gap-1 font-bold"
                >
                  <Pickaxe className="w-3 h-3 text-emerald-400" /> MINT XRPL
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
