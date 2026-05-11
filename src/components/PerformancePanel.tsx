import { useState, useEffect } from 'react';
import {
  Activity, Cpu, HardDrive, Wifi, Gauge,
  Layers, Zap, Database, ArrowUpDown,
} from 'lucide-react';
import { PerformanceMetrics, Tab, DomDiffEvent } from '../types';

interface PerformancePanelProps {
  metrics: PerformanceMetrics;
  activeTab: Tab | null;
  domDiffs: DomDiffEvent[];
  tabs: Tab[];
}

function MetricCard({ icon: Icon, label, value, unit, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-800/50">
      <Icon size={13} className={color} />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-surface-400 uppercase tracking-wider">{label}</div>
        <div className="text-sm font-mono text-surface-100 font-medium">
          {value}<span className="text-surface-400 text-xs ml-0.5">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function DiffEventRow({ diff }: { diff: DomDiffEvent }) {
  const typeColors = {
    add: 'text-glow-green bg-glow-green/10',
    update: 'text-glow-blue bg-glow-blue/10',
    remove: 'text-glow-red bg-glow-red/10',
    style: 'text-glow-orange bg-glow-orange/10',
    text: 'text-glow-purple bg-glow-purple/10',
  };

  const typeLabels = {
    add: '+ADD',
    update: '~UPD',
    remove: '-REM',
    style: '*STY',
    text: '=TXT',
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-mono animate-stream-in hover:bg-surface-700/50 rounded transition-colors">
      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${typeColors[diff.type]}`}>
        {typeLabels[diff.type]}
      </span>
      <span className="text-surface-300 truncate flex-1">{diff.target}</span>
      <span className="text-surface-500 flex-shrink-0">{diff.detail}</span>
    </div>
  );
}

export default function PerformancePanel({ metrics, activeTab, domDiffs, tabs }: PerformancePanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [cpuUsage, setCpuUsage] = useState(12);
  const [networkActivity, setNetworkActivity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(5, Math.min(40, prev + (Math.random() - 0.5) * 8)));
      setNetworkActivity(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.4) * 20)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-72 bg-surface-800 border-l border-surface-600 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-surface-600">
        <div className="flex items-center gap-2">
          <Activity size={13} className="text-comet-400" />
          <span className="text-xs font-semibold text-surface-100">Engine Monitor</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] text-surface-400 hover:text-surface-200 transition-colors font-mono"
        >
          {isExpanded ? 'COLLAPSE' : 'EXPAND'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isExpanded && (
          <>
            {/* System Metrics */}
            <div className="p-3 space-y-2">
              <div className="text-[10px] font-semibold text-surface-400 uppercase tracking-widest mb-2">
                System
              </div>
              <MetricCard icon={Zap} label="Startup" value={metrics.startupMs} unit="ms" color="text-glow-green" />
              <MetricCard icon={ArrowUpDown} label="Tab Switch" value={metrics.tabSwitchMs} unit="ms" color="text-comet-400" />
              <MetricCard icon={Gauge} label="Comet Reload" value={metrics.lastReloadMs} unit="ms" color="text-glow-orange" />
              <MetricCard icon={Cpu} label="CPU Usage" value={cpuUsage.toFixed(1)} unit="%" color="text-glow-blue" />
              <MetricCard icon={HardDrive} label="Total Memory" value={metrics.totalMemoryMB} unit="MB" color="text-glow-purple" />
            </div>

            {/* Active Tab */}
            {activeTab && (
              <div className="p-3 border-t border-surface-700 space-y-2">
                <div className="text-[10px] font-semibold text-surface-400 uppercase tracking-widest mb-2">
                  Active Process
                </div>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-surface-400">PID</span>
                    <span className="text-surface-100">{activeTab.processId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Memory</span>
                    <span className="text-surface-100">{activeTab.memoryMB}MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">DOM Nodes</span>
                    <span className="text-surface-100">{activeTab.domNodes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">DOM Diffs</span>
                    <span className="text-surface-100">{activeTab.domDiffs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Load Time</span>
                    <span className="text-glow-green">{activeTab.loadTimeMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Status</span>
                    <span className={`
                      ${activeTab.status === 'ready' ? 'text-glow-green' : ''}
                      ${activeTab.status === 'loading' ? 'text-glow-orange' : ''}
                      ${activeTab.status === 'streaming' ? 'text-glow-blue' : ''}
                    `}>
                      {activeTab.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Network */}
            <div className="p-3 border-t border-surface-700 space-y-2">
              <div className="text-[10px] font-semibold text-surface-400 uppercase tracking-widest mb-2">
                Comet Proxy
              </div>
              <MetricCard icon={Wifi} label="HTTP/2 Connections" value={metrics.activeConnections} color="text-glow-green" />
              <MetricCard icon={Database} label="Cached Pages" value={metrics.cachedPages} color="text-comet-400" />
              <MetricCard icon={Layers} label="Compression" value={(metrics.compressionRatio * 100).toFixed(0)} unit="%" color="text-glow-orange" />

              {/* Network activity bar */}
              <div className="mt-2">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-surface-400">Network</span>
                  <span className="text-surface-300 font-mono">{networkActivity.toFixed(0)} KB/s</span>
                </div>
                <div className="h-1 bg-surface-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-comet-500 to-glow-blue rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, networkActivity)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tab Processes */}
            <div className="p-3 border-t border-surface-700">
              <div className="text-[10px] font-semibold text-surface-400 uppercase tracking-widest mb-2">
                Micro-Processes ({tabs.length})
              </div>
              <div className="space-y-1">
                {tabs.map(tab => (
                  <div key={tab.id} className="flex items-center gap-2 text-[10px] font-mono py-1 px-2 rounded hover:bg-surface-700/50">
                    <span className="text-sm">{tab.favicon}</span>
                    <span className="text-surface-300 truncate flex-1">{tab.title.slice(0, 20)}</span>
                    <span className="text-surface-500">{tab.memoryMB}MB</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* DOM Diff Stream */}
        <div className="p-3 border-t border-surface-700">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-semibold text-surface-400 uppercase tracking-widest">
              DOM Diff Stream
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-glow-green animate-pulse" />
              <span className="text-[9px] text-surface-400 font-mono">{metrics.domDiffsPerSec}/s</span>
            </div>
          </div>
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {domDiffs.slice(0, 15).map(diff => (
              <DiffEventRow key={diff.id} diff={diff} />
            ))}
            {domDiffs.length === 0 && (
              <div className="text-[10px] text-surface-500 text-center py-4">
                Waiting for DOM events...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
