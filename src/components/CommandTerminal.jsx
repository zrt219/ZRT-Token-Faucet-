import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Cpu, 
  Radio, 
  Zap, 
  Filter,
  Trash2
} from 'lucide-react';
import { soundEffects } from '../services/audioService';
import { xrplService } from '../services/xrplService';

export default function CommandTerminal({ onExecuteCommand }) {
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), category: 'SYSTEM', msg: 'Uranium Intelligence Ecosystem initialized. XRPL Testnet node linked.', type: 'info' },
    { id: 2, time: new Date(Date.now() - 30000).toLocaleTimeString(), category: 'ROBOTICS', msg: 'SPIDER-01 completed subsurface 3D void scan at Shaft 4 (Depth 240m).', type: 'success' },
    { id: 3, time: new Date(Date.now() - 60000).toLocaleTimeString(), category: 'XRPL_CHAIN', msg: 'Issued Asset Mint (U3O8 Token) confirmed. Tx: 9A8F31C2D4E5...', type: 'cyan' },
    { id: 4, time: new Date(Date.now() - 90000).toLocaleTimeString(), category: 'SATELLITE', msg: 'Orbital SAR-SWIR SAT-01 pass completed. Radiometric anomaly map #SWIR-9921 updated.', type: 'info' }
  ]);

  const [inputCmd, setInputCmd] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const terminalContainerRef = useRef(null);

  useEffect(() => {
    // Listen for XRPL tx events to push into live log
    const unsubscribe = xrplService.subscribe((event) => {
      if (event.type === 'TX_SUBMITTED') {
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          category: 'XRPL_CHAIN',
          msg: `ON-CHAIN MINING MINT: ${event.tx.amount} | Memo: ${event.tx.memo.substring(0, 45)}...`,
          type: 'cyan'
        };
        setLogs(prev => [...prev, newLog]);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!inputCmd.trim()) return;

    soundEffects.playClick(900);
    const userMsg = inputCmd.trim();
    const timeStr = new Date().toLocaleTimeString();

    // Push user command
    const userLog = {
      id: Date.now(),
      time: timeStr,
      category: 'CMD_INPUT',
      msg: `> ${userMsg}`,
      type: 'user'
    };

    setLogs(prev => [...prev, userLog]);
    setInputCmd('');

    // Process commands
    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let responseMsg = '';
      let respType = 'info';

      if (lower.includes('/help')) {
        responseMsg = 'Available Commands: /scan, /faucet, /mint, /shield, /status, /clear';
      } else if (lower.includes('/scan')) {
        responseMsg = 'Initiating full fleet radiometric & LiDAR radar sweep across surface & subterranean shafts...';
        respType = 'success';
      } else if (lower.includes('/faucet')) {
        responseMsg = 'Requesting XRPL Testnet Faucet allocation (1,000 XRP)...';
        respType = 'cyan';
      } else if (lower.includes('/shield')) {
        responseMsg = 'Toggling emergency subterranean lead-shield protocols...';
        respType = 'warning';
      } else if (lower.includes('/status')) {
        responseMsg = 'SYSTEM STATUS: All 6 Fleet Units Operational | XRPL WS: Connected | IAEA Audit: Pass';
        respType = 'success';
      } else if (lower.includes('/clear')) {
        setLogs([]);
        return;
      } else {
        responseMsg = `Executing tactical script: "${userMsg}". AI Threat Score: 0.02 (NORMAL)`;
      }

      setLogs(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          time: new Date().toLocaleTimeString(),
          category: 'AI_COMMAND_CORE',
          msg: responseMsg,
          type: respType
        }
      ]);
    }, 400);
  };

  const filteredLogs = activeFilter === 'ALL' 
    ? logs 
    : logs.filter(l => l.category === activeFilter);

  return (
    <div className="glass-panel p-4 mb-4 font-hud">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>TACTICAL COMMAND TERMINAL & REAL-TIME LOG STREAM</span>
        </div>

        {/* Log Filter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {['ALL', 'XRPL_CHAIN', 'ROBOTICS', 'SATELLITE'].map(filter => (
            <button
              key={filter}
              onClick={() => {
                soundEffects.playClick(700);
                setActiveFilter(filter);
              }}
              className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                activeFilter === filter
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}

          <button
            onClick={() => setLogs([])}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 ml-1"
            title="Clear Terminal Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Window */}
      <div ref={terminalContainerRef} className="bg-black/95 rounded border border-slate-800 p-3 h-[180px] overflow-y-auto font-mono text-xs mb-3 space-y-1">
        {filteredLogs.map(log => (
          <div key={log.id} className="flex items-start gap-2 leading-relaxed">
            <span className="text-slate-400 text-[10px]">[{log.time}]</span>
            <span className={`text-[10px] px-1 rounded font-bold ${
              log.category === 'XRPL_CHAIN' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30' :
              log.category === 'ROBOTICS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
              log.category === 'CMD_INPUT' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
              'bg-slate-900 text-slate-400 border border-slate-800'
            }`}>
              {log.category}
            </span>
            <span className={
              log.type === 'cyan' ? 'text-cyan-300 font-semibold' :
              log.type === 'success' ? 'text-emerald-300' :
              log.type === 'warning' ? 'text-amber-300' :
              log.type === 'user' ? 'text-amber-200 font-bold' : 'text-slate-300'
            }>
              {log.msg}
            </span>
          </div>
        ))}
      </div>

      {/* CLI Input Form */}
      <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-emerald-400 font-mono text-xs font-bold">&gt;</span>
          <input
            id="cli-input"
            name="cli-command"
            aria-label="Tactical Command CLI Input"
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            placeholder="Type tactical command (e.g. /scan, /faucet, /mint, /shield, /help)..."
            className="w-full bg-slate-950 border border-slate-800 rounded pl-7 pr-3 py-2 text-xs font-mono text-emerald-300 focus:border-emerald-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="tactical-btn py-2 px-4 flex items-center gap-1.5 text-xs"
        >
          <Send className="w-3.5 h-3.5" /> EXECUTE
        </button>
      </form>
    </div>
  );
}
