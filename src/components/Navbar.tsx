import React from 'react';
import { 
  Shield, 
  BookOpen, 
  Users, 
  ScrollText, 
  Timer, 
  Sparkles, 
  GraduationCap, 
  Newspaper,
  Search,
  Award,
  Target,
  PieChart as PieChartIcon,
  Zap,
  FileText,
  Scale,
  Bell,
  BellRing,
  Github,
  Swords,
  GitFork
} from 'lucide-react';
import { BeltLevel } from '../types';
import { TECHNIQUES } from '../data/techniques';
import { getUserXPProgress } from '../utils/xpSystem';
import { BeltRankProgressBar } from './BeltRankProgressBar';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userBelt: BeltLevel;
  setUserBelt: (belt: BeltLevel) => void;
  openSearch: () => void;
  favoritesCount: number;
  trainedCount?: number;
  trainedMoves?: string[];
  totalCount?: number;
  openStatsModal?: () => void;
  openReminderModal?: () => void;
  openDeployGuideModal?: () => void;
  isReminderEnabled?: boolean;
  reminderTime?: string;
}

const BELT_CONFIG: Record<BeltLevel, { label: string; bg: string; text: string; border: string; bar: string }> = {
  branca: { label: 'Branca (Mu-Dan)', bg: 'bg-stone-100', text: 'text-stone-950', border: 'border-stone-400', bar: 'bg-stone-900' },
  azul: { label: 'Azul (Sho-Dan)', bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-500', bar: 'bg-stone-900' },
  roxa: { label: 'Roxa (Ni-Dan)', bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-500', bar: 'bg-stone-900' },
  marrom: { label: 'Marrom (San-Dan)', bg: 'bg-amber-900', text: 'text-amber-100', border: 'border-amber-700', bar: 'bg-stone-900' },
  preta: { label: 'Preta (Kuro-Obi)', bg: 'bg-zinc-950', text: 'text-red-500', border: 'border-red-600', bar: 'bg-red-600' },
  coral: { label: 'Coral (Master)', bg: 'bg-gradient-to-r from-red-600 via-zinc-900 to-red-600', text: 'text-amber-200', border: 'border-red-500', bar: 'bg-zinc-900' },
  vermelha: { label: 'Vermelha (Grand Master)', bg: 'bg-red-700', text: 'text-amber-300', border: 'border-amber-500', bar: 'bg-amber-500' },
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userBelt,
  setUserBelt,
  openSearch,
  favoritesCount,
  trainedCount = 0,
  trainedMoves = [],
  totalCount = 20,
  openStatsModal,
  openReminderModal,
  openDeployGuideModal,
  isReminderEnabled = false,
  reminderTime = '18:30'
}) => {
  const currentBelt = BELT_CONFIG[userBelt];
  const trainedPercentage = totalCount > 0 ? Math.round((trainedCount / totalCount) * 100) : 0;
  const xpProgress = getUserXPProgress(trainedMoves, TECHNIQUES);

  const navItems = [
    { id: 'golpes', label: 'Golpes & Técnicas', kanji: '技', icon: BookOpen, badge: '20+' },
    { id: 'caminhos', label: 'Caminho Técnico (Flow)', kanji: '路', icon: GitFork, badge: 'D3' },
    { id: 'comparador', label: 'Comparar Golpes', kanji: '対', icon: Scale, badge: 'Vs' },
    { id: 'diario', label: 'Diário do Guerreiro', kanji: '記', icon: FileText, badge: 'Notas' },
    { id: 'perfil', label: 'Meu Perfil & Treinos', kanji: '道', icon: Target, badge: `Nível ${xpProgress.currentTier.level}` },
    { id: 'escolas', label: 'Linhagens & Escolas', kanji: '流', icon: Users },
    { id: 'historia', label: 'História & Bushido', kanji: '史', icon: ScrollText },
    { id: 'regras', label: 'Regras & Placar IBJJF', kanji: '規', icon: Timer },
    { id: 'noticias', label: 'News & Torneios', kanji: '報', icon: Newspaper },
    { id: 'mestre-ai', label: 'Mestre IA & Gameplan', kanji: '師', icon: Sparkles, highlight: true },
    { id: 'quiz', label: 'Exame de Faixa', kanji: '試', icon: GraduationCap },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#08080a]/95 backdrop-blur-xl border-b border-red-900/30 text-zinc-100 shadow-2xl">
      {/* Top Ambient Martial Accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 opacity-80" />

      {/* Top Banner / Brand row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo & Brand with Warrior Mon / Crest */}
        <div 
          id="brand-logo" 
          onClick={() => setActiveTab('golpes')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-amber-600 p-0.5 shadow-lg shadow-red-900/40 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-[#0a0a0e] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-red-500/20 to-transparent opacity-60 pointer-events-none" />
                <Swords className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            {/* Small Japanese Inkan Seal Stamp */}
            <span className="absolute -bottom-1 -right-1 text-[9px] inkan-stamp scale-75 origin-bottom-right">
              柔術
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-warrior font-black text-lg sm:text-xl tracking-wider text-white">
                JIU-JITSU <span className="text-red-500">HUB</span>
              </span>
              <span className="hidden sm:inline-block inkan-stamp-gold text-[10px]">
                ブラジリアン柔術
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium tracking-wide hidden sm:block">
              Arte Suave • Biomecânica • Bushido • Regras IBJJF & IA
            </p>
          </div>
        </div>

        {/* Right action group: XP Minimal Progress + Stats Donut Modal + Search + User Belt selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Minimal XP & Belt Rank Bar */}
          <div 
            id="nav-xp-badge"
            onClick={() => setActiveTab('perfil')}
            className="cursor-pointer transition-transform hover:scale-105"
            title={`XP Total: ${xpProgress.totalXP} XP - ${xpProgress.currentTier.name}. Clique para ver o perfil completo.`}
          >
            <BeltRankProgressBar progress={xpProgress} variant="minimal" />
          </div>

          {/* Daily Reminder Bell Button */}
          {openReminderModal && (
            <button
              id="btn-nav-daily-reminder"
              onClick={openReminderModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
                isReminderEnabled
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'
              }`}
              title={
                isReminderEnabled
                  ? `Lembrete de Treino Ativo (${reminderTime}). Clique para configurar.`
                  : 'Configurar Lembrete Diário do Guerreiro'
              }
            >
              {isReminderEnabled ? (
                <div className="relative">
                  <BellRing className="w-3.5 h-3.5 text-amber-400" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                </div>
              ) : (
                <Bell className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span className="hidden xl:inline text-[11px] font-mono">
                {isReminderEnabled ? reminderTime : 'Dojo Alarm'}
              </span>
            </button>
          )}

          {/* GitHub Pages Deploy Guide trigger */}
          {openDeployGuideModal && (
            <button
              id="btn-nav-github-deploy"
              onClick={openDeployGuideModal}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-all shadow-sm"
              title="Guia de Deploy no GitHub Pages"
            >
              <Github className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-[11px]">Deploy</span>
            </button>
          )}

          {/* Quick Donut Stats Modal trigger */}
          {openStatsModal && (
            <button
              id="btn-nav-quick-donut"
              onClick={openStatsModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-400 text-xs font-bold transition-all shadow-sm"
              title="Abrir Gráfico de Técnicas Dominadas"
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span className="font-mono">{trainedPercentage}%</span>
              <span className="hidden lg:inline text-[11px] font-normal text-red-300">Dominado</span>
            </button>
          )}

          {/* Quick Search trigger */}
          <button
            id="btn-quick-search"
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs sm:text-sm transition-all hover:border-zinc-700"
            title="Buscar golpes, regras, termos e escolas (Cmd+K)"
          >
            <Search className="w-4 h-4 text-zinc-400" />
            <span className="hidden md:inline text-xs font-medium">Buscar no Dojo...</span>
            <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* User Belt selector dropdown with martial rank feel */}
          <div className="relative group">
            <label className="sr-only" htmlFor="belt-select">Sua Faixa</label>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-400 text-[11px] hidden sm:inline font-medium">Faixa:</span>
              <select
                id="belt-select"
                value={userBelt}
                onChange={(e) => setUserBelt(e.target.value as BeltLevel)}
                className={`text-xs font-bold py-0.5 px-2 rounded cursor-pointer border ${currentBelt.bg} ${currentBelt.text} ${currentBelt.border} focus:outline-none transition-all shadow-sm`}
              >
                <option value="branca">Branca</option>
                <option value="azul">Azul</option>
                <option value="roxa">Roxa</option>
                <option value="marrom">Marrom</option>
                <option value="preta">Preta</option>
                <option value="coral">Coral</option>
                <option value="vermelha">Vermelha</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <nav id="nav-tabs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 border-t border-zinc-900/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`group flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 relative ${
                isActive
                  ? item.highlight 
                    ? 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-zinc-950 font-bold shadow-lg shadow-red-900/30'
                    : 'bg-zinc-900 text-red-400 border border-red-900/50 shadow-inner'
                  : item.highlight
                    ? 'text-amber-400 hover:bg-amber-500/10 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 border border-transparent'
              }`}
            >
              <span className="font-kanji text-xs opacity-70 group-hover:opacity-100 text-red-400/90 hidden md:inline">
                {item.kanji}
              </span>
              <Icon className={`w-4 h-4 ${isActive ? (item.highlight ? 'text-zinc-950' : 'text-red-400') : 'text-zinc-400 group-hover:text-zinc-200'}`} />
              <span className="tracking-wide">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  isActive && item.highlight 
                    ? 'bg-zinc-950 text-amber-400' 
                    : 'bg-zinc-950/80 text-zinc-300 border border-zinc-800'
                }`}>
                  {item.badge}
                </span>
              )}
              {isActive && !item.highlight && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

