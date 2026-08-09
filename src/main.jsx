import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-hud">
          <div className="glass-panel p-6 max-w-lg w-full border-rose-500/50 text-center space-y-4">
            <h2 className="text-xl font-bold text-rose-400">TACTICAL DISPLAY ERROR RECOVERED</h2>
            <p className="text-xs text-slate-300">
              A runtime component exception was caught. Tactical command modules isolated.
            </p>
            <div className="bg-slate-900 p-3 rounded text-left font-mono text-[11px] text-rose-300 overflow-x-auto">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="tactical-btn py-2 px-4 text-xs font-bold w-full justify-center"
            >
              RELOAD ECOSYSTEM DASHBOARD
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
