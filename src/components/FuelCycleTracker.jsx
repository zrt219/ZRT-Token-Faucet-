import React, { useState } from 'react';
import { 
  Compass, 
  Pickaxe, 
  Factory, 
  Database, 
  Truck, 
  ShieldCheck, 
  Flame, 
  CheckCircle2, 
  FileCheck,
  Zap,
  Layers
} from 'lucide-react';
import { soundEffects } from '../services/audioService';

export default function FuelCycleTracker({ balances }) {
  const [activeStep, setActiveStep] = useState(3);

  const steps = [
    {
      id: 1,
      title: "1. ORBITAL PROSPECTING",
      icon: Compass,
      desc: "SAR & SWIR satellite sensors detect radiometric surface anomalies",
      status: "COMPLETED",
      details: "Resolution: 0.5m/px | Radiometric Map ID: #SWIR-9921"
    },
    {
      id: 2,
      title: "2. ROBOTIC EXTRACTION",
      icon: Pickaxe,
      desc: "Autonomous surface rovers & spider drones mine unconformity ore",
      status: "COMPLETED",
      details: "Current Fleet: 4 Active Units | Depth: 0 - 240m"
    },
    {
      id: 3,
      title: "3. MILLING (YELLOWCAKE)",
      icon: Factory,
      desc: "Leaching & precipitation into U3O8 concentrate yellowcake",
      status: "IN PROGRESS",
      details: `Active Reserve: ${balances.U3O8} kg Yellowcake`
    },
    {
      id: 4,
      title: "4. XRPL TOKENIZATION",
      icon: Database,
      desc: "Minting cryptographic U3O8 tokens & provenance certificates",
      status: "ACTIVE",
      details: "Ledger Network: XRPL Testnet | Immutable Custody"
    },
    {
      id: 5,
      title: "5. CONVERSION & ENRICHMENT",
      icon: Zap,
      desc: "UF6 gaseous diffusion & isotope centrifuge enrichment",
      status: "SCHEDULED",
      details: `Enriched U-235 Pool: ${balances.U235} kg`
    },
    {
      id: 6,
      title: "6. SECURE TRANSPORT",
      icon: Truck,
      desc: "Tamper-proof smart logistics tracking with real-time GPS & rad sensors",
      status: "MONITORED",
      details: "Transport ID: #TRK-U881 | IAEA Safeguards Compliant"
    }
  ];

  return (
    <div className="glass-panel p-4 mb-4 font-hud">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>URANIUM FUEL CYCLE & XRPL CHAIN OF CUSTODY (IAEA SAFEGUARDS)</span>
        </div>
        <span className="text-xs text-cyan-400 bg-cyan-950 border border-cyan-500/30 px-2.5 py-0.5 rounded">
          NON-PROLIFERATION AUDITED
        </span>
      </div>

      {/* Steps Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;

          return (
            <div
              key={step.id}
              onClick={() => {
                soundEffects.playClick(900);
                setActiveStep(step.id);
              }}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900 border-emerald-500 box-glow-green'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded bg-slate-950 border ${
                    isActive ? 'border-emerald-500 text-emerald-400' : 'border-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                    step.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' :
                    step.status === 'IN PROGRESS' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                    'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {step.status}
                  </span>
                </div>

                <h4 className="text-white font-bold text-xs mb-1">{step.title}</h4>
                <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{step.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-cyan-300">
                {step.details}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
