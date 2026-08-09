import React, { useRef, useEffect, useState } from 'react';
import { 
  Eye, 
  Layers, 
  Target, 
  Radio, 
  Maximize2, 
  Zap, 
  Activity, 
  ShieldAlert,
  Crosshair
} from 'lucide-react';
import { soundEffects } from '../services/audioService';

export default function OperationsMap({ fleet, selectedUnit, onSelectUnit, onMineOreBatch }) {
  const canvasRef = useRef(null);
  const [showRadiationHeatmap, setShowRadiationHeatmap] = useState(true);
  const [showMeshLines, setShowMeshLines] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let scanAngle = 0;
    let satPulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // 1. Background Grid & Terrain
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // Draw mine topography / grid lines
      ctx.strokeStyle = 'rgba(0, 255, 157, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Open Pit Mine Concentric Ellipses (Surface Extraction Area)
      const pitCenterX = w * 0.45;
      const pitCenterY = h * 0.45;
      for (let r = 250; r > 30; r -= 35) {
        ctx.beginPath();
        ctx.ellipse(pitCenterX, pitCenterY, r, r * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 157, ${0.15 + (250 - r) / 1000})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Underground Tunnel Shaft Network (Bottom Left Underground Section)
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(100, h - 30);
      ctx.lineTo(100, h - 220); // vertical shaft
      ctx.lineTo(240, h - 220); // tunnel 1
      ctx.lineTo(320, h - 140); // tunnel 2
      ctx.moveTo(100, h - 140);
      ctx.lineTo(200, h - 140); // branch
      ctx.stroke();

      // Shaft Entry Label
      ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
      ctx.font = '10px "Share Tech Mono"';
      ctx.fillText('[UNDERGROUND 3D VOID & SHAFT 4]', 110, h - 230);

      // 2. Radiation Heatmap Overlay (if enabled)
      if (showRadiationHeatmap) {
        // High radiation vein in underground tunnel
        const radGlow1 = ctx.createRadialGradient(240, h - 220, 5, 240, h - 220, 80);
        radGlow1.addColorStop(0, 'rgba(255, 170, 0, 0.5)');
        radGlow1.addColorStop(0.5, 'rgba(0, 255, 157, 0.2)');
        radGlow1.addColorStop(1, 'transparent');
        ctx.fillStyle = radGlow1;
        ctx.fillRect(160, h - 300, 160, 160);

        // Open pit central radiation anomaly
        const radGlow2 = ctx.createRadialGradient(pitCenterX, pitCenterY, 10, pitCenterX, pitCenterY, 120);
        radGlow2.addColorStop(0, 'rgba(255, 42, 95, 0.4)');
        radGlow2.addColorStop(0.6, 'rgba(255, 170, 0, 0.2)');
        radGlow2.addColorStop(1, 'transparent');
        ctx.fillStyle = radGlow2;
        ctx.fillRect(pitCenterX - 140, pitCenterY - 140, 280, 280);
      }

      // 3. Orbital Surveillance Satellite Beam (Top Right)
      const satX = w * 0.85;
      const satY = 40;
      satPulse += 0.03;

      // Draw Satellite Body
      ctx.fillStyle = '#00e5ff';
      ctx.fillRect(satX - 15, satY - 6, 30, 12);
      ctx.fillStyle = 'rgba(0, 255, 157, 0.8)';
      ctx.fillRect(satX - 35, satY - 4, 18, 8); // solar panel left
      ctx.fillRect(satX + 17, satY - 4, 18, 8); // solar panel right

      // Laser Cone Beam to pit center
      const coneGrad = ctx.createLinearGradient(satX, satY, pitCenterX, pitCenterY);
      coneGrad.addColorStop(0, 'rgba(0, 229, 255, 0.3)');
      coneGrad.addColorStop(1, 'rgba(0, 255, 157, 0.02)');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(satX, satY + 6);
      ctx.lineTo(pitCenterX - 90, pitCenterY);
      ctx.lineTo(pitCenterX + 90, pitCenterY);
      ctx.closePath();
      ctx.fill();

      // Satellite text label
      ctx.fillStyle = 'rgba(0, 229, 255, 0.9)';
      ctx.font = '10px "Share Tech Mono"';
      ctx.fillText('ORBITAL SAR-SWIR SAT-01', satX - 55, satY - 14);

      // 4. Mesh Lines between Fleet Units
      if (showMeshLines && fleet && fleet.length > 0) {
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        for (let i = 0; i < fleet.length; i++) {
          for (let j = i + 1; j < fleet.length; j++) {
            const u1 = fleet[i];
            const u2 = fleet[j];
            ctx.beginPath();
            ctx.moveTo(u1.x, u1.y);
            ctx.lineTo(u2.x, u2.y);
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);
      }

      // 5. Draw Fleet Units (Rovers, Spider Drones, Drones, Sensors)
      if (fleet) {
        scanAngle += 0.02;

        fleet.forEach((unit) => {
          const isSelected = selectedUnit && selectedUnit.id === unit.id;

          // Selection highlight ring
          if (isSelected) {
            ctx.beginPath();
            ctx.arc(unit.x, unit.y, 22, 0, Math.PI * 2);
            ctx.strokeStyle = '#00ff9d';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Animated crosshair corners
            ctx.strokeStyle = '#00e5ff';
            ctx.beginPath();
            ctx.arc(unit.x, unit.y, 28, scanAngle, scanAngle + Math.PI / 2);
            ctx.stroke();
          }

          // Unit Icon / Shape based on type
          if (unit.type === 'ROVER') {
            // Autonomous Rover (Surface)
            ctx.fillStyle = unit.status === 'MINING' ? '#ffaa00' : '#00ff9d';
            ctx.fillRect(unit.x - 10, unit.y - 8, 20, 16);
            // Wheels
            ctx.fillStyle = '#000';
            ctx.fillRect(unit.x - 12, unit.y - 10, 6, 5);
            ctx.fillRect(unit.x + 6, unit.y - 10, 6, 5);
            ctx.fillRect(unit.x - 12, unit.y + 5, 6, 5);
            ctx.fillRect(unit.x + 6, unit.y + 5, 6, 5);
          } else if (unit.type === 'SPIDER') {
            // Subsurface Spider Drone
            ctx.fillStyle = '#00e5ff';
            ctx.beginPath();
            ctx.arc(unit.x, unit.y, 7, 0, Math.PI * 2);
            ctx.fill();
            // Legs
            ctx.strokeStyle = '#00e5ff';
            ctx.lineWidth = 1.5;
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
              ctx.beginPath();
              ctx.moveTo(unit.x, unit.y);
              ctx.lineTo(unit.x + Math.cos(a) * 14, unit.y + Math.sin(a) * 14);
              ctx.stroke();
            }
          } else if (unit.type === 'DRONE') {
            // Aerial Recon Drone
            ctx.fillStyle = '#00e5ff';
            ctx.beginPath();
            ctx.moveTo(unit.x, unit.y - 10);
            ctx.lineTo(unit.x + 10, unit.y + 8);
            ctx.lineTo(unit.x - 10, unit.y + 8);
            ctx.closePath();
            ctx.fill();

            // LiDAR Ping Circle
            ctx.beginPath();
            ctx.arc(unit.x, unit.y, 25 + Math.sin(scanAngle * 3) * 10, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
            ctx.stroke();
          } else {
            // Fixed Ground Sensor
            ctx.fillStyle = '#ffaa00';
            ctx.beginPath();
            ctx.arc(unit.x, unit.y, 6, 0, Math.PI * 2);
            ctx.fill();
          }

          // Unit Name Tag
          ctx.fillStyle = isSelected ? '#ffffff' : '#8493a8';
          ctx.font = '10px "Share Tech Mono"';
          ctx.fillText(`${unit.id} (${unit.radUSv} µSv/h)`, unit.x - 20, unit.y + 24);
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [fleet, selectedUnit, showRadiationHeatmap, showMeshLines]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Check if clicked near a unit
    const clicked = fleet.find(u => Math.hypot(u.x - clickX, u.y - clickY) < 25);
    if (clicked) {
      soundEffects.playClick(900);
      onSelectUnit(clicked);
    } else {
      soundEffects.playClick(600);
      setSelectedLocation({ x: Math.round(clickX), y: Math.round(clickY) });
    }
  };

  return (
    <div className="glass-panel p-4 mb-4">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 font-hud text-xs">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-bold tracking-wider">LIVE TACTICAL MINE MAP & SUB-SURFACE VOID</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">SCALE: 1:500m</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playClick(700);
              setShowRadiationHeatmap(!showRadiationHeatmap);
            }}
            className={`px-3 py-1 rounded border text-xs flex items-center gap-1.5 transition-all ${
              showRadiationHeatmap 
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' 
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            RADIATION HEATMAP {showRadiationHeatmap ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => {
              soundEffects.playClick(700);
              setShowMeshLines(!showMeshLines);
            }}
            className={`px-3 py-1 rounded border text-xs flex items-center gap-1.5 transition-all ${
              showMeshLines 
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            COMMS MESH {showMeshLines ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded border border-slate-800 overflow-hidden bg-slate-950 cursor-crosshair">
        <div className="animate-scanline" />
        <canvas
          ref={canvasRef}
          width={900}
          height={480}
          onClick={handleCanvasClick}
          className="w-full h-auto block"
        />

        {/* Selected Unit Overlay Badge on Map */}
        {selectedUnit && (
          <div className="absolute top-3 left-3 glass-panel p-3 text-xs font-hud max-w-xs border-emerald-500/40">
            <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
              <span>{selectedUnit.id} ({selectedUnit.type})</span>
              <span className="text-slate-400">BATTERY: {selectedUnit.battery}%</span>
            </div>
            <div className="text-slate-300 text-[11px] space-y-0.5">
              <p>STATUS: <span className="text-white font-bold">{selectedUnit.status}</span></p>
              <p>RAD SENSOR: <span className="text-amber-400 font-bold">{selectedUnit.radUSv} µSv/h</span></p>
              <p>ORE GRADE: <span className="text-cyan-400 font-bold">{selectedUnit.orePurity}% U3O8</span></p>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => onMineOreBatch(selectedUnit)}
                className="tactical-btn text-[11px] py-1 px-2 w-full justify-center"
              >
                MINE & MINT ON XRPL
              </button>
            </div>
          </div>
        )}

        {/* Compass Legend Overlay */}
        <div className="absolute bottom-3 right-3 glass-panel px-3 py-1.5 text-[10px] font-hud text-slate-400 flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Surface Rover</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Spider Drone</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Rad Vein</span>
        </div>
      </div>
    </div>
  );
}
