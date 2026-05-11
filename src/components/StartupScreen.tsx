import { useState, useEffect } from 'react';

interface StartupScreenProps {
  onComplete: () => void;
}

const bootMessages = [
  { text: 'Initializing Rust core runtime...', delay: 0 },
  { text: 'Loading WebAssembly modules...', delay: 200 },
  { text: 'Starting micro-process manager...', delay: 380 },
  { text: 'Compiling event-stream renderer...', delay: 520 },
  { text: 'Starting Comet Proxy Daemon on localhost:9222...', delay: 680 },
  { text: 'Establishing HTTP/2 connection pool...', delay: 820 },
  { text: 'Loading ONNX inference model (48MB)...', delay: 960 },
  { text: 'Initializing context storage (LMDB)...', delay: 1100 },
  { text: 'Enabling Brotli + delta compression...', delay: 1220 },
  { text: 'Ghost Tab engine ready.', delay: 1340 },
  { text: 'All systems nominal. Startup: 142ms', delay: 1460 },
];

export default function StartupScreen({ onComplete }: StartupScreenProps) {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    bootMessages.forEach((msg, i) => {
      setTimeout(() => {
        setVisibleMessages(i + 1);
        setProgress(((i + 1) / bootMessages.length) * 100);
      }, msg.delay);
    });

    // Complete after all messages
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 400);
    }, 1800);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-surface-900 flex flex-col items-center justify-center transition-opacity duration-400 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Comet Logo */}
      <div className="relative mb-8">
        <div className="text-6xl" style={{ filter: 'drop-shadow(0 0 30px rgba(92, 124, 250, 0.5))' }}>☄️</div>
        <div className="absolute inset-0 blur-3xl opacity-20 bg-comet-500 rounded-full scale-150" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-surface-50 mb-1 tracking-tight">CometBrowser</h1>
      <p className="text-xs text-surface-400 mb-8 font-mono">v0.1.0-alpha • Rust + WebAssembly</p>

      {/* Progress bar */}
      <div className="w-80 h-1 bg-surface-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-comet-600 to-comet-400 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Boot messages */}
      <div className="w-96 h-48 overflow-hidden">
        <div className="space-y-1">
          {bootMessages.slice(0, visibleMessages).map((msg, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs font-mono animate-stream-in"
            >
              <span className={`
                ${i === visibleMessages - 1 ? 'text-comet-400' : 'text-glow-green'}
              `}>
                {i === visibleMessages - 1 && i < bootMessages.length - 1 ? '▸' : '✓'}
              </span>
              <span className={`
                ${i === visibleMessages - 1 ? 'text-surface-200' : 'text-surface-500'}
              `}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="absolute bottom-8 flex items-center gap-4 text-[10px] font-mono text-surface-600">
        <span>Rust</span>
        <span>•</span>
        <span>WebAssembly</span>
        <span>•</span>
        <span>WebRender</span>
        <span>•</span>
        <span>HTTP/2</span>
        <span>•</span>
        <span>LMDB</span>
        <span>•</span>
        <span>ONNX</span>
      </div>
    </div>
  );
}
