import { useState, useCallback, useRef, useEffect } from 'react';
import { Tab, PerformanceMetrics, DomDiffEvent, AISuggestion } from '../types';
import { getSiteContent } from '../data/sites';

let processCounter = 1000;
let diffCounter = 0;

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const diffTargets = [
  'div.main-content', 'span.title', 'p.description', 'img.hero',
  'nav.header', 'section.features', 'ul.list', 'li.item',
  'h1.heading', 'h2.subheading', 'button.cta', 'a.link',
  'div.card', 'footer.bottom', 'aside.sidebar', 'article.post',
];

const diffDetails: Record<string, string[]> = {
  add: ['Appended child node', 'Inserted before sibling', 'Created element'],
  update: ['Updated attributes', 'Changed class list', 'Modified dataset'],
  remove: ['Removed child', 'Detached node', 'Cleaned up listener'],
  style: ['Updated color', 'Changed transform', 'Modified opacity'],
  text: ['Updated text content', 'Changed innerHTML', 'Modified value'],
};

function createDiffEvent(): DomDiffEvent {
  const types: DomDiffEvent['type'][] = ['add', 'update', 'remove', 'style', 'text'];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    id: `diff-${++diffCounter}`,
    type,
    target: diffTargets[Math.floor(Math.random() * diffTargets.length)],
    timestamp: Date.now(),
    detail: diffDetails[type][Math.floor(Math.random() * diffDetails[type].length)],
  };
}

export function useBrowserEngine() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    startupMs: 142,
    tabSwitchMs: 0,
    lastReloadMs: 0,
    totalMemoryMB: 38,
    activeConnections: 3,
    cachedPages: 0,
    compressionRatio: 0.73,
    domDiffsPerSec: 0,
    prefetchedUrls: 0,
  });
  const [domDiffs, setDomDiffs] = useState<DomDiffEvent[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [ghostUrls, setGhostUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cometReloadActive, setCometReloadActive] = useState(false);

  const diffIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const switchTimerRef = useRef<number>(0);

  // Initialize with home tab
  useEffect(() => {
    if (tabs.length === 0) {
      const homeTab: Tab = {
        id: generateId(),
        title: 'CometBrowser — New Tab',
        url: 'comet://home',
        favicon: '☄️',
        status: 'ready',
        processId: ++processCounter,
        memoryMB: 12,
        scrollY: 0,
        formData: {},
        contextRestored: false,
        loadTimeMs: 0,
        domNodes: 47,
        domDiffs: 0,
        createdAt: Date.now(),
      };
      setTabs([homeTab]);
      setActiveTabId(homeTab.id);
    }
  }, []);

  // DOM diff streaming
  useEffect(() => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab?.status === 'streaming' || activeTab?.status === 'ready') {
      diffIntervalRef.current = setInterval(() => {
        const newDiff = createDiffEvent();
        setDomDiffs(prev => [newDiff, ...prev].slice(0, 50));
        setMetrics(prev => ({
          ...prev,
          domDiffsPerSec: randomBetween(12, 48),
        }));
      }, randomBetween(200, 800));
    }
    return () => {
      if (diffIntervalRef.current) clearInterval(diffIntervalRef.current);
    };
  }, [activeTabId, tabs]);

  const navigate = useCallback((url: string, tabId?: string) => {
    const normalizedUrl = url.startsWith('http') || url.startsWith('comet://')
      ? url
      : `https://${url}`;

    const site = getSiteContent(normalizedUrl);
    const targetId = tabId || activeTabId;
    if (!targetId) return;

    setIsLoading(true);
    const loadStart = performance.now();

    // Phase 1: Set loading state
    setTabs(prev => prev.map(t =>
      t.id === targetId
        ? { ...t, url: normalizedUrl, title: `Loading...`, status: 'loading' as const, favicon: '⏳' }
        : t
    ));

    // Phase 2: Streaming (simulate event-stream rendering)
    const streamDelay = randomBetween(80, 180);
    setTimeout(() => {
      setTabs(prev => prev.map(t =>
        t.id === targetId
          ? {
            ...t,
            title: site.title,
            favicon: site.favicon,
            status: 'streaming' as const,
            processId: ++processCounter,
            domNodes: randomBetween(120, 450),
            loadTimeMs: Math.round(performance.now() - loadStart),
          }
          : t
      ));

      // Phase 3: Ready
      setTimeout(() => {
        const loadTime = Math.round(performance.now() - loadStart);
        setTabs(prev => prev.map(t =>
          t.id === targetId
            ? {
              ...t,
              status: 'ready' as const,
              memoryMB: randomBetween(18, 45),
              loadTimeMs: loadTime,
              domDiffs: randomBetween(30, 120),
            }
            : t
        ));
        setIsLoading(false);
        setMetrics(prev => ({
          ...prev,
          cachedPages: prev.cachedPages + 1,
          activeConnections: Math.min(prev.activeConnections + 1, 12),
          totalMemoryMB: prev.totalMemoryMB + randomBetween(15, 35),
        }));

        // Add AI suggestion
        const suggestions: AISuggestion[] = [
          {
            type: 'summary',
            text: `Page "${site.title}" loaded via event-stream. ${site.sections.length} content sections detected.`,
            confidence: 0.94,
            timestamp: Date.now(),
          },
        ];
        setAiSuggestions(prev => [...suggestions, ...prev].slice(0, 10));
      }, randomBetween(60, 150));
    }, streamDelay);
  }, [activeTabId]);

  const createTab = useCallback((url?: string) => {
    const targetUrl = url || 'comet://home';
    const site = getSiteContent(targetUrl);
    const newTab: Tab = {
      id: generateId(),
      title: site.title,
      url: targetUrl,
      favicon: site.favicon,
      status: url ? 'loading' : 'ready',
      processId: ++processCounter,
      memoryMB: randomBetween(8, 15),
      scrollY: 0,
      formData: {},
      contextRestored: false,
      loadTimeMs: 0,
      domNodes: url ? 0 : 47,
      domDiffs: 0,
      createdAt: Date.now(),
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setMetrics(prev => ({
      ...prev,
      totalMemoryMB: prev.totalMemoryMB + newTab.memoryMB,
    }));

    if (url) {
      setTimeout(() => navigate(url, newTab.id), 50);
    }

    return newTab.id;
  }, [navigate]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.id === tabId);
      const remaining = prev.filter(t => t.id !== tabId);
      if (remaining.length === 0) {
        // Create a new home tab if all tabs are closed
        const homeTab: Tab = {
          id: generateId(),
          title: 'CometBrowser — New Tab',
          url: 'comet://home',
          favicon: '☄️',
          status: 'ready',
          processId: ++processCounter,
          memoryMB: 12,
          scrollY: 0,
          formData: {},
          contextRestored: false,
          loadTimeMs: 0,
          domNodes: 47,
          domDiffs: 0,
          createdAt: Date.now(),
        };
        setActiveTabId(homeTab.id);
        return [homeTab];
      }
      if (tabId === activeTabId) {
        const newIdx = Math.min(idx, remaining.length - 1);
        setActiveTabId(remaining[newIdx].id);
      }
      return remaining;
    });

    const closedTab = tabs.find(t => t.id === tabId);
    if (closedTab) {
      setMetrics(prev => ({
        ...prev,
        totalMemoryMB: Math.max(38, prev.totalMemoryMB - closedTab.memoryMB),
      }));
    }
  }, [activeTabId, tabs]);

  const switchTab = useCallback((tabId: string) => {
    switchTimerRef.current = performance.now();
    setActiveTabId(tabId);
    const switchTime = Math.round(performance.now() - switchTimerRef.current) + randomBetween(8, 32);
    setMetrics(prev => ({ ...prev, tabSwitchMs: switchTime }));

    // Show context restoration
    const tab = tabs.find(t => t.id === tabId);
    if (tab && tab.scrollY > 0) {
      setTabs(prev => prev.map(t =>
        t.id === tabId ? { ...t, contextRestored: true } : t
      ));
      setTimeout(() => {
        setTabs(prev => prev.map(t =>
          t.id === tabId ? { ...t, contextRestored: false } : t
        ));
      }, 1500);
    }
  }, [tabs]);

  const cometReload = useCallback(() => {
    if (!activeTabId) return;
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;

    setCometReloadActive(true);
    const reloadStart = performance.now();

    // Comet reload: preserve state, just re-initialize
    setTabs(prev => prev.map(t =>
      t.id === activeTabId
        ? { ...t, status: 'streaming' as const }
        : t
    ));

    setTimeout(() => {
      const reloadTime = Math.round(performance.now() - reloadStart);
      setTabs(prev => prev.map(t =>
        t.id === activeTabId
          ? {
            ...t,
            status: 'ready' as const,
            loadTimeMs: reloadTime,
            domDiffs: t.domDiffs + randomBetween(5, 15),
          }
          : t
      ));
      setMetrics(prev => ({
        ...prev,
        lastReloadMs: reloadTime,
      }));
      setCometReloadActive(false);

      const reloadSuggestion: AISuggestion = {
        type: 'prediction',
        text: `Comet Reload complete in ${reloadTime}ms. State preserved: scroll position, form data, JS context.`,
        confidence: 1.0,
        timestamp: Date.now(),
      };
      setAiSuggestions(prev => [reloadSuggestion, ...prev].slice(0, 10));
    }, randomBetween(40, 90));
  }, [activeTabId, tabs]);

  const ghostPrefetch = useCallback((url: string) => {
    if (!ghostUrls.includes(url)) {
      setGhostUrls(prev => [...prev, url]);
      setMetrics(prev => ({
        ...prev,
        prefetchedUrls: prev.prefetchedUrls + 1,
      }));

      const ghostSuggestion: AISuggestion = {
        type: 'prediction',
        text: `👻 Ghost Tab spawned for "${url}" — pre-rendering first screen`,
        confidence: 0.87,
        timestamp: Date.now(),
      };
      setAiSuggestions(prev => [ghostSuggestion, ...prev].slice(0, 10));
    }
  }, [ghostUrls]);

  const activeTab = tabs.find(t => t.id === activeTabId) || null;

  return {
    tabs,
    activeTab,
    activeTabId,
    metrics,
    domDiffs,
    aiSuggestions,
    ghostUrls,
    isLoading,
    cometReloadActive,
    navigate,
    createTab,
    closeTab,
    switchTab,
    cometReload,
    ghostPrefetch,
    setAiSuggestions,
  };
}
