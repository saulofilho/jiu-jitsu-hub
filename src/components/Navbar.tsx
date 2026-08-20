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
  Scale
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
}

const BELT_CONFIG: Record<BeltLevel, { label: string; bg: string; text: string; border: string }> = {
  branca: { label: 'Faixa Branca', bg: 'bg-stone-100', text: 'text-stone-900', border: 'border-stone-300' },
  azul: { label: 'Faixa Azul', bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700' },
  roxa: { label: 'Faixa Roxa', bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-700' },
  marrom: { label: 'Faixa Marrom', bg: 'bg-amber-900', text: 'text-amber-100', border: 'border-amber-950' },
  preta: { label: 'Faixa Preta', bg: 'bg-zinc-900', text: 'text-red-500', border: 'border-red-600' },
  coral: { label: 'Faixa Coral', bg: 'bg-gradient-to-r from-red-600 via-zinc-900 to-red-600', text: 'text-white', border: 'border-red-600' },
  vermelha: { label: 'Faixa Vermelha', bg: 'bg-red-700', text: 'text-amber-300', border: 'border-amber-500' },
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
  openStatsModal
}) => {
  const currentBelt = BELT_CONFIG[userBelt];
  const trainedPercentage = totalCount > 0 ? Math.round((trainedCount / totalCount) * 100) : 0;
  const xpProgress = getUserXPProgress(trainedMoves, TECHNIQUES);

  const navItems = [
    { id: 'golpes', label: 'Golpes & Técnicas', icon: BookOpen, badge: '20+' },
    { id: 'comparador', label: 'Comparar Golpes', icon: Scale, badge: 'Vs' },
    { id: 'diario', label: 'Diário de Treino', icon: FileText, badge: 'Notas' },
    { id: 'perfil', label: 'Meu Perfil & Treinos', icon: Target, badge: `Nível ${xpProgress.currentTier.level}` },
    { id: 'escolas', label: 'Escolas & Linhagens', icon: Users },
    { id: 'historia', label: 'História & Curiosidades', icon: ScrollText },
    { id: 'regras', label: 'Regras & Placar IBJJF', icon: Timer },
    { id: 'noticias', label: 'News & Calendário', icon: Newspaper },
    { id: 'mestre-ai', label: 'Mestre IA & Gameplan', icon: Sparkles, highlight: true },
    { id: 'quiz', label: 'Simulado de Faixa', icon: GraduationCap },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 text-zinc-100">
      {/* Top Banner / Brand row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div 
          id="brand-logo" 
          onClick={() => setActiveTab('golpes')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                JIU-JITSU <span className="text-amber-400">HUB</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                柔術 Arte Suave
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Enciclopédia de Técnicas • História • Linhagens • Regras IBJJF
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

          {/* Quick Donut Stats Modal trigger */}
          {openStatsModal && (
            <button
              id="btn-nav-quick-donut"
              onClick={openStatsModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-400 text-xs font-bold transition-all shadow-sm"
              title="Abrir Gráfico de Rosca de Técnicas Treinadas"
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span className="font-mono">{trainedPercentage}%</span>
              <span className="hidden lg:inline text-[11px] font-normal text-emerald-300">Treinado</span>
            </button>
          )}

          {/* Quick Search trigger */}
          <button
            id="btn-quick-search"
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 text-xs sm:text-sm transition-colors"
            title="Buscar golpes, regras, termos e escolas (Cmd+K)"
          >
            <Search className="w-4 h-4 text-zinc-400" />
            <span className="hidden md:inline">Buscar no Hub...</span>
            <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              Ctrl+K
            </kbd>
          </button>

          {/* User Belt selector dropdown */}
          <div className="relative group">
            <label className="sr-only" htmlFor="belt-select">Sua Faixa</label>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-400 text-[11px] hidden sm:inline">Faixa:</span>
              <select
                id="belt-select"
                value={userBelt}
                onChange={(e) => setUserBelt(e.target.value as BeltLevel)}
                className={`text-xs font-semibold py-0.5 px-1.5 rounded cursor-pointer border ${currentBelt.bg} ${currentBelt.text} ${currentBelt.border} focus:outline-none`}
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
      <nav id="nav-tabs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 border-t border-zinc-900">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? item.highlight 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'bg-zinc-800 text-amber-400 border border-zinc-700 shadow-sm'
                  : item.highlight
                    ? 'text-amber-400 hover:bg-zinc-900/90 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? (item.highlight ? 'text-zinc-950' : 'text-amber-400') : 'text-zinc-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
