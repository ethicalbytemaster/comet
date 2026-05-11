import { SiteContent } from '../types';

export const siteDatabase: Record<string, SiteContent> = {
  'comet://home': {
    url: 'comet://home',
    title: 'CometBrowser — New Tab',
    favicon: '☄️',
    theme: 'dark',
    sections: [
      {
        type: 'hero',
        content: 'CometBrowser',
        subContent: ['Ultra-fast. Zero bloat. Privacy-first.'],
      },
      {
        type: 'stats',
        content: 'Performance',
        subContent: ['< 200ms Startup', '< 50ms Tab Switch', '< 100ms Reload', '< 50MB per Tab'],
      },
      {
        type: 'card-grid',
        content: 'Core Features',
        subContent: [
          '☄️ Comet Reload|Ctrl+R preserves state, JS re-initializes in-place. Scroll position, forms, and context survive.',
          '👻 Ghost Tabs|Pre-render pages before you open them. Spawns headless micro-instances that cache the first screen.',
          '🔄 DOM Diff Stream|Only changed nodes update. Like a live feed, even on weak CPUs.',
          '🤖 Local AI|On-device WASM model for predictions, summaries, and auto-fill. No cloud calls needed.',
          '🔒 Privacy First|All streaming, prefetch, diff, and AI happens locally. No data leaves your machine.',
          '⚡ Event Streams|JS runs in a micro-thread. UI updates arrive as events. Scroll, zoom, edit while fetching.',
        ],
      },
      {
        type: 'card-grid',
        content: 'Architecture',
        subContent: [
          '🦀 Rust + WASM|Core runtime compiled to WebAssembly for memory safety and speed.',
          '🖥️ WebRender|Skia-based renderer with diff output for high-quality node updates.',
          '🌐 HTTP/2 Proxy|Local daemon maintains persistent connections. Pages load before you click Go.',
          '💾 LMDB + LZ4|Fast random-access storage with context-aware compression.',
          '🧠 ONNX Runtime|Local inference model runs in under 500MB RAM.',
          '📡 IPC Bus|Tabs communicate via local pipe + msgpack. No OS overhead.',
        ],
      },
    ],
  },
  'https://github.com': {
    url: 'https://github.com',
    title: 'GitHub — Where the world builds software',
    favicon: '🐙',
    theme: 'dark',
    sections: [
      {
        type: 'nav',
        content: 'GitHub',
        subContent: ['Pull requests', 'Issues', 'Codespaces', 'Marketplace', 'Explore'],
      },
      {
        type: 'hero',
        content: 'Let\'s build from here',
        subContent: ['The AI-powered developer platform to build, scale, and deliver secure software.'],
      },
      {
        type: 'card-grid',
        content: 'Trending Repositories',
        subContent: [
          '⭐ rust-lang/rust|The Rust programming language — 92.4k stars',
          '🔥 nickel-org/nickel.rs|Web framework for Rust — 3.1k stars',
          '🚀 nickel-org/nickel.rs|A web framework for Rust — 12.8k stars',
          '📦 nickel-org/nickel.rs|Performant web rendering — 45.2k stars',
        ],
        delay: 200,
      },
      {
        type: 'paragraph',
        content: 'Over 100 million developers use GitHub to build amazing things together. Whether public or private, GitHub makes it easy to collaborate.',
        delay: 400,
      },
    ],
  },
  'https://news.ycombinator.com': {
    url: 'https://news.ycombinator.com',
    title: 'Hacker News',
    favicon: '📰',
    theme: 'light',
    sections: [
      {
        type: 'nav',
        content: 'Hacker News',
        subContent: ['new', 'past', 'comments', 'ask', 'show', 'jobs', 'submit'],
      },
      {
        type: 'list',
        content: 'Top Stories',
        subContent: [
          '1. CometBrowser: A new browser built on Rust+WASM (cometbrowser.dev) — 482 points',
          '2. Show HN: I built a DOM diff streaming engine — 231 points',
          '3. Why event-stream rendering is the future of browsers — 189 points',
          '4. Ghost Tab Pre-fetching: How CometBrowser predicts your next page — 156 points',
          '5. Local AI in browsers: Running inference without cloud calls — 143 points',
          '6. Context-aware compression reduces bandwidth by 73% — 128 points',
          '7. Micro-process tab isolation: Lessons from building CometBrowser — 117 points',
          '8. HTTP/2 persistent connections and the local proxy pattern — 98 points',
          '9. Building a browser in Rust: Challenges and solutions — 87 points',
          '10. WebRender vs. Skia: A deep dive into rendering engines — 76 points',
        ],
        delay: 100,
      },
    ],
  },
  'https://docs.rs': {
    url: 'https://docs.rs',
    title: 'Docs.rs — Rust Documentation',
    favicon: '🦀',
    theme: 'dark',
    sections: [
      {
        type: 'nav',
        content: 'docs.rs',
        subContent: ['Crates', 'Documentation', 'Search', 'About'],
      },
      {
        type: 'heading',
        content: 'Rust Package Documentation',
      },
      {
        type: 'code',
        content: 'use comet_engine::{\n  EventStream,\n  DomDiff,\n  TabProcess,\n  GhostPrefetch,\n};\n\nfn main() {\n  let engine = CometEngine::new()\n    .with_diff_renderer()\n    .with_ghost_tabs()\n    .with_local_ai();\n\n  engine.run();\n}',
        delay: 150,
      },
      {
        type: 'paragraph',
        content: 'The comet_engine crate provides the core runtime for CometBrowser. It handles DOM diff streaming, tab process isolation, ghost tab pre-fetching, and the local AI inference layer.',
        delay: 300,
      },
      {
        type: 'list',
        content: 'Popular Crates',
        subContent: [
          'tokio — Async runtime for Rust — 24.8k ⭐',
          'serde — Serialization framework — 8.2k ⭐',
          'actix-web — Web framework — 19.5k ⭐',
          'warp — Web server framework — 9.1k ⭐',
          'reqwest — HTTP client — 8.7k ⭐',
        ],
        delay: 450,
      },
    ],
  },
  'https://example.com': {
    url: 'https://example.com',
    title: 'Example Domain',
    favicon: '🌐',
    theme: 'light',
    sections: [
      {
        type: 'heading',
        content: 'Example Domain',
      },
      {
        type: 'paragraph',
        content: 'This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.',
        delay: 100,
      },
      {
        type: 'paragraph',
        content: 'More information about this domain can be found at the IANA website.',
        delay: 200,
      },
    ],
  },
};

export const defaultSuggestions = [
  { url: 'https://github.com', title: 'GitHub', favicon: '🐙' },
  { url: 'https://news.ycombinator.com', title: 'Hacker News', favicon: '📰' },
  { url: 'https://docs.rs', title: 'Docs.rs', favicon: '🦀' },
  { url: 'https://example.com', title: 'Example Domain', favicon: '🌐' },
];

export function getSiteContent(url: string): SiteContent {
  const normalized = url.replace(/\/$/, '');
  if (siteDatabase[normalized]) return siteDatabase[normalized];

  // Generate a generic page for unknown URLs
  const hostname = (() => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch {
      return url;
    }
  })();

  return {
    url,
    title: `${hostname} — Loaded via Comet`,
    favicon: '🌐',
    theme: 'dark',
    sections: [
      {
        type: 'nav',
        content: hostname,
        subContent: ['Home', 'About', 'Products', 'Contact'],
      },
      {
        type: 'hero',
        content: `Welcome to ${hostname}`,
        subContent: ['This page was loaded through CometBrowser\'s event-stream renderer.'],
      },
      {
        type: 'paragraph',
        content: `CometBrowser has established an HTTP/2 persistent connection to ${hostname} and is streaming DOM diffs in real-time. The page loaded in under 100ms using the local Comet Proxy Daemon.`,
        delay: 200,
      },
      {
        type: 'card-grid',
        content: 'Comet Rendering Stats',
        subContent: [
          `⚡ Stream Active|Connected via HTTP/2 to ${hostname}`,
          '🔄 Diff Mode|Only changed DOM nodes rendered',
          '📦 Compressed|Brotli + delta encoding active',
          '🧠 AI Ready|Local model analyzing page content',
        ],
        delay: 400,
      },
    ],
  };
}
