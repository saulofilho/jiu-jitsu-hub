import React from 'react';
import { Sparkles, Trophy, ChevronRight, Award, Zap, Flame, Shield, ArrowUpRight } from 'lucide-react';
import { UserXPProgress, calculateTechniqueXP } from '../utils/xpSystem';
import { BeltLevel } from '../types';

interface BeltRankProgressBarProps {
  progress: UserXPProgress;
  variant?: 'full' | 'compact' | 'minimal';
  onNavigateToProfile?: () => void;
}

const BELT_COLOR_STYLES: Record<BeltLevel, {
  beltBg: string;
  beltBorder: string;
  tipBg: string;
  tipBorder: string;
  stripeColor: string;
  textGlow: string;
}> = {
  branca: {
    beltBg: 'bg-stone-100',
    beltBorder: 'border-stone-300',
    tipBg: 'bg-zinc-950',
    tipBorder: 'border-zinc-800',
    stripeColor: 'bg-white',
    textGlow: 'text-stone-900'
  },
  azul: {
    beltBg: 'bg-blue-600',
    beltBorder: 'border-blue-700',
    tipBg: 'bg-zinc-950',
    tipBorder: 'border-zinc-800',
    stripeColor: 'bg-white',
    textGlow: 'text-blue-400'
  },
  roxa: {
    beltBg: 'bg-purple-600',
    beltBorder: 'border-purple-700',
    tipBg: 'bg-zinc-950',
    tipBorder: 'border-zinc-800',
    stripeColor: 'bg-white',
    textGlow: 'text-purple-400'
  },
  marrom: {
    beltBg: 'bg-amber-900',
    beltBorder: 'border-amber-950',
    tipBg: 'bg-zinc-950',
    tipBorder: 'border-zinc-800',
    stripeColor: 'bg-white',
    textGlow: 'text-amber-500'
  },
  preta: {
    beltBg: 'bg-zinc-900',
    beltBorder: 'border-red-600/60',
    tipBg: 'bg-red-600',
    tipBorder: 'border-red-700',
    stripeColor: 'bg-white',
    textGlow: 'text-red-400'
  },
  coral: {
    beltBg: 'bg-gradient-to-r from-red-600 via-zinc-900 to-red-600',
    beltBorder: 'border-red-500',
    tipBg: 'bg-zinc-950',
    tipBorder: 'border-red-500',
    stripeColor: 'bg-amber-300',
    textGlow: 'text-amber-400'
  },
  vermelha: {
    beltBg: 'bg-red-700',
    beltBorder: 'border-amber-500',
    tipBg: 'bg-amber-500',
    tipBorder: 'border-amber-600',
    stripeColor: 'bg-white',
    textGlow: 'text-amber-300'
  }
};

export function BeltRankProgressBar({
  progress,
  variant = 'full',
  onNavigateToProfile
}: BeltRankProgressBarProps) {
  const {
    totalXP,
    currentTier,
    nextTier,
    xpInCurrentTier,
    xpRequiredForNextTier,
    tierProgressPercentage,
    trainedCount,
    totalTechniquesCount
  } = progress;

  const beltStyle = BELT_COLOR_STYLES[currentTier.belt] || BELT_COLOR_STYLES.branca;

  // Minimal variant (for inline navbar or small widgets)
  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-xs font-black text-amber-400 font-mono">
            {totalXP} XP
          </span>
        </div>

        <div className="h-3 w-px bg-zinc-800" />

        <div className="flex items-center gap-1.5">
          {/* Mini Physical Belt Graphic */}
          <div className={`h-4 w-12 rounded relative overflow-hidden flex items-center justify-between border ${beltStyle.beltBg} ${beltStyle.beltBorder}`}>
            <div className={`h-full w-4 ${beltStyle.tipBg} border-l border-zinc-800 flex items-center justify-evenly px-0.5 ml-auto`}>
              {[1, 2, 3, 4].map(degreeNum => (
                <span
                  key={degreeNum}
                  className={`w-0.5 h-3 rounded-full transition-all ${
                    degreeNum <= currentTier.degrees ? beltStyle.stripeColor : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-[11px] font-bold text-zinc-300 truncate max-w-[120px]">
            Nível {currentTier.level}
          </span>
        </div>
      </div>
    );
  }

  // Compact variant (for cards and modals)
  if (variant === 'compact') {
    return (
      <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-zinc-100 block">
                Nível {currentTier.level}: {currentTier.name}
              </span>
              <span className="text-[10px] text-amber-400/90 font-medium">
                {currentTier.title}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-black text-white">{totalXP} XP</span>
            <span className="text-[10px] text-zinc-500 block">
              {nextTier ? `Próximo: ${nextTier.minXP} XP` : 'Nível Máximo'}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${tierProgressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>{xpInCurrentTier} / {xpRequiredForNextTier} XP para o próximo grau</span>
            <span className="font-bold text-amber-400">{tierProgressPercentage}%</span>
          </div>
        </div>
      </div>
    );
  }

  // Full Rich Variant (for the Profile Tab & Main Dashboard)
  return (
    <div
      id="bjj-belt-rank-progress-full"
      className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mt-20" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mb-20" />

      {/* Top Banner: Level Badge, XP Total, & Rank Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-amber-500/40 flex items-center justify-center p-2 shadow-lg shadow-amber-500/10 shrink-0">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider">
                Nível {currentTier.level}
              </span>
              <h2 className="text-lg font-black text-white tracking-tight">
                {currentTier.name}
              </h2>
            </div>
            <p className="text-xs text-amber-400 font-bold mt-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentTier.title}</span>
            </p>
          </div>
        </div>

        {/* Total XP Score Pill */}
        <div className="flex items-center gap-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl px-4 py-2.5 shrink-0">
          <Zap className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
              XP Total Acumulado
            </span>
            <span className="text-lg font-black text-white font-mono leading-none">
              {totalXP.toLocaleString()} <span className="text-xs text-amber-400">XP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Realistic Visual Belt Representation with Degrees (Graus) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-zinc-400" />
            <span>Faixa de Graduação Atual ({currentTier.degrees} de 4 Graus)</span>
          </span>
          <span className="text-zinc-400 text-[11px] font-mono">
            {trainedCount} de {totalTechniquesCount} Técnicas Treinadas
          </span>
        </div>

        {/* Physical Belt Container */}
        <div className="relative w-full h-12 sm:h-14 rounded-2xl bg-zinc-950 border-2 border-zinc-800 flex items-center px-4 shadow-inner overflow-hidden">
          {/* Main Belt Body */}
          <div className={`w-full h-8 sm:h-9 rounded-xl relative overflow-hidden flex items-center justify-between border-y border-r shadow-md ${beltStyle.beltBg} ${beltStyle.beltBorder}`}>
            {/* Texture stitching lines */}
            <div className="w-full h-full flex flex-col justify-between py-1 opacity-20 pointer-events-none">
              <div className="w-full h-[1px] bg-black" />
              <div className="w-full h-[1px] bg-black" />
              <div className="w-full h-[1px] bg-black" />
            </div>

            {/* Belt Rank Bar Tip (Ponteira Preta ou Vermelha para os Graus) */}
            <div className={`absolute right-0 top-0 bottom-0 w-24 sm:w-28 ${beltStyle.tipBg} border-l-2 ${beltStyle.tipBorder} flex items-center justify-evenly px-2 shadow-lg`}>
              {[1, 2, 3, 4].map((degreeNumber) => {
                const isEarned = degreeNumber <= currentTier.degrees;
                return (
                  <div
                    key={degreeNumber}
                    title={isEarned ? `${degreeNumber}º Grau Conquistado` : `${degreeNumber}º Grau Bloqueado`}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className={`w-2 sm:w-2.5 h-6 sm:h-7 rounded-sm transition-all duration-300 ${
                        isEarned
                          ? `${beltStyle.stripeColor} shadow-md shadow-white/50 ring-1 ring-white/80`
                          : 'bg-zinc-800/80 border border-zinc-700/50 opacity-40'
                      }`}
                    />
                    <span className="text-[8px] font-mono font-bold text-zinc-400">
                      {degreeNumber}º
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Progression Gauge / XP Fill Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-200 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Progresso para o Próximo Grau / Graduação</span>
          </span>
          <span className="font-mono text-zinc-400">
            <span className="text-white font-black">{xpInCurrentTier}</span> / {xpRequiredForNextTier} XP
            <span className="text-amber-400 font-bold ml-1.5">({tierProgressPercentage}%)</span>
          </span>
        </div>

        {/* Visual Fill Bar */}
        <div className="w-full h-3.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-700 relative shadow-sm"
            style={{ width: `${tierProgressPercentage}%` }}
          >
            {tierProgressPercentage > 8 && (
              <div className="absolute right-1 top-0 bottom-0 w-2 bg-white/50 rounded-full animate-pulse" />
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-400 pt-1">
          <span>
            Desbloqueio atual: <strong className="text-zinc-200">{currentTier.unlockedPerk}</strong>
          </span>
          {nextTier && (
            <span className="text-amber-400/90 font-medium mt-0.5 sm:mt-0">
              Próximo Nível ({nextTier.name}): faltam{' '}
              <strong className="text-amber-300 font-mono">{nextTier.minXP - totalXP} XP</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
