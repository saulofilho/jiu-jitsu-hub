import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles, X, Flame, Zap } from 'lucide-react';
import { AchievementBadge } from '../types';

interface BadgeUnlockToastProps {
  unlockedBadge: AchievementBadge | null;
  onClose: () => void;
}

export function BadgeUnlockToast({ unlockedBadge, onClose }: BadgeUnlockToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (unlockedBadge) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [unlockedBadge, onClose]);

  if (!unlockedBadge || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-zinc-950 border-2 border-amber-400/80 rounded-2xl p-4 shadow-2xl shadow-amber-500/20 text-white flex items-start gap-3.5 relative overflow-hidden">
        {/* Glow shimmer */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="w-12 h-12 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
          <Trophy className="w-6 h-6 animate-bounce" />
        </div>

        <div className="space-y-1 flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nova Conquista Desbloqueada!</span>
          </div>
          <h4 className="text-sm font-black text-white truncate">{unlockedBadge.title}</h4>
          <p className="text-xs text-zinc-300 leading-snug line-clamp-2">
            {unlockedBadge.description}
          </p>
          <div className="pt-1 flex items-center gap-2 text-[11px] font-mono font-bold text-amber-300">
            <span>+{unlockedBadge.xpReward} XP</span>
            {unlockedBadge.perk && (
              <>
                <span>•</span>
                <span className="truncate">{unlockedBadge.perk}</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
