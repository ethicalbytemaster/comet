import { useState, useEffect, useRef } from 'react';
import { Tab } from '../types';
import { getSiteContent, defaultSuggestions } from '../data/sites';
import type { ContentSection, SiteContent } from '../types';

interface PageRendererProps {
  activeTab: Tab | null;
  onNavigate: (url: string) => void;
}

function SectionRenderer({ section, theme }: { section: ContentSection; index: number; theme: string }) {
  const [visible, setVisible] = useState(!section.delay);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (section.delay) {
      const timer = setTimeout(() => setVisible(true), section.delay);
      return () => clearTimeout(timer);
    }
  }, [section.delay]);

  if (!visible) {
    return (
      <div className="animate-pulse space-y-2 py-4">
        <div className={`h-4 ${isDark ? 'bg-surface-700' : 'bg-gray-200'} rounded w-3/4`} />
        <div className={`h-3 ${isDark ? 'bg-surface-700' : 'bg-gray-200'} rounded w-1/2`} />
      </div>
    );
  }

  const animClass = section.delay ? 'animate-stream-in' : '';

  switch (section.type) {
    case 'hero':
      return (
        <div className={`${animClass} text-center py-16`}>
          <h1 className={`text-5xl font-black tracking-tight mb-4 ${
            isDark
              ? 'bg-gradient-to-r from-comet-300 via-comet-400 to-glow-purple bg-clip-text text-transparent'
              : 'text-gray-900'
          }`}>
            {section.content}
          </h1>
          {section.subContent?.map((sub, i) => (
            <p key={i} className={`text-lg ${isDark ? 'text-surface-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              {sub}
            </p>
          ))}
        </div>
      );

    case 'nav':
      return (
        <div className={`${animClass} flex items-center gap-6 py-3 border-b ${
          isDark ? 'border-surface-600' : 'border-gray-200'
        }`}>
          <span className={`font-bold text-lg ${isDark ? 'text-surface-50' : 'text-gray-900'}`}>
            {section.content}
          </span>
          <div className="flex items-center gap-4">
            {section.subContent?.map((item, i) => (
              <button key={i} className={`text-sm ${
                isDark ? 'text-surface-300 hover:text-surface-50' : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}>
                {item}
              </button>
            ))}
          </div>
        </div>
      );

    case 'heading':
      return (
        <h2 className={`${animClass} text-2xl font-bold mt-8 mb-4 ${
          isDark ? 'text-surface-50' : 'text-gray-900'
        }`}>
          {section.content}
        </h2>
      );

    case 'paragraph':
      return (
        <p className={`${animClass} text-sm leading-relaxed mb-4 ${
          isDark ? 'text-surface-300' : 'text-gray-600'
        }`}>
          {section.content}
        </p>
      );

    case 'code':
      return (
        <div className={`${animClass} rounded-lg overflow-hidden my-6 border ${
          isDark ? 'border-surface-600' : 'border-gray-300'
        }`}>
          <div className={`flex items-center gap-2 px-4 py-2 text-xs ${
            isDark ? 'bg-surface-700 text-surface-300' : 'bg-gray-100 text-gray-500'
          }`}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <span className="ml-2 font-mono">main.rs</span>
          </div>
          <pre className={`p-4 text-sm font-mono overflow-x-auto ${
            isDark ? 'bg-surface-900 text-comet-300' : 'bg-gray-50 text-blue-700'
          }`}>
            <code>{section.content}</code>
          </pre>
        </div>
      );

    case 'list':
      return (
        <div className={`${animClass} my-4`}>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-surface-100' : 'text-gray-800'}`}>
            {section.content}
          </h3>
          <div className="space-y-1">
            {section.subContent?.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 py-2.5 px-3 rounded-lg text-sm transition-colors cursor-pointer ${
                  isDark
                    ? 'hover:bg-surface-700 text-surface-200'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className={`flex-1 ${isDark ? 'text-surface-200' : 'text-gray-700'}`}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'card-grid':
      return (
        <div className={`${animClass} my-8`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-surface-100' : 'text-gray-800'}`}>
            {section.content}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {section.subContent?.map((item, i) => {
              const [title, desc] = item.split('|');
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${
                    isDark
                      ? 'bg-surface-700/50 border-surface-600 hover:border-comet-500/40 hover:bg-surface-700'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className={`font-medium text-sm mb-1 ${isDark ? 'text-surface-50' : 'text-gray-900'}`}>
                    {title}
                  </div>
                  {desc && (
                    <div className={`text-xs ${isDark ? 'text-surface-400' : 'text-gray-500'}`}>
                      {desc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );

    case 'stats':
      return (
        <div className={`${animClass} flex flex-wrap justify-center gap-6 py-8`}>
          {section.subContent?.map((stat, i) => (
            <div
              key={i}
              className={`text-center px-6 py-4 rounded-xl border ${
                isDark
                  ? 'bg-surface-800/80 border-surface-600'
                  : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <div className={`text-xl font-bold font-mono ${
                isDark ? 'text-comet-400' : 'text-blue-600'
              }`}>
                {stat.split(' ')[0]} {stat.split(' ')[1]}
              </div>
              <div className={`text-xs mt-1 ${isDark ? 'text-surface-400' : 'text-gray-500'}`}>
                {stat.split(' ').slice(2).join(' ')}
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

export default function PageRenderer({ activeTab, onNavigate }: PageRendererProps) {
  const [site, setSite] = useState<SiteContent | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab) {
      const content = getSiteContent(activeTab.url);
      setSite(content);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }
  }, [activeTab?.url]);

  if (!activeTab || !site) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-900">
        <div className="text-surface-400 text-sm">No page loaded</div>
      </div>
    );
  }

  const isDark = site.theme === 'dark';

  // Home page with special layout
  if (activeTab.url === 'comet://home') {
    return (
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-surface-900"
      >
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Comet logo animation area */}
          <div className="relative flex flex-col items-center pt-16 pb-4">
            <div className="relative animate-float">
              <div className="text-7xl mb-2" style={{ filter: 'drop-shadow(0 0 30px rgba(92, 124, 250, 0.5))' }}>☄️</div>
              <div className="absolute inset-0 blur-3xl opacity-20 bg-comet-500 rounded-full scale-150 animate-pulse" />
            </div>
          </div>

          {/* Centered search bar */}
          <div className="max-w-lg mx-auto mb-10">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-800 border border-surface-600 hover:border-comet-500/40 transition-all cursor-text group"
              onClick={() => {
                // Focus the main address bar
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (input) { input.focus(); input.select(); }
              }}
            >
              <span className="text-surface-500 text-sm">🔍</span>
              <span className="text-surface-500 text-sm flex-1">Search or enter URL...</span>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-700 text-surface-400 font-mono text-[10px]">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-surface-700 text-surface-400 font-mono text-[10px]">L</kbd>
              </div>
            </div>
          </div>

          {site.sections.map((section, i) => (
            <SectionRenderer key={i} section={section} index={i} theme={site.theme} />
          ))}

          {/* Quick links */}
          <div className="mt-12 mb-8">
            <h3 className="text-sm font-medium text-surface-400 mb-4 text-center">Quick Navigation</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              {defaultSuggestions.map((s) => (
                <button
                  key={s.url}
                  onClick={() => onNavigate(s.url)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-800 border border-surface-700 hover:border-comet-500/40 hover:bg-surface-700 transition-all group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{s.favicon}</span>
                  <span className="text-xs text-surface-300 group-hover:text-surface-100 transition-colors">{s.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Build Phases Timeline */}
          <div className="mt-12 mb-8">
            <h3 className="text-lg font-semibold text-surface-100 mb-6 text-center">Build Phases</h3>
            <div className="relative max-w-2xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-comet-500 via-comet-400 to-glow-purple" />
              {[
                { phase: '1', title: 'Core Shell', desc: 'Rust runtime, tab micro-processes, basic navigation', status: 'complete' },
                { phase: '2', title: 'Event-Stream Renderer', desc: 'DOM diffing, viewport rendering, delta frames', status: 'complete' },
                { phase: '3', title: 'Comet Proxy', desc: 'Local HTTP/2 proxy, connection pooling, pre-fetching', status: 'complete' },
                { phase: '4', title: 'Context System', desc: 'Per-site storage, scroll/form persistence, context restoration', status: 'complete' },
                { phase: '5', title: 'Comet Reload', desc: 'In-place refresh, state preservation across reload', status: 'complete' },
                { phase: '6', title: 'Ghost Tabs', desc: 'Headless pre-rendering, first-screen caching', status: 'complete' },
                { phase: '7', title: 'Local AI', desc: 'WASM model, predictions, summarization, auto-fill', status: 'complete' },
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-4 mb-4 relative">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 z-10 ${
                    p.status === 'complete'
                      ? 'bg-comet-500/20 text-comet-400 border border-comet-500/30'
                      : 'bg-surface-700 text-surface-400 border border-surface-600'
                  }`}>
                    {p.status === 'complete' ? '✓' : p.phase}
                  </div>
                  <div className="pt-1">
                    <div className="text-sm font-medium text-surface-100">
                      Phase {p.phase}: {p.title}
                    </div>
                    <div className="text-xs text-surface-400 mt-0.5">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Targets */}
          <div className="mt-12 mb-8">
            <h3 className="text-lg font-semibold text-surface-100 mb-4 text-center">Performance Targets</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
              {[
                { label: 'Startup', value: '< 200ms', met: true },
                { label: 'Tab Switch', value: '< 50ms', met: true },
                { label: 'Comet Reload', value: '< 100ms', met: true },
                { label: 'Memory/Tab', value: '< 50MB', met: true },
                { label: 'Min RAM', value: '2GB', met: true },
              ].map((t, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-surface-800/60 border border-surface-700">
                  <div className="text-lg font-bold font-mono text-glow-green">{t.value}</div>
                  <div className="text-[10px] text-surface-400 mt-1">{t.label}</div>
                  {t.met && <div className="text-[9px] text-glow-green mt-1">✓ MET</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-12 mb-8">
            <h3 className="text-lg font-semibold text-surface-100 mb-4 text-center">Tech Stack</h3>
            <div className="overflow-hidden rounded-xl border border-surface-700 max-w-2xl mx-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-surface-800">
                    <th className="text-left px-4 py-2 text-surface-400 font-medium">Layer</th>
                    <th className="text-left px-4 py-2 text-surface-400 font-medium">Technology</th>
                    <th className="text-left px-4 py-2 text-surface-400 font-medium">Why</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-700">
                  {[
                    ['Core Runtime', 'Rust + WebAssembly', 'Fast, small, memory-safe'],
                    ['Renderer', 'WebRender / Skia', 'High quality + easy node diff'],
                    ['Network', 'HTTP/2 + h2c + local proxy', 'Persistent connections'],
                    ['Storage', 'LMDB / SQLite + LZ4', 'Fast random access'],
                    ['AI/Model', 'ONNX-Runtime / WASM', 'Runs in < 500MB RAM'],
                    ['IPC', 'Local bus (pipe + msgpack)', 'No OS overhead'],
                  ].map(([layer, tech, why], i) => (
                    <tr key={i} className="hover:bg-surface-800/50 transition-colors">
                      <td className="px-4 py-2 text-surface-200 font-medium font-mono">{layer}</td>
                      <td className="px-4 py-2 text-comet-300 font-mono">{tech}</td>
                      <td className="px-4 py-2 text-surface-400">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Design Philosophy */}
          <div className="mt-12 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-surface-100 mb-4 text-center">Design Philosophy</h3>
            <div className="space-y-2">
              {[
                '"If it doesn\'t make the browser faster, don\'t add it"',
                'Minimal UI: one address bar, icon tabs, no clutter',
                'Everything runs locally by default',
                'Cloud is optional, never required',
                'Privacy is a feature, not an afterthought',
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface-800/40 border border-surface-700/50">
                  <span className="text-comet-400 text-sm">◆</span>
                  <span className="text-sm text-surface-300 italic">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 mb-16 px-4">
            <div className="text-xs font-mono text-surface-500 text-center space-y-1">
              <p>CometBrowser v0.1.0-alpha • Rust + WebAssembly Core</p>
              <p>Event-Stream Renderer • Ghost Tab Pre-fetching • Local AI</p>
              <p className="text-comet-500/60">Phase 1-7 Active • All Systems Nominal</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={`flex-1 overflow-y-auto ${isDark ? 'bg-surface-900' : 'bg-white'}`}
    >
      {/* Context restored banner */}
      {activeTab.contextRestored && (
        <div className="bg-comet-900/30 border-b border-comet-500/20 px-4 py-2 text-xs text-comet-300 flex items-center gap-2 animate-slide-up">
          <span>⚡</span>
          <span>Context restored: scroll position, form data, selected text</span>
          <span className="font-mono text-comet-400 ml-auto">~180ms</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-4">
        {site.sections.map((section, i) => (
          <SectionRenderer key={`${activeTab.url}-${i}`} section={section} index={i} theme={site.theme} />
        ))}

        {/* Streamed footer */}
        <div className={`mt-12 pt-6 border-t ${isDark ? 'border-surface-700' : 'border-gray-200'} mb-8`}>
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-surface-500' : 'text-gray-400'}`}>
            <div className="flex items-center gap-2">
              <span>☄️</span>
              <span>Rendered via CometBrowser Event-Stream Engine</span>
            </div>
            <div className="font-mono flex items-center gap-3">
              <span>{activeTab.domNodes} nodes</span>
              <span>•</span>
              <span>{activeTab.domDiffs} diffs</span>
              <span>•</span>
              <span>{activeTab.loadTimeMs}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
