export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  status: 'loading' | 'ready' | 'streaming' | 'ghost' | 'error';
  processId: number;
  memoryMB: number;
  scrollY: number;
  formData: Record<string, string>;
  contextRestored: boolean;
  loadTimeMs: number;
  domNodes: number;
  domDiffs: number;
  createdAt: number;
}

export interface PerformanceMetrics {
  startupMs: number;
  tabSwitchMs: number;
  lastReloadMs: number;
  totalMemoryMB: number;
  activeConnections: number;
  cachedPages: number;
  compressionRatio: number;
  domDiffsPerSec: number;
  prefetchedUrls: number;
}

export interface DomDiffEvent {
  id: string;
  type: 'add' | 'update' | 'remove' | 'style' | 'text';
  target: string;
  timestamp: number;
  detail: string;
}

export interface AISuggestion {
  type: 'navigation' | 'summary' | 'autofill' | 'prediction';
  text: string;
  confidence: number;
  timestamp: number;
}

export interface SiteContent {
  url: string;
  title: string;
  favicon: string;
  sections: ContentSection[];
  theme: 'light' | 'dark';
}

export interface ContentSection {
  type: 'hero' | 'heading' | 'paragraph' | 'image' | 'code' | 'list' | 'card-grid' | 'stats' | 'nav';
  content: string;
  subContent?: string[];
  delay?: number;
}
