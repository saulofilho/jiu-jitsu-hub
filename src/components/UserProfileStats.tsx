import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Award,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Flame,
  Layers,
  ArrowRight,
  TrendingUp,
  Target,
  Trophy,
  Filter,
  RefreshCw,
  BookOpen,
  Info,
  Calendar,
  Zap,
  Shield,
  Star,
  Camera,
  Edit3,
  User,
  Bell,
  BellRing,
  Clock,
  Play,
  Github,
  Globe
} from 'lucide-react';
import { Technique, BeltLevel, TechniqueCategory } from '../types';
import { TECHNIQUES } from '../data/techniques';
import { getUserXPProgress, calculateTechniqueXP } from '../utils/xpSystem';
import { BeltRankProgressBar } from './BeltRankProgressBar';
import { BadgeShowcase } from './BadgeShowcase';
import { loadStreakData, incrementStreakCounter } from '../utils/streakTracker';
import { ProfilePhotoModal } from './ProfilePhotoModal';
import {
  ReminderConfig,
  loadReminderConfig,
  saveReminderConfig,
  PRESET_TIMES,
  THEME_MESSAGES,
  getNotificationPermission,
  requestNotificationPermission,
  triggerPushNotification,
  playMartialChime
} from '../utils/notificationSystem';

interface UserProfileStatsProps {
  userBelt: BeltLevel;
  setUserBelt: (belt: BeltLevel) => void;
  trainedMoves: string[];
  toggleTrained: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onNavigateToTechnique?: (technique: Technique) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenReminderModal?: () => void;
  onOpenDeployGuideModal?: () => void;
}

const BELT_CONFIG: Record<BeltLevel, { label: string; bg: string; text: string; border: string; desc: string }> = {
  branca: {
    label: 'Faixa Branca',
    bg: 'bg-stone-100',
    text: 'text-stone-900',
    border: 'border-stone-300',
    desc: 'Fase de sobrevivência, criação de base e entendimento dos fundamentos corporais.'
  },
  azul: {
    label: 'Faixa Azul',
    bg: 'bg-blue-600',
    text: 'text-white',
    border: 'border-blue-700',
    desc: 'Fase técnica, expansão de repertório de guardas, raspagens e passagens.'
  },
  roxa: {
    label: 'Faixa Roxa',
    bg: 'bg-purple-600',
    text: 'text-white',
    border: 'border-purple-700',
    desc: 'Fase de refinamento de combinações, velocidade de raciocínio e Jiu-Jitsu autoral.'
  },
  marrom: {
    label: 'Faixa Marrom',
    bg: 'bg-amber-900',
    text: 'text-amber-100',
    border: 'border-amber-950',
    desc: 'Lapidação cirúrgica, domínio de alavancas avançadas, ataques de perna e pressão.'
  },
  preta: {
    label: 'Faixa Preta',
    bg: 'bg-zinc-900',
    text: 'text-red-500',
    border: 'border-red-600',
    desc: 'Mestria dos fundamentos, Jiu-Jitsu invisível, eficiência com mínimo esforço.'
  },
  coral: {
    label: 'Faixa Coral',
    bg: 'bg-gradient-to-r from-red-600 via-zinc-900 to-red-600',
    text: 'text-white',
    border: 'border-red-600',
    desc: 'Mestre 7º/8º Grau - Décadas de dedicação ao ensino e evolução da arte suave.'
  },
  vermelha: {
    label: 'Faixa Vermelha',
    bg: 'bg-red-700',
    text: 'text-amber-300',
    border: 'border-amber-500',
    desc: 'Grande Mestre 9º/10º Grau - O ápice e a sabedoria viva do Jiu-Jitsu brasileiro.'
  },
};

const CATEGORY_NAMES: Record<TechniqueCategory, string> = {
  finalizacao: 'Finalizações',
  raspagem: 'Raspagens',
  passagem: 'Passagens de Guarda',
  queda: 'Quedas & Projeções',
  defesa: 'Defesas & Fugas',
  guarda: 'Controle de Guarda',
  posicao: 'Posições & Estabilização'
};

const CATEGORY_COLORS: Record<TechniqueCategory, string> = {
  finalizacao: '#ef4444', // Vermelho
  raspagem: '#f59e0b',   // Âmbar/Laranja
  passagem: '#3b82f6',   // Azul
  queda: '#8b5cf6',      // Roxo
  defesa: '#10b981',     // Esmeralda
  guarda: '#06b6d4',     // Ciano
  posicao: '#ec4899',    // Rosa
};

export function UserProfileStats({
  userBelt,
  setUserBelt,
  trainedMoves,
  toggleTrained,
  favorites,
  toggleFavorite,
  onNavigateToTechnique,
  onNavigateTab,
  onOpenReminderModal,
  onOpenDeployGuideModal
}: UserProfileStatsProps) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('todas');
  const [chartViewMode, setChartViewMode] = useState<'geral' | 'categorias' | 'faixas'>('geral');
  const [streakTrackerState, setStreakTrackerState] = useState(() => loadStreakData());
  const [reminderConfig, setReminderConfig] = useState<ReminderConfig>(() => loadReminderConfig());
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>(() => getNotificationPermission());
  const [testPushSent, setTestPushSent] = useState(false);

  // Profile photo and custom name saved in localStorage
  const [userPhoto, setUserPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('bjj_user_profile_photo') || null;
    } catch {
      return null;
    }
  });
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem('bjj_user_profile_name') || 'Praticante de Jiu-Jitsu';
    } catch {
      return 'Praticante de Jiu-Jitsu';
    }
  });
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const handleToggleReminderQuick = async () => {
    if (!reminderConfig.enabled && notifPermission !== 'granted') {
      const res = await requestNotificationPermission();
      setNotifPermission(res);
      if (res === 'granted') {
        const updated = { ...reminderConfig, enabled: true };
        setReminderConfig(updated);
        saveReminderConfig(updated);
      }
    } else {
      const updated = { ...reminderConfig, enabled: !reminderConfig.enabled };
      setReminderConfig(updated);
      saveReminderConfig(updated);
    }
  };

  const handleQuickTimeSelect = (timeStr: string) => {
    const updated = { ...reminderConfig, time: timeStr, enabled: true };
    setReminderConfig(updated);
    saveReminderConfig(updated);
  };

  const handleTestPushInProfile = async () => {
    if (notifPermission !== 'granted') {
      const res = await requestNotificationPermission();
      setNotifPermission(res);
      if (res !== 'granted') return;
    }

    const payload = reminderConfig.theme === 'custom' && reminderConfig.customMessage.trim()
      ? { title: '🥋 Teste do Lembrete Diário!', body: reminderConfig.customMessage.trim() }
      : THEME_MESSAGES[reminderConfig.theme](streakTrackerState.currentStreak || 1);

    const ok = triggerPushNotification(
      `[LEMBRETE] ${payload.title}`,
      { body: payload.body },
      reminderConfig.soundEnabled
    );

    if (ok) {
      setTestPushSent(true);
      setTimeout(() => setTestPushSent(false), 3500);
    }
  };

  const handleSaveProfilePhoto = (newPhoto: string | null, newName: string) => {
    setUserPhoto(newPhoto);
    setUserName(newName);
    try {
      if (newPhoto) {
        localStorage.setItem('bjj_user_profile_photo', newPhoto);
      } else {
        localStorage.removeItem('bjj_user_profile_photo');
      }
      localStorage.setItem('bjj_user_profile_name', newName);
    } catch (e) {
      console.error('Failed to save user profile photo/name:', e);
    }
  };

  const handleRefreshStreak = () => {
    setStreakTrackerState(loadStreakData());
  };

  const handleAddDrills = () => {
    incrementStreakCounter('drillsLoggedCount', 5);
    setStreakTrackerState(loadStreakData());
  };

  const totalTechniquesCount = TECHNIQUES.length;
  const trainedCount = trainedMoves.length;
  const untrainedCount = Math.max(0, totalTechniquesCount - trainedCount);
  const trainedPercentage = totalTechniquesCount > 0
    ? Math.round((trainedCount / totalTechniquesCount) * 100)
    : 0;

  // Calculate XP & Rank Progression based on trained moves, favorites and streak milestones
  const xpProgress = useMemo(() => {
    return getUserXPProgress(trainedMoves, TECHNIQUES, favorites, streakTrackerState);
  }, [trainedMoves, favorites, streakTrackerState]);

  // Recharts Donut Data - Overall Trained vs Untrained
  const overallDonutData = useMemo(() => {
    return [
      { name: 'Golpes Treinados', value: trainedCount, color: '#10b981' },
      { name: 'A Treinar / Pendentes', value: untrainedCount, color: '#27272a' }
    ];
  }, [trainedCount, untrainedCount]);

  // Recharts Donut Data - Category breakdown of trained moves
  const categoryDonutData = useMemo(() => {
    const trainedTechs = TECHNIQUES.filter((t) => trainedMoves.includes(t.id));
    const counts: Record<string, number> = {};

    trainedTechs.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });

    const data = Object.keys(counts).map((catKey) => ({
      name: CATEGORY_NAMES[catKey as TechniqueCategory] || catKey,
      value: counts[catKey],
      categoryKey: catKey,
      color: CATEGORY_COLORS[catKey as TechniqueCategory] || '#a1a1aa'
    }));

    if (data.length === 0) {
      return [{ name: 'Nenhum golpe treinado ainda', value: 1, color: '#3f3f46' }];
    }

    return data;
  }, [trainedMoves]);

  // Recharts Donut Data - Belt Level breakdown
  const beltDonutData = useMemo(() => {
    const trainedTechs = TECHNIQUES.filter((t) => trainedMoves.includes(t.id));
    const beltCounts: Record<string, number> = {
      branca: 0,
      azul: 0,
      roxa: 0,
      marrom: 0,
      preta: 0
    };

    trainedTechs.forEach((t) => {
      const b = t.minBelt in beltCounts ? t.minBelt : 'branca';
      beltCounts[b] = (beltCounts[b] || 0) + 1;
    });

    const beltColors: Record<string, string> = {
      branca: '#e4e4e7',
      azul: '#2563eb',
      roxa: '#9333ea',
      marrom: '#78350f',
      preta: '#ef4444'
    };

    const data = Object.keys(beltCounts)
      .filter((k) => beltCounts[k] > 0)
      .map((k) => ({
        name: BELT_CONFIG[k as BeltLevel]?.label || k,
        value: beltCounts[k],
        color: beltColors[k] || '#d97706'
      }));

    if (data.length === 0) {
      return [{ name: 'Nenhum golpe marcado', value: 1, color: '#3f3f46' }];
    }

    return data;
  }, [trainedMoves]);

  // Category completion rates
  const categoryStats = useMemo(() => {
    const categories: TechniqueCategory[] = ['finalizacao', 'raspagem', 'passagem', 'queda', 'defesa', 'guarda', 'posicao'];
    return categories.map((cat) => {
      const allInCat = TECHNIQUES.filter((t) => t.category === cat);
      const trainedInCat = allInCat.filter((t) => trainedMoves.includes(t.id));
      const pct = allInCat.length > 0 ? Math.round((trainedInCat.length / allInCat.length) * 100) : 0;
      return {
        category: cat,
        name: CATEGORY_NAMES[cat],
        total: allInCat.length,
        trained: trainedInCat.length,
        percentage: pct,
        color: CATEGORY_COLORS[cat]
      };
    });
  }, [trainedMoves]);

  // Filtered list of techniques for quick check
  const displayTechniques = useMemo(() => {
    return TECHNIQUES.filter((t) => {
      if (selectedCategoryFilter !== 'todas' && t.category !== selectedCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [selectedCategoryFilter]);

  const currentBeltInfo = BELT_CONFIG[userBelt];

  // Custom Donut Center Content
  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-zinc-100 flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: data.payload.color || data.color }}
            />
            {data.name}
          </p>
          <p className="text-zinc-300 font-mono">
            Quantidade: <span className="text-amber-400 font-bold">{data.value}</span>
            {chartViewMode === 'geral' && (
              <span className="text-zinc-400 ml-1">
                ({Math.round((data.value / totalTechniquesCount) * 100)}%)
              </span>
            )}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="user-profile-stats-container" className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Athlete Info & Belt with Custom Photo */}
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Athlete Photo / Avatar Container */}
            <div className="relative group shrink-0">
              <button
                type="button"
                id="btn-profile-photo-avatar"
                onClick={() => setIsPhotoModalOpen(true)}
                className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-zinc-950 border-2 border-amber-500/50 p-0.5 overflow-hidden cursor-pointer shadow-xl shadow-amber-500/10 hover:border-amber-400 transition-all group-hover:scale-105 block text-left relative"
                title="Clique para tirar foto com a câmera ou alterar imagem"
              >
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={userName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-zinc-900 flex flex-col items-center justify-center text-center p-1">
                    <Award className="w-8 h-8 text-amber-400" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">OSS</span>
                  </div>
                )}
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex flex-col items-center justify-center text-white">
                  <Camera className="w-5 h-5 text-amber-400 mb-0.5" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-300">Alterar</span>
                </div>
              </button>

              {/* Camera Action Overlay Badge */}
              <button
                type="button"
                id="btn-open-camera-modal"
                onClick={() => setIsPhotoModalOpen(true)}
                title="Capturar foto com a câmera"
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/30 border border-amber-400 transition-all hover:scale-110 active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>{userName}</span>
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(true)}
                    title="Editar foto e nome"
                    className="p-1 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/60 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </h1>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border ${currentBeltInfo.bg} ${currentBeltInfo.text} ${currentBeltInfo.border}`}
                >
                  {currentBeltInfo.label}
                </span>
              </div>
              <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                {currentBeltInfo.desc}
              </p>

              {/* Belt Selector Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-zinc-400">Alterar Graduação:</span>
                {(Object.keys(BELT_CONFIG) as BeltLevel[]).map((belt) => (
                  <button
                    key={belt}
                    onClick={() => setUserBelt(belt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      userBelt === belt
                        ? 'ring-2 ring-amber-400 scale-105 shadow-md shadow-amber-500/20 ' +
                          BELT_CONFIG[belt].bg +
                          ' ' +
                          BELT_CONFIG[belt].text
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    {BELT_CONFIG[belt].label.replace('Faixa ', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Counter Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 shrink-0">
            <div className="bg-zinc-950/80 border border-emerald-500/30 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-emerald-400 font-mono">{trainedCount}</span>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                Treinados
              </span>
            </div>

            <div className="bg-zinc-950/80 border border-amber-500/30 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-amber-400 font-mono">{trainedPercentage}%</span>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                Concluído
              </span>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1">
              <span className="text-2xl font-black text-purple-400 font-mono">{favorites.length}</span>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                Favoritos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BELT RANK & XP PROGRESSION SYSTEM */}
      <BeltRankProgressBar progress={xpProgress} variant="full" />

      {/* RECHARTS DONUT CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Main Interactive Recharts Donut Chart */}
        <div className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-black text-white tracking-tight">
                  Gráfico de Rosca de Golpes
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Visualização da cobertura do seu repertório no tatame
              </p>
            </div>

            {/* Chart Mode Switcher */}
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
              <button
                id="btn-chart-mode-geral"
                onClick={() => setChartViewMode('geral')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  chartViewMode === 'geral'
                    ? 'bg-amber-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Geral (% Total)
              </button>
              <button
                id="btn-chart-mode-categorias"
                onClick={() => setChartViewMode('categorias')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  chartViewMode === 'categorias'
                    ? 'bg-amber-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Por Categoria
              </button>
              <button
                id="btn-chart-mode-faixas"
                onClick={() => setChartViewMode('faixas')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  chartViewMode === 'faixas'
                    ? 'bg-amber-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Por Faixa
              </button>
            </div>
          </div>

          {/* Recharts Container with Centered Donut Label */}
          <div className="relative w-full h-72 sm:h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    chartViewMode === 'geral'
                      ? overallDonutData
                      : chartViewMode === 'categorias'
                      ? categoryDonutData
                      : beltDonutData
                  }
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={chartViewMode === 'geral' ? 4 : 3}
                  dataKey="value"
                  stroke="#09090b"
                  strokeWidth={2}
                  animationDuration={900}
                >
                  {(chartViewMode === 'geral'
                    ? overallDonutData
                    : chartViewMode === 'categorias'
                    ? categoryDonutData
                    : beltDonutData
                  ).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>

            {/* Central Donut Hole Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              {chartViewMode === 'geral' ? (
                <>
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    {trainedPercentage}%
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {trainedCount} de {totalTechniquesCount}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">
                    Treinados
                  </span>
                </>
              ) : chartViewMode === 'categorias' ? (
                <>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                    {trainedCount}
                  </span>
                  <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    Golpes
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                    Por Categoria
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
                    {trainedCount}
                  </span>
                  <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    Distribuídos
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                    Por Graduação
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Interactive Legend / Breakdown List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80">
            {chartViewMode === 'geral' && (
              <>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-zinc-200 block">Treinados</span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {trainedCount} ({trainedPercentage}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-zinc-200 block">A Treinar</span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {untrainedCount} ({100 - trainedPercentage}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800 col-span-2 sm:col-span-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-zinc-200 block">Enciclopédia</span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {totalTechniquesCount} Técnicas
                    </span>
                  </div>
                </div>
              </>
            )}

            {chartViewMode === 'categorias' &&
              categoryDonutData.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="truncate">
                    <span className="text-xs font-bold text-zinc-200 block truncate">{cat.name}</span>
                    <span className="text-[11px] text-zinc-400 font-mono">{cat.value} golpes</span>
                  </div>
                </div>
              ))}

            {chartViewMode === 'faixas' &&
              beltDonutData.map((belt, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: belt.color }}
                  />
                  <div className="truncate">
                    <span className="text-xs font-bold text-zinc-200 block truncate">{belt.name}</span>
                    <span className="text-[11px] text-zinc-400 font-mono">{belt.value} golpes</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Col: Category Progress Bars & Goals */}
        <div className="lg:col-span-5 bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Progresso por Categoria
              </h3>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('golpes')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <span>Ver Golpes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {categoryStats.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="font-mono text-zinc-400 font-semibold">
                    <span className="text-white font-bold">{item.trained}</span>/{item.total}{' '}
                    <span className="text-zinc-500">({item.percentage}%)</span>
                  </span>
                </div>

                <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Motivational Master Card */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-zinc-300">
              <span className="font-bold text-amber-400 block">Dica de Evolução Contínua:</span>
              <p className="leading-relaxed">
                “Uma faixa preta é apenas uma faixa branca que nunca desistiu e refinou seus fundamentos centenas de vezes.”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CHECKLIST TABLE / MANAGER */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Gerenciador de Golpes Treinados</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Marque ou desmarque as técnicas conforme sua rotina de drills no tatame
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategoryFilter('todas')}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryFilter === 'todas'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Todas ({TECHNIQUES.length})
            </button>
            {(['finalizacao', 'raspagem', 'passagem', 'queda', 'defesa'] as TechniqueCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategoryFilter === cat
                      ? 'bg-amber-500 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {CATEGORY_NAMES[cat]}
                </button>
              )
            )}
          </div>
        </div>

        {/* Technique Grid with toggle check and XP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {displayTechniques.map((tech) => {
            const isTrained = trainedMoves.includes(tech.id);
            const isFav = favorites.includes(tech.id);
            const techXP = calculateTechniqueXP(tech);

            return (
              <div
                key={tech.id}
                id={`profile-tech-${tech.id}`}
                className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  isTrained
                    ? 'bg-emerald-950/20 border-emerald-700/50 shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => toggleTrained(tech.id)}
                    title={isTrained ? 'Desmarcar treino' : 'Marcar como treinado'}
                    className={`mt-0.5 p-1 rounded-lg border transition-all shrink-0 ${
                      isTrained
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-600 hover:text-emerald-400 hover:border-emerald-500'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-bold truncate ${
                          isTrained ? 'text-zinc-100' : 'text-zinc-300'
                        }`}
                      >
                        {tech.name}
                      </h4>
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                        +{techXP} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                      <span className="text-amber-400/90 font-medium">
                        {CATEGORY_NAMES[tech.category]}
                      </span>
                      <span>•</span>
                      <span>{tech.startingPosition}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleFavorite(tech.id)}
                    title="Favoritar"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-400 transition-colors"
                  >
                    {isFav ? (
                      <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  {onNavigateToTechnique && (
                    <button
                      onClick={() => onNavigateToTechnique(tech)}
                      title="Ver Detalhes"
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BADGE SHOWCASE & ACHIEVEMENTS GALLERY */}
      <BadgeShowcase
        badges={xpProgress.achievements}
        streakData={streakTrackerState}
        onStreakUpdate={handleRefreshStreak}
        onDrillAdd={handleAddDrills}
      />

      {/* PROFILE PHOTO & CAMERA CAPTURE MODAL */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhoto={userPhoto}
        currentName={userName}
        userBelt={userBelt}
        onSave={handleSaveProfilePhoto}
      />
    </div>
  );
}
