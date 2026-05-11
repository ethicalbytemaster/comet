import { useState, useEffect, useCallback } from 'react';
import TabBar from './components/TabBar';
import AddressBar from './components/AddressBar';
import PageRenderer from './components/PageRenderer';
import PerformancePanel from './components/PerformancePanel';
import AIPanel from './components/AIPanel';
import StatusBar from './components/StatusBar';
import StartupScreen from './components/StartupScreen';
import { useBrowserEngine } from './hooks/useBrowserEngine';
import { PanelRight, PanelRightClose, Brain } from 'lucide-react';

export default function App() {
  const [booting, setBooting] = useState(true);
  const [showPerf, setShowPerf] = useState(true);
  const [showAI, setShowAI] = useState(false);

  const engine = useBrowserEngine();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+R: Comet Reload
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        engine.cometReload();
      }
      // Ctrl+T: New Tab
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        engine.createTab();
      }
      // Ctrl+W: Close Tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        if (engine.activeTabId) {
          engine.closeTab(engine.activeTabId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine]);

  const handleBootComplete = useCallback(() => {
    setBooting(false);
  }, []);

  if (booting) {
    return <StartupScreen onComplete={handleBootComplete} />;
  }

  return (
    <div className="h-full flex flex-col bg-surface-900 text-surface-100 overflow-hidden animate-fade-in">
      {/* Tab Bar */}
      <TabBar
        tabs={engine.tabs}
        activeTabId={engine.activeTabId}
        onSwitchTab={engine.switchTab}
        onCloseTab={engine.closeTab}
        onCreateTab={() => engine.createTab()}
      />

      {/* Address Bar */}
      <AddressBar
        activeTab={engine.activeTab}
        isLoading={engine.isLoading}
        cometReloadActive={engine.cometReloadActive}
        ghostUrls={engine.ghostUrls}
        onNavigate={engine.navigate}
        onCometReload={engine.cometReload}
        onGhostPrefetch={engine.ghostPrefetch}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Page Renderer */}
        <PageRenderer
          activeTab={engine.activeTab}
          onNavigate={engine.navigate}
        />

        {/* Toggle buttons */}
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1">
          <button
            onClick={() => setShowAI(!showAI)}
            className={`p-1.5 rounded-md transition-all ${
              showAI
                ? 'bg-comet-500/20 text-comet-400'
                : 'bg-surface-800/80 text-surface-400 hover:text-surface-200'
            } border border-surface-600`}
            title="Toggle AI Panel"
          >
            <Brain size={14} />
          </button>
          <button
            onClick={() => setShowPerf(!showPerf)}
            className={`p-1.5 rounded-md transition-all ${
              showPerf
                ? 'bg-comet-500/20 text-comet-400'
                : 'bg-surface-800/80 text-surface-400 hover:text-surface-200'
            } border border-surface-600`}
            title="Toggle Performance Panel"
          >
            {showPerf ? <PanelRightClose size={14} /> : <PanelRight size={14} />}
          </button>
        </div>

        {/* AI Panel (floating) */}
        {showAI && (
          <AIPanel
            suggestions={engine.aiSuggestions}
            ghostUrls={engine.ghostUrls}
          />
        )}

        {/* Performance Panel (sidebar) */}
        {showPerf && (
          <PerformancePanel
            metrics={engine.metrics}
            activeTab={engine.activeTab}
            domDiffs={engine.domDiffs}
            tabs={engine.tabs}
          />
        )}
      </div>

      {/* Status Bar */}
      <StatusBar
        activeTab={engine.activeTab}
        metrics={engine.metrics}
        cometReloadActive={engine.cometReloadActive}
      />

      {/* Keyboard shortcuts hint */}
      <KeyboardHints />
    </div>
  );
}

function KeyboardHints() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-4 px-4 py-2 rounded-full glass border border-surface-600 shadow-lg">
        <div className="flex items-center gap-1.5 text-[10px] text-surface-300">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-700 text-surface-200 font-mono text-[9px]">Ctrl+T</kbd>
          <span>New Tab</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-surface-300">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-700 text-surface-200 font-mono text-[9px]">Ctrl+R</kbd>
          <span>Comet Reload</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-surface-300">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-700 text-surface-200 font-mono text-[9px]">Ctrl+W</kbd>
          <span>Close Tab</span>
        </div>
      </div>
    </div>
  );
}
