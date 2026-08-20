import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Flame,
  Zap,
  Shield,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  Layers,
  Heart,
  Bot,
  HelpCircle,
  Crown,
  TrendingUp,
  Target,
  Crosshair,
  Filter,
  Lock,
  PlusCircle
} from 'lucide-react';
import { AchievementBadge, BadgeRarity, BadgeCategory } from '../types';
import { StreakData, recordDailyCheckIn, incrementStreakCounter, setCustomStreakForTesting } from '../utils/streakTracker';

interface BadgeShowcaseProps {
  badges: AchievementBadge[];
  streakData: StreakData;
  onStreakUpdate?: () => void;
  onDrillAdd?: () => void;
}

const RARITY_CONFIG: Record<
  BadgeRarity,
  { label: string; bg: string; border: string; text: string; badgeGlow: string; iconBg: string }
> = {
  bronze: {
    label: 'Bronze',
    bg: 'bg-amber-950/25',
    border: 'border-amber-700/40',
    text: 'text-amber-300',
    badgeGlow: 'shadow-amber-800/20',
    iconBg: 'bg-amber-800/30 text-amber-300 border-amber-700/50'
  },
  prata: {
    label: 'Prata',
    bg: 'bg-slate-900/40',
    border: 'border-slate-400/40',
    text: 'text-slate-200',
    badgeGlow: 'shadow-slate-500/20',
    iconBg: 'bg-slate-700/30 text-slate-200 border-slate-400/50'
  },
  ouro: {
    label: 'Ouro',
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/50',
    text: 'text-amber-400',
    badgeGlow: 'shadow-amber-400/20',
    iconBg: 'bg-amber-500/20 text-amber-300 border-amber-400/60'
  },
  diamante: {
    label: 'Diamante',
    bg: 'bg-cyan-950/30',
    border: 'border-cyan-400/50',
    text: 'text-cyan-300',
    badgeGlow: 'shadow-cyan-400/30',
    iconBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60'
  },
  lendario: {
    label: 'Lendário',
    bg: 'bg-gradient-to-br from-purple-950/40 via-pink-950/30 to-zinc-950',
    border: 'border-purple-400/60',
    text: 'text-pink-300',
    badgeGlow: 'shadow-purple-500/30',
    iconBg: 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-pink-300 border-purple-400/70'
  }
};

const CATEGORY_CONFIG: Record<BadgeCategory, { label: string; icon: any }> = {
  repertorio: { label: 'Repertório & Técnicas', icon: BookOpen },
  disciplina: { label: 'Disciplina & Sequência', icon: Flame },
  fundamentos: { label: 'Especialidades', icon: Shield },
  conhecimento: { label: 'Teoria & Estudos', icon: Bot },
  mestria: { label: 'Jiu-Jitsu Invisível', icon: Crown }
};

export function BadgeShowcase({
  badges,
  streakData,
  onStreakUpdate,
  onDrillAdd
}: BadgeShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [statusFilter, setStatusFilter] = useState<'todas' | 'unlocked' | 'locked'>('todas');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [checkInCelebration, setCheckInCelebration] = useState(false);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;
  const completionPct = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const filteredBadges = badges.filter(badge => {
    const matchesCategory = selectedCategory === 'todas' || badge.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'todas' ||
      (statusFilter === 'unlocked' && badge.unlocked) ||
      (statusFilter === 'locked' && !badge.unlocked);
    return matchesCategory && matchesStatus;
  });

  const getBadgeIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Target': return <Target className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'CheckCircle2': return <CheckCircle2 className={className} />;
      case 'Calendar': return <Calendar className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Crosshair': return <Crosshair className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Bot': return <Bot className={className} />;
      case 'HelpCircle': return <HelpCircle className={className} />;
      default: return <Star className={className} />;
    }
  };

  const handleCheckInClick = () => {
    recordDailyCheckIn();
    setCheckInCelebration(true);
    setTimeout(() => setCheckInCelebration(false), 3000);
    if (onStreakUpdate) onStreakUpdate();
  };

  const handleSimulateStreak = (days: number) => {
    setCustomStreakForTesting(days);
    if (onStreakUpdate) onStreakUpdate();
  };

  return (
    <div id="badges-showcase-section" className="space-y-6">
      {/* DAILY STREAK & HABIT BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 border border-zinc-800 p-6 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Streak Stat */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex items-center justify-center p-1 shrink-0 transition-all ${
              streakData.currentStreak >= 10
                ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-xl shadow-amber-500/20 animate-pulse'
                : streakData.currentStreak >= 3
                ? 'bg-orange-500/15 border-orange-400 text-orange-400 shadow-lg shadow-orange-500/10'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}>
              <div className="text-center">
                <Flame className="w-7 h-7 sm:w-8 sm:h-8 mx-auto fill-current" />
                <span className="text-xs font-black font-mono block -mt-1">
                  {streakData.currentStreak}d
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Sequência no Tatame</span>
                  {streakData.currentStreak >= 10 && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                      ⚡ Hábito de Samurai Ativo
                    </span>
                  )}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                Você acumulou <strong className="text-amber-400 font-bold">{streakData.currentStreak} dias consecutivos</strong> de estudos e treinos de Jiu-Jitsu.
                {streakData.currentStreak < 10 && (
                  <span className="text-zinc-500 ml-1">
                    (Faltam {10 - streakData.currentStreak} dias para a badge <em>Hábito de Samurai</em>).
                  </span>
                )}
              </p>

              {/* Weekly History Dots */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-zinc-500 mr-1">Histórico:</span>
                {[6, 5, 4, 3, 2, 1, 0].map((daysAgo) => {
                  const d = new Date();
                  d.setDate(d.getDate() - daysAgo);
                  const y = d.getFullYear();
                  const m = String(d.getMonth() + 1).padStart(2, '0');
                  const day = String(d.getDate()).padStart(2, '0');
                  const dateStr = `${y}-${m}-${day}`;
                  const isActive = streakData.historyDates?.includes(dateStr);
                  const isToday = daysAgo === 0;

                  return (
                    <div
                      key={dateStr}
                      title={`${dateStr} ${isActive ? '(Treinado)' : '(Sem check-in)'}`}
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold transition-all ${
                        isActive
                          ? 'bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/30'
                          : 'bg-zinc-800/80 text-zinc-600 border border-zinc-700/50'
                      } ${isToday ? 'ring-2 ring-amber-400/50' : ''}`}
                    >
                      {isActive ? '✓' : '·'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Interactive Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              id="btn-daily-checkin"
              onClick={handleCheckInClick}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                streakData.hasCheckedInToday
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-amber-500/20 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {streakData.hasCheckedInToday ? 'Presença Confirmada Hoje ✓' : 'Marcar Presença no Tatame Hoje'}
              </span>
            </button>

            {/* Quick Helper / Milestone Simulators for Evaluation & Testing */}
            <div className="flex items-center gap-1.5 justify-end">
              <button
                onClick={() => handleSimulateStreak(10)}
                title="Avançar sequência para 10 dias consecutivos"
                className="px-2.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-[11px] font-bold text-amber-400 border border-zinc-800 hover:border-amber-500/30 transition-all"
              >
                +10 Dias (Streak)
              </button>
              {onDrillAdd && (
                <button
                  onClick={onDrillAdd}
                  title="Registrar drills adicionais para atingir 50 técnicas"
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-[11px] font-bold text-emerald-400 border border-zinc-800 hover:border-emerald-500/30 transition-all flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+5 Técnicas/Drills</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HEADER AND FILTERS */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-black text-white tracking-tight">
                Galeria de Badges & Conquistas
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Complete marcos de repertório (50 técnicas), disciplina (10 dias seguidos), e fundamentos para desbloquear insígnias lendárias.
            </p>
          </div>

          {/* Unlocked Counter Pill */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-3 shadow-inner">
              <div className="text-right">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Desbloqueadas
                </span>
                <span className="text-base font-black font-mono text-amber-400">
                  {unlockedCount} <span className="text-zinc-600">/ {totalCount}</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">
                {completionPct}%
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategory('todas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'todas'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Todas as Categorias ({totalCount})
            </button>
            {(Object.keys(CATEGORY_CONFIG) as BadgeCategory[]).map(catKey => {
              const cat = CATEGORY_CONFIG[catKey];
              const Icon = cat.icon;
              const count = badges.filter(b => b.category === catKey).length;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    selectedCategory === catKey
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Status Filter Toggle */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setStatusFilter('todas')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'todas' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('unlocked')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'unlocked' ? 'bg-emerald-500 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Conquistadas ({unlockedCount})
            </button>
            <button
              onClick={() => setStatusFilter('locked')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'locked' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Bloqueadas ({totalCount - unlockedCount})
            </button>
          </div>
        </div>

        {/* BADGES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges.map(badge => {
            const rarity = RARITY_CONFIG[badge.rarity];
            const pct = Math.min(100, Math.round((badge.progress / badge.target) * 100));

            return (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                onClick={() => setSelectedBadge(badge)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                  badge.unlocked
                    ? `${rarity.bg} ${rarity.border} ${rarity.badgeGlow} hover:scale-[1.02] hover:border-amber-400`
                    : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Top Corner Glow on Unlocked */}
                {badge.unlocked && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="space-y-3 relative">
                  {/* Badge Header: Icon + Rarity Tag */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:scale-110 ${
                        badge.unlocked ? rarity.iconBg : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                      }`}
                    >
                      {badge.unlocked ? (
                        getBadgeIcon(badge.iconName, 'w-6 h-6')
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          badge.unlocked
                            ? 'bg-zinc-950/80 ' + rarity.text + ' ' + rarity.border
                            : 'bg-zinc-900/80 text-zinc-500 border-zinc-800'
                        }`}
                      >
                        {rarity.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-400/90">
                        +{badge.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4
                      className={`text-base font-bold tracking-tight ${
                        badge.unlocked ? 'text-white' : 'text-zinc-300'
                      }`}
                    >
                      {badge.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Footer: Progress or Unlock Status */}
                <div className="pt-4 mt-3 border-t border-zinc-800/60 relative">
                  {badge.unlocked ? (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Conquistado</span>
                      </span>
                      {badge.unlockedAt && (
                        <span className="text-[11px] font-mono text-zinc-500">
                          {badge.unlockedAt}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-500 text-[11px]">Progresso</span>
                        <span className="text-zinc-300 font-bold">
                          {badge.progress} / {badge.target} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED BADGE MODAL */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Icon */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className={`w-20 h-20 rounded-3xl border-2 flex items-center justify-center shadow-xl ${
                  selectedBadge.unlocked
                    ? RARITY_CONFIG[selectedBadge.rarity].iconBg
                    : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                }`}
              >
                {selectedBadge.unlocked ? (
                  getBadgeIcon(selectedBadge.iconName, 'w-10 h-10')
                ) : (
                  <Lock className="w-8 h-8" />
                )}
              </div>

              <div className="space-y-1">
                <span
                  className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                    RARITY_CONFIG[selectedBadge.rarity].text
                  } ${RARITY_CONFIG[selectedBadge.rarity].border} bg-zinc-950`}
                >
                  Badge {RARITY_CONFIG[selectedBadge.rarity].label}
                </span>
                <h3 className="text-xl font-black text-white pt-1">{selectedBadge.title}</h3>
              </div>
            </div>

            {/* Criteria & Details */}
            <div className="bg-zinc-950/80 rounded-2xl p-4 border border-zinc-800 space-y-3 text-xs">
              <div className="text-zinc-300 leading-relaxed">
                <strong className="text-zinc-100 block mb-1">Critério de Desbloqueio:</strong>
                {selectedBadge.description}
              </div>

              {selectedBadge.perk && (
                <div className="pt-2 border-t border-zinc-800/80 text-amber-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Benefício/Título: {selectedBadge.perk}</span>
                </div>
              )}

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-zinc-400">
                <span>Recompensa em XP:</span>
                <span className="text-amber-400 font-bold font-mono text-sm">
                  +{selectedBadge.xpReward} XP
                </span>
              </div>
            </div>

            {/* Status Button / Close */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
