import React, { useState, useEffect } from 'react';
import { DAILY_TIPS, DailyTip } from '../data/dailyTips';
import { Sparkles, RefreshCw, ChevronRight, Lightbulb, BookOpen, ScrollText, Scale, X, Flame, Swords } from 'lucide-react';

interface DailyTipCardProps {
  onNavigate?: (tab: string) => void;
}

export function DailyTipCard({ onNavigate }: DailyTipCardProps) {
  const [currentTip, setCurrentTip] = useState<DailyTip>(() => {
    // Escolhe aleatoriamente ou busca o último salvo da sessão
    const randomIndex = Math.floor(Math.random() * DAILY_TIPS.length);
    return DAILY_TIPS[randomIndex] || DAILY_TIPS[0];
  });
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('bjj_daily_tip_dismissed') === 'true';
  });
  const [isRotating, setIsRotating] = useState(false);

  const getCategoryIcon = (cat: DailyTip['category']) => {
    switch (cat) {
      case 'invisivel':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'regras':
        return <Scale className="w-3.5 h-3.5 text-sky-400" />;
      case 'filosofia':
        return <ScrollText className="w-3.5 h-3.5 text-emerald-400" />;
      case 'historia':
        return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
      case 'tecnica':
      default:
        return <Flame className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  const getBadgeColors = (cat: DailyTip['category']) => {
    switch (cat) {
      case 'invisivel':
        return 'bg-amber-950/80 border-amber-600/60 text-amber-300';
      case 'regras':
        return 'bg-sky-950/80 border-sky-600/60 text-sky-300';
      case 'filosofia':
        return 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300';
      case 'historia':
        return 'bg-purple-950/80 border-purple-600/60 text-purple-300';
      case 'tecnica':
      default:
        return 'bg-red-950/80 border-red-600/60 text-red-300';
    }
  };

  const getRandomTip = () => {
    setIsRotating(true);
    setTimeout(() => {
      const remaining = DAILY_TIPS.filter((t) => t.id !== currentTip.id);
      const nextTip = remaining[Math.floor(Math.random() * remaining.length)] || DAILY_TIPS[0];
      setCurrentTip(nextTip);
      setIsRotating(false);
    }, 200);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('bjj_daily_tip_dismissed', 'true');
  };

  if (isDismissed) {
    return (
      <div className="mb-6 flex justify-end">
        <button
          id="btn-reopen-daily-tip"
          onClick={() => {
            setIsDismissed(false);
            sessionStorage.removeItem('bjj_daily_tip_dismissed');
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-zinc-900/90 hover:bg-zinc-800 border border-amber-500/30 rounded-lg transition-all shadow-md"
        >
          <span className="font-kanji text-xs text-red-400">心得</span>
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Ver Dica do Mestre</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="daily-tip-banner"
      className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#121217] via-[#101015] to-[#0d0d12] border border-red-900/40 p-5 sm:p-6 shadow-2xl shadow-black/80 backdrop-blur-xl group katana-sheen"
    >
      {/* Decorative martial backdrop accents */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Subtle Japanese Watermark in background */}
      <div className="absolute -right-4 -bottom-6 font-kanji text-8xl font-black text-white/[0.02] select-none pointer-events-none">
        秘伝
      </div>

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-600/20 to-amber-500/10 border border-red-500/30 text-amber-400 shrink-0 mt-0.5 shadow-lg shadow-red-950/40">
            <Swords className="w-5 h-5 text-red-400" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-warrior font-bold uppercase tracking-widest text-red-400 flex items-center gap-1.5">
                <span className="font-kanji text-xs text-red-500">心得</span>
                <span>Sabedoria do Tatame & Bushido</span>
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeColors(
                  currentTip.category
                )}`}
              >
                {getCategoryIcon(currentTip.category)}
                {currentTip.badge}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-warrior font-bold text-white tracking-wide flex items-center gap-2">
              {currentTip.title}
            </h3>

            <p className="text-sm text-zinc-300 leading-relaxed max-w-4xl font-normal">
              {currentTip.content}
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-zinc-400 italic">
              <span className="text-amber-400/80 font-serif">— {currentTip.authorOrSource}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800/80 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <button
              id="btn-next-random-tip"
              onClick={getRandomTip}
              title="Sortear outro ensinamento"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 transition-all hover:border-zinc-700 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin text-red-400' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">Outro Ensinamento</span>
            </button>

            {currentTip.targetTab && onNavigate && (
              <button
                id="btn-tip-action"
                onClick={() => onNavigate(currentTip.targetTab!)}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-zinc-950 text-xs font-bold shadow-lg shadow-red-900/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>{currentTip.actionText || 'Ver no Dojo'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            id="btn-dismiss-daily-tip"
            onClick={handleDismiss}
            title="Ocultar ensinamento"
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
