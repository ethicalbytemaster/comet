import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, ArrowRight, RotateCw, Shield, Zap, Ghost,
  Search,
} from 'lucide-react';
import { Tab } from '../types';
import { defaultSuggestions, siteDatabase } from '../data/sites';

interface AddressBarProps {
  activeTab: Tab | null;
  isLoading: boolean;
  cometReloadActive: boolean;
  ghostUrls: string[];
  onNavigate: (url: string) => void;
  onCometReload: () => void;
  onGhostPrefetch: (url: string) => void;
}

export default function AddressBar({
  activeTab, isLoading, cometReloadActive, ghostUrls,
  onNavigate, onCometReload, onGhostPrefetch,
}: AddressBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab && !isFocused) {
      setInputValue(activeTab.url);
    }
  }, [activeTab?.url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onNavigate(inputValue.trim());
      inputRef.current?.blur();
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setShowSuggestions(val.length > 0);

    // Ghost prefetch when typing URLs
    if (val.length > 5) {
      const matchedSite = Object.keys(siteDatabase).find(url =>
        url.toLowerCase().includes(val.toLowerCase())
      );
      if (matchedSite && !ghostUrls.includes(matchedSite)) {
        onGhostPrefetch(matchedSite);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
    inputRef.current?.select();
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const filteredSuggestions = defaultSuggestions.filter(s =>
    s.url.toLowerCase().includes(inputValue.toLowerCase()) ||
    s.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  const isSecure = activeTab?.url.startsWith('https://');
  const isComet = activeTab?.url.startsWith('comet://');

  return (
    <div className="relative flex items-center gap-2 px-3 py-2 bg-surface-800">
      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-md text-surface-400 hover:text-surface-100 hover:bg-surface-600 transition-all">
          <ArrowLeft size={14} />
        </button>
        <button className="p-1.5 rounded-md text-surface-400 hover:text-surface-100 hover:bg-surface-600 transition-all">
          <ArrowRight size={14} />
        </button>
        <button
          onClick={onCometReload}
          className={`p-1.5 rounded-md transition-all ${
            cometReloadActive
              ? 'text-comet-400 bg-comet-900/30 animate-spin-slow'
              : 'text-surface-400 hover:text-surface-100 hover:bg-surface-600'
          }`}
          title="Comet Reload (Ctrl+R) — preserves state"
        >
          <RotateCw size={14} />
        </button>
      </div>

      {/* Address input */}
      <form onSubmit={handleSubmit} className="flex-1 relative">
        <div className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-150
          ${isFocused
            ? 'bg-surface-900 border-comet-500/50 glow-border'
            : 'bg-surface-700 border-surface-600 hover:border-surface-500'
          }
        `}>
          {/* Security indicator */}
          {isComet ? (
            <Zap size={13} className="text-comet-400 flex-shrink-0" />
          ) : isSecure ? (
            <Shield size={13} className="text-glow-green flex-shrink-0" />
          ) : (
            <Search size={13} className="text-surface-400 flex-shrink-0" />
          )}

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search or enter URL..."
            className="flex-1 bg-transparent text-sm text-surface-50 placeholder:text-surface-400 outline-none font-mono"
          />

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-comet-400 animate-pulse" />
              <span className="text-[10px] text-comet-400 font-mono">streaming</span>
            </div>
          )}

          {/* Ghost tab indicator */}
          {ghostUrls.some(u => u.includes(inputValue)) && !isLoading && inputValue.length > 3 && (
            <div className="flex items-center gap-1">
              <Ghost size={12} className="text-glow-purple" />
              <span className="text-[10px] text-glow-purple font-mono">prefetched</span>
            </div>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-800 border border-surface-600 rounded-lg overflow-hidden shadow-2xl z-50 animate-slide-up">
            {filteredSuggestions.map((s, i) => (
              <button
                key={s.url}
                type="button"
                onClick={() => {
                  setInputValue(s.url);
                  onNavigate(s.url);
                  setShowSuggestions(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-700 transition-colors"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <span className="text-base">{s.favicon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-surface-100 truncate">{s.title}</div>
                  <div className="text-xs text-surface-400 font-mono truncate">{s.url}</div>
                </div>
                {ghostUrls.includes(s.url) && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-glow-purple/10 border border-glow-purple/20">
                    <Ghost size={10} className="text-glow-purple" />
                    <span className="text-[9px] text-glow-purple font-mono">ghost</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Comet Reload indicator */}
      {cometReloadActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-surface-700 comet-loading-bar" />
      )}

      {/* Loading bar */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-surface-700 comet-loading-bar" />
      )}
    </div>
  );
}
