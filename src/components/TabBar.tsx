import { Plus, X } from 'lucide-react';
import { Tab } from '../types';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSwitchTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onCreateTab: () => void;
}

export default function TabBar({ tabs, activeTabId, onSwitchTab, onCloseTab, onCreateTab }: TabBarProps) {
  return (
    <div className="flex items-end gap-0.5 px-2 pt-2 bg-surface-900 select-none" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      {/* Window controls (macOS style) */}
      <div className="flex items-center gap-1.5 px-3 pb-2 mr-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-90 transition-all cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-90 transition-all cursor-pointer" />
      </div>

      {/* Tabs */}
      <div className="flex items-end gap-0.5 flex-1 overflow-x-auto scrollbar-none">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => onSwitchTab(tab.id)}
              className={`
                group relative flex items-center gap-2 px-3 py-2 min-w-[140px] max-w-[220px]
                rounded-t-lg text-xs font-medium transition-all duration-100
                ${isActive
                  ? 'bg-surface-800 text-surface-50 z-10'
                  : 'bg-surface-900 text-surface-300 hover:bg-surface-800/60 hover:text-surface-100'
                }
              `}
              style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
              {/* Status indicator */}
              <div className="relative flex-shrink-0">
                <span className="text-sm">{tab.favicon}</span>
                {tab.status === 'loading' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-glow-orange animate-pulse" />
                )}
                {tab.status === 'streaming' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-glow-blue animate-pulse" />
                )}
                {tab.status === 'ghost' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-glow-purple animate-pulse" />
                )}
              </div>

              {/* Title */}
              <span className="truncate flex-1 text-left">{tab.title}</span>

              {/* Process badge */}
              {isActive && (
                <span className="text-[9px] font-mono text-surface-400 flex-shrink-0">
                  P{tab.processId}
                </span>
              )}

              {/* Close button */}
              <div
                onClick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }}
                className={`
                  flex-shrink-0 p-0.5 rounded transition-all cursor-pointer
                  ${isActive ? 'opacity-60 hover:opacity-100 hover:bg-surface-600' : 'opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-surface-600'}
                `}
              >
                <X size={12} />
              </div>

              {/* Active indicator line */}
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-comet-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* New Tab */}
      <button
        onClick={onCreateTab}
        className="flex items-center justify-center w-7 h-7 mb-0.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-700 transition-all"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
