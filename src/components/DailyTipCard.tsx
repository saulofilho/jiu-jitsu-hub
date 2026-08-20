import React, { useState, useEffect } from 'react';
import { DAILY_TIPS, DailyTip } from '../data/dailyTips';
import { Sparkles, RefreshCw, ChevronRight, Lightbulb, BookOpen, ScrollText, Scale, X, Flame } from 'lucide-react';

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
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'regras':
        return <Scale className="w-4 h-4 text-sky-400" />;
      case 'filosofia':
        return <ScrollText className="w-4 h-4 text-emerald-400" />;
      case 'historia':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'tecnica':
      default:
        return <Flame className="w-4 h-4 text-orange-400" />;
    }
  };

  const getBadgeColors = (cat: DailyTip['category']) => {
    switch (cat) {
      case 'invisivel':
        return 'bg-amber-950/70 border-amber-800/80 text-amber-300';
      case 'regras':
        return 'bg-sky-950/70 border-sky-800/80 text-sky-300';
      case 'filosofia':
        return 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300';
      case 'historia':
        return 'bg-purple-950/70 border-purple-800/80 text-purple-300';
      case 'tecnica':
      default:
        return 'bg-orange-950/70 border-orange-800/80 text-orange-300';
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
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/40 rounded-full transition-all"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Ver Dica do Dia</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="daily-tip-banner"
      className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-zinc-900/90 border border-amber-500/30 p-5 sm:p-6 shadow-xl shadow-amber-950/10 backdrop-blur-sm group"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-10 w-32 h-32 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5 shadow-inner">
            <Lightbulb className="w-5 h-5" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Dica do Dia & Segredo Técnico
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getBadgeColors(
                  currentTip.category
                )}`}
              >
                {getCategoryIcon(currentTip.category)}
                {currentTip.badge}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              {currentTip.title}
            </h3>

            <p className="text-sm text-zinc-300 leading-relaxed max-w-4xl">
              {currentTip.content}
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-zinc-400 italic">
              <span>— {currentTip.authorOrSource}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800/80 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <button
              id="btn-next-random-tip"
              onClick={getRandomTip}
              title="Sortear outra dica"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/60 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Outra Dica</span>
            </button>

            {currentTip.targetTab && onNavigate && (
              <button
                id="btn-tip-action"
                onClick={() => onNavigate(currentTip.targetTab!)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>{currentTip.actionText || 'Explorar'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            id="btn-dismiss-daily-tip"
            onClick={handleDismiss}
            title="Ocultar por enquanto"
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
