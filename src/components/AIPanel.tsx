import { useState, useEffect } from 'react';
import { Brain, Sparkles, ChevronDown } from 'lucide-react';
import { AISuggestion } from '../types';

interface AIPanelProps {
  suggestions: AISuggestion[];
  ghostUrls: string[];
}

export default function AIPanel({ suggestions, ghostUrls }: AIPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showTyping, setShowTyping] = useState(false);

  // Simulate AI typing effect for latest suggestion
  useEffect(() => {
    if (suggestions.length > 0) {
      const latest = suggestions[0];
      setShowTyping(true);
      setTypingText('');

      let i = 0;
      const interval = setInterval(() => {
        if (i < latest.text.length) {
          setTypingText(latest.text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowTyping(false), 1000);
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [suggestions.length]);

  const typeIcons: Record<string, string> = {
    navigation: '🧭',
    summary: '📝',
    autofill: '✍️',
    prediction: '🔮',
  };

  const typeColors: Record<string, string> = {
    navigation: 'border-glow-blue/20 bg-glow-blue/5',
    summary: 'border-glow-green/20 bg-glow-green/5',
    autofill: 'border-glow-orange/20 bg-glow-orange/5',
    prediction: 'border-glow-purple/20 bg-glow-purple/5',
  };

  if (isMinimized) {
    return (
      <div className="absolute bottom-4 right-4 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-800 border border-surface-600 shadow-lg hover:border-comet-500/40 transition-all group"
        >
          <Brain size={14} className="text-comet-400 group-hover:animate-pulse" />
          <span className="text-xs text-surface-300">Local AI</span>
          {suggestions.length > 0 && (
            <span className="w-4 h-4 flex items-center justify-center rounded-full bg-comet-500 text-white text-[9px] font-bold">
              {Math.min(suggestions.length, 9)}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 w-80 z-40 animate-slide-up">
      <div className="bg-surface-800 border border-surface-600 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-surface-700 bg-surface-800/90">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Brain size={14} className="text-comet-400" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-glow-green animate-pulse" />
            </div>
            <span className="text-xs font-semibold text-surface-100">Comet AI</span>
            <span className="text-[9px] text-surface-400 font-mono">WASM • Local</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded hover:bg-surface-600 text-surface-400 hover:text-surface-200 transition-colors"
            >
              <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* Model status */}
        <div className="px-3 py-2 border-b border-surface-700/50 flex items-center gap-2 text-[10px]">
          <div className="w-1.5 h-1.5 rounded-full bg-glow-green" />
          <span className="text-surface-400">ONNX model loaded</span>
          <span className="text-surface-500 ml-auto font-mono">~48MB RAM</span>
        </div>

        {/* Capabilities */}
        <div className="px-3 py-2 border-b border-surface-700/50">
          <div className="flex flex-wrap gap-1.5">
            {['Predictions', 'Summaries', 'Auto-fill', 'Navigation'].map(cap => (
              <span key={cap} className="px-2 py-0.5 rounded-full bg-surface-700 text-[9px] text-surface-300 font-medium">
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="max-h-64 overflow-y-auto">
          {suggestions.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <Sparkles size={20} className="text-surface-500 mx-auto mb-2" />
              <p className="text-xs text-surface-400">AI is analyzing page content...</p>
              <p className="text-[10px] text-surface-500 mt-1">Navigate to a page to see insights</p>
            </div>
          ) : (
            <div className="p-2 space-y-1.5">
              {suggestions.slice(0, 5).map((s, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-lg border text-xs ${typeColors[s.type]} animate-stream-in`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm flex-shrink-0 mt-0.5">{typeIcons[s.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-surface-200 leading-relaxed">
                        {i === 0 && showTyping ? (
                          <>
                            {typingText}
                            <span className="inline-block w-0.5 h-3 bg-comet-400 ml-0.5 animate-typing-cursor" />
                          </>
                        ) : (
                          s.text
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-surface-500 font-mono">
                          confidence: {(s.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ghost tab status */}
        {ghostUrls.length > 0 && (
          <div className="px-3 py-2 border-t border-surface-700">
            <div className="text-[10px] text-surface-400 mb-1">
              👻 Ghost Tabs Active ({ghostUrls.length})
            </div>
            <div className="space-y-0.5">
              {ghostUrls.slice(0, 3).map((url, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-surface-500">
                  <div className="w-1 h-1 rounded-full bg-glow-purple animate-pulse" />
                  <span className="truncate">{url}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-3 py-1.5 border-t border-surface-700 text-[9px] text-surface-500 text-center font-mono">
          100% local inference • No cloud calls • Privacy-first
        </div>
      </div>
    </div>
  );
}
