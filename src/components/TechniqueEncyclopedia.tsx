import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ShieldAlert, 
  X,
  Layers,
  ArrowRight,
  Flame,
  Maximize2,
  Zap,
  Scale
} from 'lucide-react';
import { Technique, TechniqueCategory, Modality, BeltLevel } from '../types';
import { TECHNIQUES } from '../data/techniques';
import { FocusModeReader } from './FocusModeReader';
import { TrainingStatsModal } from './TrainingStatsModal';
import { calculateTechniqueXP, getUserXPProgress } from '../utils/xpSystem';
import { PieChart as PieChartIcon } from 'lucide-react';

interface TechniqueEncyclopediaProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  trainedMoves: string[];
  toggleTrained: (id: string) => void;
  userBelt: BeltLevel;
  onNavigateToProfile?: () => void;
  onCompareTechnique?: (techId: string) => void;
}

const CATEGORY_TABS: { id: TechniqueCategory | 'todas'; label: string; icon: string }[] = [
  { id: 'todas', label: 'Todos os Golpes', icon: '🥋' },
  { id: 'finalizacao', label: 'Finalizações', icon: '⚡' },
  { id: 'raspagem', label: 'Raspagens (2pts)', icon: '🔄' },
  { id: 'passagem', label: 'Passagens de Guarda (3pts)', icon: '🛡️' },
  { id: 'queda', label: 'Quedas & Projeções (2pts)', icon: '💥' },
  { id: 'defesa', label: 'Defesas & Saídas', icon: '🛡️' },
  { id: 'guarda', label: 'Guardas & Posições', icon: '🧘' },
];

const BELT_ORDER: Record<BeltLevel, number> = {
  branca: 1,
  azul: 2,
  roxa: 3,
  marrom: 4,
  preta: 5,
  coral: 6,
  vermelha: 7,
};

const BELT_BADGES: Record<BeltLevel, { label: string; bg: string; text: string }> = {
  branca: { label: 'Faixa Branca+', bg: 'bg-stone-200', text: 'text-stone-800' },
  azul: { label: 'Faixa Azul+', bg: 'bg-blue-600', text: 'text-white' },
  roxa: { label: 'Faixa Roxa+', bg: 'bg-purple-600', text: 'text-white' },
  marrom: { label: 'Faixa Marrom+', bg: 'bg-amber-900', text: 'text-amber-100' },
  preta: { label: 'Faixa Preta', bg: 'bg-zinc-900', text: 'text-red-500' },
  coral: { label: 'Faixa Coral', bg: 'bg-red-700', text: 'text-white' },
  vermelha: { label: 'Faixa Vermelha', bg: 'bg-red-800', text: 'text-amber-300' },
};

export const TechniqueEncyclopedia: React.FC<TechniqueEncyclopediaProps> = ({
  favorites,
  toggleFavorite,
  trainedMoves,
  toggleTrained,
  userBelt,
  onNavigateToProfile,
  onCompareTechnique
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TechniqueCategory | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<Modality | 'todas'>('todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('todas');
  const [activeTechnique, setActiveTechnique] = useState<Technique | null>(null);
  const [focusModeTechnique, setFocusModeTechnique] = useState<Technique | null>(null);
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  const filteredTechniques = useMemo(() => {
    return TECHNIQUES.filter((tech) => {
      // Category filter
      if (selectedCategory !== 'todas' && tech.category !== selectedCategory) {
        return false;
      }
      // Modality filter
      if (selectedModality !== 'todas' && tech.modality !== 'ambos' && tech.modality !== selectedModality) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'todas' && tech.difficulty !== selectedDifficulty) {
        return false;
      }
      // Favorites filter
      if (filterFavoritesOnly && !favorites.includes(tech.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = tech.name.toLowerCase().includes(q);
        const matchesJapanese = tech.japaneseName?.toLowerCase().includes(q);
        const matchesTags = tech.tags.some((t) => t.toLowerCase().includes(q));
        const matchesSummary = tech.summary.toLowerCase().includes(q);
        if (!matchesName && !matchesJapanese && !matchesTags && !matchesSummary) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedModality, selectedDifficulty, filterFavoritesOnly, searchQuery, favorites]);

  return (
    <div id="technique-encyclopedia" className="space-y-6">
      {/* Header info & Filter toolbar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                🥋 Enciclopédia de Golpes & Técnicas
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
                {filteredTechniques.length} Técnicas
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Passo a passo minucioso, biomecânica invisível, erros fatais e defesas para todas as faixas.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="search-techniques"
              type="text"
              placeholder="Buscar por nome, japonês, pegada ou tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Category horizontal scrolling tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              id={`cat-btn-${tab.id}`}
              onClick={() => setSelectedCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Sub-filters row: Gi/No-Gi, Difficulty, Favorites toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-zinc-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filtros:
            </span>

            {/* Modality filter */}
            <div className="inline-flex rounded-lg bg-zinc-950 p-0.5 border border-zinc-800">
              <button
                onClick={() => setSelectedModality('todas')}
                className={`px-2.5 py-1 rounded-md transition-colors ${selectedModality === 'todas' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedModality('gi')}
                className={`px-2.5 py-1 rounded-md transition-colors ${selectedModality === 'gi' ? 'bg-zinc-800 text-amber-400 font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Com Kimono (Gi)
              </button>
              <button
                onClick={() => setSelectedModality('nogi')}
                className={`px-2.5 py-1 rounded-md transition-colors ${selectedModality === 'nogi' ? 'bg-zinc-800 text-amber-400 font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Sem Kimono (No-Gi)
              </button>
            </div>

            {/* Difficulty filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-500"
            >
              <option value="todas">Dificuldade: Todas</option>
              <option value="basico">Básico / Fundamentos</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>

          {/* Favorites only checkbox */}
          <button
            onClick={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors ${
              filterFavoritesOnly 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 font-semibold' 
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {filterFavoritesOnly ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>Salvos ({favorites.length})</span>
          </button>

          {/* Quick Focus Mode on Current List */}
          {filteredTechniques.length > 0 && (
            <button
              id="btn-toolbar-focus-mode"
              onClick={() => setFocusModeTechnique(filteredTechniques[0])}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold transition-all ml-auto sm:ml-0"
              title="Abrir Modo Foco em Tela Cheia para Leitura no Tatame"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Modo Foco</span>
            </button>
          )}

          {/* Quick Donut Chart Progress Modal Button */}
          <button
            id="btn-toolbar-donut-stats"
            onClick={() => setIsStatsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-400 text-xs font-bold transition-all"
            title="Ver Gráfico de Rosca de Técnicas Treinadas"
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Gráfico de Treino ({Math.round((trainedMoves.length / (TECHNIQUES.length || 1)) * 100)}%)</span>
          </button>
        </div>
      </div>

      {/* Techniques Grid */}
      {filteredTechniques.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
          <Layers className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-200">Nenhum golpe encontrado</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Tente ajustar os filtros de categoria, modalidade ou termos de busca para encontrar mais técnicas.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('todas');
              setSelectedModality('todas');
              setSelectedDifficulty('todas');
              setFilterFavoritesOnly(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold hover:bg-amber-400 transition-colors"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTechniques.map((tech) => {
            const isFav = favorites.includes(tech.id);
            const isTrained = trainedMoves.includes(tech.id);
            const beltBadge = BELT_BADGES[tech.minBelt];
            const isBeltAccessible = BELT_ORDER[userBelt] >= BELT_ORDER[tech.minBelt];

            return (
              <div
                key={tech.id}
                id={`tech-card-${tech.id}`}
                onClick={() => setActiveTechnique(tech)}
                className="group relative bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/90 hover:border-amber-500/70 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ease-out transform hover:-translate-y-1.5 hover:scale-[1.025] hover:shadow-2xl hover:shadow-amber-500/10 ring-1 ring-transparent hover:ring-amber-500/30 focus-within:ring-2 focus-within:ring-amber-500 cursor-pointer overflow-hidden"
              >
                {/* Subtle luminous accent bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-400/80 transition-all duration-300" />
                <div>
                  {/* Top tags row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${beltBadge.bg} ${beltBadge.text}`}>
                        {beltBadge.label}
                      </span>
                      {tech.points && (
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                          +{tech.points} Pts IBJJF
                        </span>
                      )}
                      <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-amber-400" />
                        +{calculateTechniqueXP(tech)} XP
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
                        {tech.modality === 'ambos' ? 'Gi & No-Gi' : tech.modality === 'gi' ? 'Kimono (Gi)' : 'Sem Pano (No-Gi)'}
                      </span>
                    </div>

                    {/* Bookmark action */}
                    <button
                      id={`btn-fav-${tech.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tech.id);
                      }}
                      className="text-zinc-400 hover:text-amber-400 transition-colors p-1"
                      title={isFav ? 'Remover dos favoritos' : 'Salvar técnica'}
                    >
                      {isFav ? (
                        <BookmarkCheck className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Title & Japanese Name */}
                  <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors leading-tight">
                    {tech.name}
                  </h3>
                  {tech.japaneseName && (
                    <p className="text-xs text-zinc-500 font-serif italic mt-0.5">
                      {tech.japaneseName}
                    </p>
                  )}

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 mt-2.5 leading-relaxed">
                    {tech.summary}
                  </p>

                  {/* Positions summary */}
                  <div className="mt-3.5 pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-zinc-950/60 rounded-lg p-2 border border-zinc-800/50">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Origem:</span>
                      <span className="text-zinc-300 font-medium truncate block">{tech.startingPosition}</span>
                    </div>
                    <div className="bg-zinc-950/60 rounded-lg p-2 border border-zinc-800/50">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Destino:</span>
                      <span className="text-amber-300 font-medium truncate block">{tech.targetPositionOrSub}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <button
                    id={`btn-trained-${tech.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTrained(tech.id);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isTrained
                        ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-700/60'
                        : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isTrained ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    <span>{isTrained ? 'Treinado' : 'Marcar'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {onCompareTechnique && (
                      <button
                        id={`btn-compare-${tech.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompareTechnique(tech.id);
                        }}
                        title="Comparar com outro golpe lado a lado"
                        className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 border border-zinc-800 transition-colors"
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      id={`btn-focus-${tech.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocusModeTechnique(tech);
                      }}
                      title="Abrir em Modo Foco (Tela Cheia)"
                      className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 border border-zinc-800 transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id={`btn-view-${tech.id}`}
                      onClick={() => setActiveTechnique(tech)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 text-xs font-bold border border-amber-500/30 hover:border-amber-500 transition-all"
                    >
                      <span>Passo a Passo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Technique Full Detail Modal */}
      {activeTechnique && (
        <div 
          id="technique-detail-modal" 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setActiveTechnique(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${BELT_BADGES[activeTechnique.minBelt].bg} ${BELT_BADGES[activeTechnique.minBelt].text}`}>
                    {BELT_BADGES[activeTechnique.minBelt].label}
                  </span>
                  {activeTechnique.points && (
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      +{activeTechnique.points} Pontos IBJJF
                    </span>
                  )}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-semibold">
                    {activeTechnique.modality === 'ambos' ? 'Gi & No-Gi' : activeTechnique.modality === 'gi' ? 'Com Kimono' : 'Sem Kimono (No-Gi)'}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-amber-400 capitalize">
                    {activeTechnique.difficulty}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {activeTechnique.name}
                </h2>
                {activeTechnique.japaneseName && (
                  <p className="text-sm text-zinc-400 font-serif italic mt-0.5">
                    Nome tradicional / Kodokan: <span className="text-amber-400 font-medium">{activeTechnique.japaneseName}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {onCompareTechnique && (
                  <button
                    id="btn-modal-compare"
                    onClick={() => {
                      const techId = activeTechnique.id;
                      setActiveTechnique(null);
                      onCompareTechnique(techId);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-bold transition-all"
                    title="Comparar com outro golpe lado a lado"
                  >
                    <Scale className="w-4 h-4" />
                    <span className="hidden sm:inline">Comparar</span>
                  </button>
                )}
                <button
                  id="btn-modal-focus"
                  onClick={() => {
                    setFocusModeTechnique(activeTechnique);
                    setActiveTechnique(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold transition-all"
                  title="Entrar em Modo Foco (Tela Cheia)"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Modo Foco</span>
                </button>
                <button
                  id="btn-modal-fav"
                  onClick={() => toggleFavorite(activeTechnique.id)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
                  title="Favoritar"
                >
                  {favorites.includes(activeTechnique.id) ? (
                    <BookmarkCheck className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
                <button
                  id="btn-modal-close"
                  onClick={() => setActiveTechnique(null)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Positions Info banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-900/60 rounded-xl p-4 border border-zinc-800">
              <div>
                <span className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">Posição Inicial de Ataque:</span>
                <p className="text-sm font-semibold text-white mt-0.5">{activeTechnique.startingPosition}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">Objetivo / Posição Final:</span>
                <p className="text-sm font-semibold text-amber-400 mt-0.5">{activeTechnique.targetPositionOrSub}</p>
              </div>
            </div>

            {/* Step by Step numbered list */}
            <div className="space-y-3">
              <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center text-xs font-black">1</span>
                Passo a Passo de Execução Técnica
              </h4>
              <div className="space-y-2.5">
                {activeTechnique.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-zinc-900/40 rounded-xl p-3.5 border border-zinc-800/80">
                    <span className="w-6 h-6 rounded-lg bg-zinc-800 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Invisible Jiu-Jitsu Highlight (Gold Box) */}
            {activeTechnique.invisibleDetails.length > 0 && (
              <div className="bg-gradient-to-br from-amber-950/40 via-zinc-900 to-amber-950/20 border border-amber-500/40 rounded-2xl p-5 space-y-2.5 shadow-lg">
                <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Detalhes do "Jiu-Jitsu Invisível" (Alavancas & Biomecânica)
                </h4>
                <ul className="space-y-2">
                  {activeTechnique.invisibleDetails.map((detail, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-amber-100/90 flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mistakes, Counters & Follow-ups 3-column layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Common Mistakes */}
              <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-4 space-y-2">
                <h5 className="text-xs font-extrabold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" /> Erros Mais Comuns
                </h5>
                <ul className="space-y-1.5 text-xs text-red-200/80">
                  {activeTechnique.commonMistakes.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-red-400 shrink-0">✕</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Counters & Defenses */}
              <div className="bg-blue-950/20 border border-blue-900/40 rounded-2xl p-4 space-y-2">
                <h5 className="text-xs font-extrabold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5" /> Defesas & Contragolpes
                </h5>
                <ul className="space-y-1.5 text-xs text-blue-200/80">
                  {activeTechnique.counters.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-400 shrink-0">✓</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Follow-up Combos */}
            {activeTechnique.followUps.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-2">
                  Encadeamentos & Combos em Cadeia:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeTechnique.followUps.map((fu, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-zinc-800 text-zinc-200 font-medium border border-zinc-700">
                      ⚡ {fu}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* IBJJF Legality Callout */}
            {activeTechnique.ibjjfLegalityNote && (
              <div className="bg-zinc-900 border-l-4 border-amber-500 p-3.5 rounded-r-xl text-xs text-zinc-300">
                <strong className="text-amber-400 font-bold">Regra de Arbitragem IBJJF:</strong> {activeTechnique.ibjjfLegalityNote}
              </div>
            )}

            {/* Modal Bottom Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => toggleTrained(activeTechnique.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  trainedMoves.includes(activeTechnique.id)
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{trainedMoves.includes(activeTechnique.id) ? 'Golpe Marcado como Treinado' : 'Marcar como Treinado no Dojo'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="btn-modal-footer-focus"
                  onClick={() => {
                    setFocusModeTechnique(activeTechnique);
                    setActiveTechnique(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-bold text-xs transition-all"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Modo Foco no Tatame</span>
                </button>

                <button
                  onClick={() => setActiveTechnique(null)}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN FOCUS MODE (ZEN TATAMI READER) */}
      {focusModeTechnique && (
        <FocusModeReader
          technique={focusModeTechnique}
          allTechniques={filteredTechniques.length > 0 ? filteredTechniques : TECHNIQUES}
          onClose={() => setFocusModeTechnique(null)}
          onSelectTechnique={(tech) => setFocusModeTechnique(tech)}
          isFavorite={favorites.includes(focusModeTechnique.id)}
          isTrained={trainedMoves.includes(focusModeTechnique.id)}
          onToggleFavorite={toggleFavorite}
          onToggleTrained={toggleTrained}
        />
      )}

      {/* DEDICATED RECHARTS DONUT STATS MODAL */}
      <TrainingStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        userBelt={userBelt}
        trainedMoves={trainedMoves}
        favorites={favorites}
        onOpenFullProfile={onNavigateToProfile}
      />
    </div>
  );
};
