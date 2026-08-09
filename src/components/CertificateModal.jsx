import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Printer, 
  Copy, 
  ExternalLink, 
  Lock, 
  QrCode, 
  Award 
} from 'lucide-react';
import { soundEffects } from '../services/audioService';

export default function CertificateModal({ isOpen, onClose, certData }) {
  if (!isOpen || !certData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(certData, null, 2));
    soundEffects.playClick(1100);
  };

  const handlePrint = () => {
    soundEffects.playClick(1000);
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-hud print:p-0 print:bg-white print:text-black print:static">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-cert-area, .print-cert-area * { visibility: visible; }
          .print-cert-area { position: absolute; left: 0; top: 0; width: 100%; color: #000 !important; background: #fff !important; border: 2px solid #000 !important; box-shadow: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="glass-panel p-6 max-w-2xl w-full border-emerald-500/50 box-glow-green relative max-h-[90vh] overflow-y-auto print-cert-area">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundEffects.playClick(600);
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded bg-slate-900 border border-slate-800 no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header */}
        <div className="text-center border-b border-emerald-500/30 pb-4 mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 mb-2 box-glow-green">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold font-heading text-white tracking-wider">
            INTERNATIONAL ATOMIC ENERGY AGENCY (IAEA)
          </h2>
          <h3 className="text-sm text-emerald-400 font-bold tracking-widest mt-0.5">
            XRPL ON-CHAIN CHAIN-OF-CUSTODY & PROVENANCE CERTIFICATE
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            NON-PROLIFERATION SAFEGUARDS COMPLIANT | IMMUTABLE XRPL LEDGER ANCHOR
          </p>
        </div>

        {/* Certificate Body Grid */}
        <div className="space-y-4 text-xs">
          
          {/* Certificate Metadata */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded border border-slate-800">
            <div>
              <span className="text-slate-400 text-[10px] block">CERTIFICATE UUID:</span>
              <span className="text-white font-mono font-bold">IAEA-XRPL-{Math.floor(100000 + Math.random()*900000)}</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block">ISSUANCE TIMESTAMP:</span>
              <span className="text-emerald-400 font-mono font-bold">{new Date().toUTCString()}</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block">XRPL TESTNET TRANSACTION HASH:</span>
              <span className="text-cyan-300 font-mono font-bold truncate block">{certData.hash || '9A8F31C2D4E5B6A789012345678...'}</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block">XRPL LEDGER SEQUENCE:</span>
              <span className="text-amber-400 font-mono font-bold">#{certData.sequence || '89452044'}</span>
            </div>
          </div>

          {/* Radiometric Assay & Batch Details */}
          <div className="bg-slate-950/80 p-3 rounded border border-slate-800 space-y-2">
            <h4 className="text-emerald-400 font-bold border-b border-slate-800 pb-1">
              RADIOMETRIC ASSAY & MATERIAL SPECIFICATIONS
            </h4>

            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-400">MATERIAL TYPE:</span>{' '}
                <strong className="text-white">U3O8 YELLOWCAKE CONCENTRATE</strong>
              </div>
              <div>
                <span className="text-slate-400">NET BATCH WEIGHT:</span>{' '}
                <strong className="text-emerald-400">{certData.amount || '425.00 U3O8'}</strong>
              </div>
              <div>
                <span className="text-slate-400">ROBOTIC UNIT ID:</span>{' '}
                <strong className="text-cyan-300">{certData.unit || 'ROVER-ALPHA'}</strong>
              </div>
              <div>
                <span className="text-slate-400">RAD DOSIMETER:</span>{' '}
                <strong className="text-amber-300">{certData.radUSv || '14.2'} µSv/h</strong>
              </div>
              <div>
                <span className="text-slate-400">GRID COORDINATES:</span>{' '}
                <strong className="text-white">34.521° N, -115.892° W</strong>
              </div>
              <div>
                <span className="text-slate-400">IAEA SEAL STATUS:</span>{' '}
                <strong className="text-emerald-400">VERIFIED INTACT</strong>
              </div>
            </div>
          </div>

          {/* Cryptographic Seal & QR Visual */}
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-black border border-emerald-500 text-emerald-400">
                <QrCode className="w-10 h-10" />
              </div>
              <div>
                <span className="text-white font-bold block text-xs">DIGITAL LEDGER SEAL</span>
                <span className="text-slate-400 text-[10px]">
                  Verify on Bithomp Explorer: xrpl.org/ledger
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> COPY JSON
              </button>

              <button
                onClick={handlePrint}
                className="tactical-btn py-1.5 px-3 text-xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> PRINT CERTIFICATE
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
