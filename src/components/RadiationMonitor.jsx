import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Volume2, 
  Zap, 
  AlertTriangle, 
  Radio, 
  Thermometer, 
  Wind, 
  CheckCircle2 
} from 'lucide-react';
import { soundEffects } from '../services/audioService';

export default function RadiationMonitor({ avgRadiation, onShieldToggle, isShieldActive }) {
  const canvasRef = useRef(null);
  const [radHistory, setRadHistory] = useState(Array(40).fill(1.2));

  useEffect(() => {
    // Append current radiation to waveform history
    setRadHistory(prev => {
      const next = [...prev.slice(1), avgRadiation + (Math.random() * 0.4 - 0.2)];
      return next;
    });
  }, [avgRadiation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Oscilloscope background lines
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 15) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Waveform Line
    ctx.beginPath();
    ctx.strokeStyle = avgRadiation > 15 ? '#ff2a5f' : avgRadiation > 5 ? '#ffaa00' : '#00ff9d';
    ctx.lineWidth = 2;

    const step = canvas.width / (radHistory.length - 1);
    radHistory.forEach((val, i) => {
      const x = i * step;
      const normalizedY = canvas.height - Math.min(canvas.height - 5, (val / 30) * canvas.height);
      if (i === 0) ctx.moveTo(x, normalizedY);
      else ctx.lineTo(x, normalizedY);
    });
    ctx.stroke();

    // Waveform fill glow
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fillStyle = avgRadiation > 15 
      ? 'rgba(255, 42, 95, 0.15)' 
      : 'rgba(0, 255, 157, 0.1)';
    ctx.fill();
  }, [radHistory, avgRadiation]);

  const triggerGeigerAudio = () => {
    soundEffects.playGeigerClick();
  };

  return (
    <div className="glass-panel p-4 mb-4 font-hud">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>GEIGER COUNTER & SUBSURFACE RADIOMETRIC SPECTROMETER</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={triggerGeigerAudio}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-amber-300 flex items-center gap-1"
            title="Listen to Geiger Click"
          >
            <Radio className="w-3.5 h-3.5" /> GEIGER CLICK TEST
          </button>
          
          <button
            onClick={() => {
              soundEffects.playClick(1100);
              onShieldToggle();
            }}
            className={`px-3 py-1 rounded border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isShieldActive
                ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-emerald-950 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {isShieldActive ? 'LEAD SHIELD ACTIVE (EMERGENCY)' : 'ACTIVATE LEAD SHIELD'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Current Radiation Dial / Value */}
        <div className="p-3 rounded bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-slate-400 text-xs block mb-1">AVERAGE FLEET DOSIMETER</span>
          <div className={`text-3xl font-bold font-hud ${
            avgRadiation > 15 ? 'text-rose-500 animate-pulse' : avgRadiation > 5 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {avgRadiation.toFixed(2)} <span className="text-sm">µSv/h</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${
              avgRadiation > 15 ? 'bg-rose-500' : avgRadiation > 5 ? 'bg-amber-400' : 'bg-emerald-400'
            }`} />
            <span className="text-slate-300">
              STATUS: {avgRadiation > 15 ? 'CRITICAL HIGH RADIATION' : avgRadiation > 5 ? 'ELEVATED ORE VEIN' : 'SAFE BACKGROUND'}
            </span>
          </div>
        </div>

        {/* Real-time Oscilloscope Canvas */}
        <div className="md:col-span-2 relative rounded border border-slate-800 bg-slate-950 p-2 overflow-hidden">
          <div className="text-[10px] text-slate-400 flex justify-between mb-1">
            <span>REALTIME GAMMA SPECTROMETER WAVEFORM</span>
            <span className="text-emerald-400">SAMPLING: 100 Hz</span>
          </div>
          <canvas
            ref={canvasRef}
            width={500}
            height={80}
            className="w-full h-[80px] block"
          />
        </div>
      </div>
    </div>
  );
}
