import { Shield, Wifi, Cpu, Database, Zap } from 'lucide-react';
import { Tab, PerformanceMetrics } from '../types';

interface StatusBarProps {
  activeTab: Tab | null;
  metrics: PerformanceMetrics;
  cometReloadActive: boolean;
}

export default function StatusBar({ activeTab, metrics, cometReloadActive }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-3 py-1 bg-surface-900 border-t border-surface-700 text-[10px] font-mono select-none">
      {/* Left: Status */}
      <div className="flex items-center gap-3">
        {activeTab && (
          <>
            <div className="flex items-center gap-1">
              {activeTab.status === 'ready' && (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-glow-green" />
                  <span className="text-glow-green">Ready</span>
                </>
              )}
              {activeTab.status === 'loading' && (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-glow-orange animate-pulse" />
                  <span className="text-glow-orange">Loading...</span>
                </>
              )}
              {activeTab.status === 'streaming' && (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-glow-blue animate-pulse" />
                  <span className="text-glow-blue">Streaming DOM</span>
                </>
              )}
            </div>

            {activeTab.url.startsWith('https://') && (
              <div className="flex items-center gap-1 text-glow-green">
                <Shield size={10} />
                <span>Secure</span>
              </div>
            )}

            {cometReloadActive && (
              <div className="flex items-center gap-1 text-comet-400 animate-pulse">
                <Zap size={10} />
                <span>Comet Reload</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Center: Engine info */}
      <div className="flex items-center gap-1 text-surface-500">
        <span>Rust+WASM</span>
        <span>•</span>
        <span>Event-Stream v0.1</span>
        <span>•</span>
        <span>HTTP/2</span>
      </div>

      {/* Right: Metrics */}
      <div className="flex items-center gap-3 text-surface-400">
        <div className="flex items-center gap-1" title="Active connections">
          <Wifi size={10} />
          <span>{metrics.activeConnections}</span>
        </div>
        <div className="flex items-center gap-1" title="Cached pages">
          <Database size={10} />
          <span>{metrics.cachedPages}</span>
        </div>
        <div className="flex items-center gap-1" title="Total memory">
          <Cpu size={10} />
          <span>{metrics.totalMemoryMB}MB</span>
        </div>
        {activeTab && activeTab.loadTimeMs > 0 && (
          <div className="flex items-center gap-1 text-glow-green" title="Last load time">
            <Zap size={10} />
            <span>{activeTab.loadTimeMs}ms</span>
          </div>
        )}
      </div>
    </div>
  );
}
