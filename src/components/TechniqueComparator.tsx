import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Sparkles,
  Shield,
  Zap,
  Target,
  Award,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Scale,
  Shuffle,
  ChevronDown,
  Layers,
  Flame,
  Check,
  Bookmark,
  BookmarkCheck,
  Search,
  ExternalLink,
  Sliders,
  Maximize2
} from 'lucide-react';
import { Technique, BeltLevel, Modality, TechniqueCategory } from '../types';
import { TECHNIQUES } from '../data/techniques';
import { calculateTechniqueXP } from '../utils/xpSystem';

interface TechniqueComparatorProps {
  favorites?: string[];
  toggleFavorite?: (id: string) => void;
  trainedMoves?: string[];
  toggleTrained?: (id: string) => void;
  userBelt?: BeltLevel;
  initialTechIdA?: string;
  initialTechIdB?: string;
  onOpenFocusMode?: (tech: Technique) => void;
}

const PRESET_MATCHUPS = [
  {
    id: 'armlock-vs-triangulo',
    title: 'Armlock vs. Triângulo',
    subtitle: 'O Dilema Clássico da Guarda Fechada',
    techA: 'armlock-guarda-fechada',
    techB: 'triangulo-guarda-fechada',
    tag: 'Finalizações Clássicas'
  },
  {
    id: 'knee-cut-vs-toureando',
    title: 'Knee Cut vs. Toureando',
    subtitle: 'Passagem por Pressão vs. Passagem por Agilidade',
    techA: 'passagem-knee-cut',
    techB: 'passagem-toureando',
    tag: 'Passagem de Guarda'
  },
  {
    id: 'kimura-vs-americana',
    title: 'Kimura vs. Americana',
    subtitle: 'Mecânica Inversa de Rotação de Ombro',
    techA: 'kimura-guarda-fechada',
    techB: 'americana-100kg',
    tag: 'Chaves de Ombro'
  },
  {
    id: 'single-leg-vs-double-leg',
    title: 'Single Leg vs. Double Leg',
    subtitle: 'Fundamentos de Queda do Wrestling ao Jiu-Jitsu',
    techA: 'single-leg',
    techB: 'double-leg-baiana',
    tag: 'Quedas (2 Pts)'
  },
  {
    id: 'omoplata-vs-triangulo',
    title: 'Omoplata vs. Triângulo',
    subtitle: 'Ataques Triplos da Guarda Aberta/Fechada',
    techA: 'omoplata-guarda',
    techB: 'triangulo-guarda-fechada',
    tag: 'Guarda & Ataque'
  },
  {
    id: 'mata-leao-vs-ezequiel',
    title: 'Mata-Leão vs. Ezequiel',
    subtitle: 'Estrangulamento com Pegada nas Costas vs. Ataque Frontal da Montada',
    techA: 'mata-leao-costas',
    techB: 'estrangulamento-ezequiel',
    tag: 'Estrangulamentos'
  }
];

const DIFFICULTY_MAP: Record<string, { label: string; level: number; color: string; bg: string }> = {
  basico: { label: 'Básico / Fundamental', level: 1, color: 'text-emerald-400', bg: 'bg-emerald-500' },
  intermediario: { label: 'Intermediário', level: 2, color: 'text-blue-400', bg: 'bg-blue-500' },
  avancado: { label: 'Avançado / Especializado', level: 3, color: 'text-purple-400', bg: 'bg-purple-500' }
};

const BELT_COLORS: Record<BeltLevel, { label: string; text: string; bg: string; border: string }> = {
  branca: { label: 'Faixa Branca+', text: 'text-zinc-900 font-bold', bg: 'bg-stone-200', border: 'border-stone-400' },
  azul: { label: 'Faixa Azul+', text: 'text-white', bg: 'bg-blue-600', border: 'border-blue-500' },
  roxa: { label: 'Faixa Roxa+', text: 'text-white', bg: 'bg-purple-600', border: 'border-purple-500' },
  marrom: { label: 'Faixa Marrom+', text: 'text-amber-100', bg: 'bg-amber-950', border: 'border-amber-700' },
  preta: { label: 'Faixa Preta', text: 'text-red-400 font-black', bg: 'bg-zinc-950', border: 'border-red-600' },
  coral: { label: 'Faixa Coral', text: 'text-white', bg: 'bg-red-700', border: 'border-red-500' },
  vermelha: { label: 'Faixa Vermelha', text: 'text-amber-300 font-black', bg: 'bg-red-900', border: 'border-amber-500' }
};

const CATEGORY_NAMES: Record<TechniqueCategory, string> = {
  finalizacao: 'Finalização',
  raspagem: 'Raspagem (2 pts)',
  passagem: 'Passagem de Guarda (3 pts)',
  queda: 'Queda / Projeção (2 pts)',
  defesa: 'Defesa & Saída',
  guarda: 'Guarda & Controle',
  posicao: 'Posição / Transição'
};

export const TechniqueComparator: React.FC<TechniqueComparatorProps> = ({
  favorites = [],
  toggleFavorite,
  trainedMoves = [],
  toggleTrained,
  userBelt = 'branca',
  initialTechIdA,
  initialTechIdB,
  onOpenFocusMode
}) => {
  // Select which technique IDs to compare
  const [selectedIdA, setSelectedIdA] = useState<string>(() => {
    if (initialTechIdA && TECHNIQUES.some(t => t.id === initialTechIdA)) return initialTechIdA;
    return 'armlock-guarda-fechada';
  });

  const [selectedIdB, setSelectedIdB] = useState<string>(() => {
    if (initialTechIdB && TECHNIQUES.some(t => t.id === initialTechIdB)) return initialTechIdB;
    return 'triangulo-guarda-fechada';
  });

  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [isDropdownAOpen, setIsDropdownAOpen] = useState(false);
  const [isDropdownBOpen, setIsDropdownBOpen] = useState(false);

  // Active view section
  const [activeSection, setActiveSection] = useState<'geral' | 'mecanica' | 'passos' | 'invisiveis' | 'erros' | 'defesas' | 'sinergia'>('geral');

  // Resolve current techniques
  const techA = useMemo(() => TECHNIQUES.find(t => t.id === selectedIdA) || TECHNIQUES[0], [selectedIdA]);
  const techB = useMemo(() => TECHNIQUES.find(t => t.id === selectedIdB) || TECHNIQUES[1] || TECHNIQUES[0], [selectedIdB]);

  // Filtered lists for dropdowns
  const filteredListA = useMemo(() => {
    const q = searchA.toLowerCase().trim();
    if (!q) return TECHNIQUES;
    return TECHNIQUES.filter(t => t.name.toLowerCase().includes(q) || t.startingPosition.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
  }, [searchA]);

  const filteredListB = useMemo(() => {
    const q = searchB.toLowerCase().trim();
    if (!q) return TECHNIQUES;
    return TECHNIQUES.filter(t => t.name.toLowerCase().includes(q) || t.startingPosition.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
  }, [searchB]);

  // Quick Actions
  const handleSwap = () => {
    const temp = selectedIdA;
    setSelectedIdA(selectedIdB);
    setSelectedIdB(temp);
  };

  const handleRandomize = () => {
    if (TECHNIQUES.length < 2) return;
    const idxA = Math.floor(Math.random() * TECHNIQUES.length);
    let idxB = Math.floor(Math.random() * TECHNIQUES.length);
    while (idxB === idxA) {
      idxB = Math.floor(Math.random() * TECHNIQUES.length);
    }
    setSelectedIdA(TECHNIQUES[idxA].id);
    setSelectedIdB(TECHNIQUES[idxB].id);
  };

  const handleApplyPreset = (preset: typeof PRESET_MATCHUPS[0]) => {
    setSelectedIdA(preset.techA);
    setSelectedIdB(preset.techB);
  };

  // Synergy & Tactical Relationship Analyzer
  const tacticalSynergy = useMemo(() => {
    const sharesStartingPos = techA.startingPosition.toLowerCase().includes(techB.startingPosition.toLowerCase()) ||
      techB.startingPosition.toLowerCase().includes(techA.startingPosition.toLowerCase());

    const isCombo = techA.followUps.some(f => f.toLowerCase().includes(techB.name.toLowerCase())) ||
      techB.followUps.some(f => f.toLowerCase().includes(techA.name.toLowerCase()));

    const isCounter = techA.counters.some(c => c.toLowerCase().includes(techB.name.toLowerCase())) ||
      techB.counters.some(c => c.toLowerCase().includes(techA.name.toLowerCase()));

    const sameCategory = techA.category === techB.category;

    return {
      sharesStartingPos,
      isCombo,
      isCounter,
      sameCategory
    };
  }, [techA, techB]);

  const isTrainedA = trainedMoves.includes(techA.id);
  const isTrainedB = trainedMoves.includes(techB.id);
  const isFavA = favorites.includes(techA.id);
  const isFavB = favorites.includes(techB.id);

  const xpA = calculateTechniqueXP(techA);
  const xpB = calculateTechniqueXP(techB);

  return (
    <div id="technique-comparator-page" className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Scale className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                Matriz de Comparação & Análise Tática
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Comparador de Técnicas Lado a Lado
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Analise detalhadamente as diferenças de alavanca, mecânica de alvos, posições iniciais, níveis de dificuldade, detalhes invisíveis e combinações entre quaisquer dois golpes do Jiu-Jitsu.
            </p>
          </div>

          {/* Quick Matchup & Random Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="btn-swap-techniques"
              onClick={handleSwap}
              title="Inverter ordem dos golpes"
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              <span>Inverter</span>
            </button>

            <button
              id="btn-random-matchup"
              onClick={handleRandomize}
              title="Sortear duas técnicas aleatórias"
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
            >
              <Shuffle className="w-4 h-4 text-purple-400" />
              <span>Duelo Aleatório</span>
            </button>
          </div>
        </div>

        {/* PRESET MATCHUPS ROW */}
        <div className="pt-6 mt-6 border-t border-zinc-800/80 space-y-2.5">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Comparações & Duelos Mais Estudados no Tatame:</span>
          </span>

          <div className="flex flex-wrap gap-2">
            {PRESET_MATCHUPS.map(preset => {
              const isCurrent = (selectedIdA === preset.techA && selectedIdB === preset.techB) ||
                (selectedIdA === preset.techB && selectedIdB === preset.techA);

              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md font-black'
                      : 'bg-zinc-950/80 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <span>⚡</span>
                  <span>{preset.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SELECTORS GRID (TECHNIQUE A VS TECHNIQUE B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* SELECTOR A */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <span>Golpe A (Lado Esquerdo)</span>
            </span>
            <span className="text-xs font-mono font-bold text-zinc-400">
              +{xpA} XP
            </span>
          </div>

          {/* Search Dropdown Input A */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Selecione o Golpe A:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchA}
                placeholder={techA.name}
                onFocus={() => setIsDropdownAOpen(true)}
                onChange={e => {
                  setSearchA(e.target.value);
                  setIsDropdownAOpen(true);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm font-bold text-white placeholder:text-zinc-300 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setIsDropdownAOpen(!isDropdownAOpen)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Dropdown Menu A */}
            {isDropdownAOpen && (
              <div className="absolute z-30 left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-2 shadow-2xl space-y-1">
                {filteredListA.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedIdA(item.id);
                      setSearchA('');
                      setIsDropdownAOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      item.id === techA.id
                        ? 'bg-amber-500 text-zinc-950 font-black'
                        : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">{CATEGORY_NAMES[item.category]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Card Summary A */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-white">{techA.name}</h3>
                {techA.japaneseName && (
                  <span className="text-xs text-amber-400/80 font-mono block">
                    {techA.japaneseName}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {toggleFavorite && (
                  <button
                    onClick={() => toggleFavorite(techA.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isFavA
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                    title="Favoritar técnica"
                  >
                    {isFavA ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                )}

                {toggleTrained && (
                  <button
                    onClick={() => toggleTrained(techA.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isTrainedA
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                    title="Marcar como treinado"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
              {techA.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${BELT_COLORS[techA.minBelt].bg} ${BELT_COLORS[techA.minBelt].text} ${BELT_COLORS[techA.minBelt].border}`}>
                {BELT_COLORS[techA.minBelt].label}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 ${DIFFICULTY_MAP[techA.difficulty].color}`}>
                {DIFFICULTY_MAP[techA.difficulty].label}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800">
                {CATEGORY_NAMES[techA.category]}
              </span>
            </div>
          </div>
        </div>

        {/* SELECTOR B */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
              <span>Golpe B (Lado Direito)</span>
            </span>
            <span className="text-xs font-mono font-bold text-zinc-400">
              +{xpB} XP
            </span>
          </div>

          {/* Search Dropdown Input B */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Selecione o Golpe B:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchB}
                placeholder={techB.name}
                onFocus={() => setIsDropdownBOpen(true)}
                onChange={e => {
                  setSearchB(e.target.value);
                  setIsDropdownBOpen(true);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm font-bold text-white placeholder:text-zinc-300 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setIsDropdownBOpen(!isDropdownBOpen)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Dropdown Menu B */}
            {isDropdownBOpen && (
              <div className="absolute z-30 left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-2 shadow-2xl space-y-1">
                {filteredListB.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedIdB(item.id);
                      setSearchB('');
                      setIsDropdownBOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      item.id === techB.id
                        ? 'bg-blue-500 text-zinc-950 font-black'
                        : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">{CATEGORY_NAMES[item.category]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Card Summary B */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-white">{techB.name}</h3>
                {techB.japaneseName && (
                  <span className="text-xs text-blue-400/80 font-mono block">
                    {techB.japaneseName}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {toggleFavorite && (
                  <button
                    onClick={() => toggleFavorite(techB.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isFavB
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                    title="Favoritar técnica"
                  >
                    {isFavB ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                )}

                {toggleTrained && (
                  <button
                    onClick={() => toggleTrained(techB.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isTrainedB
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                    title="Marcar como treinado"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
              {techB.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${BELT_COLORS[techB.minBelt].bg} ${BELT_COLORS[techB.minBelt].text} ${BELT_COLORS[techB.minBelt].border}`}>
                {BELT_COLORS[techB.minBelt].label}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 ${DIFFICULTY_MAP[techB.difficulty].color}`}>
                {DIFFICULTY_MAP[techB.difficulty].label}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800">
                {CATEGORY_NAMES[techB.category]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPARISON NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-800 text-xs font-bold">
        <button
          onClick={() => setActiveSection('geral')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeSection === 'geral'
              ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Visão Geral & Matriz</span>
        </button>

        <button
          onClick={() => setActiveSection('mecanica')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeSection === 'mecanica'
              ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Mecânica & Alavancas</span>
        </button>

        <button
          onClick={() => setActiveSection('passos')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeSection === 'passos'
              ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Passo a Passo</span>
        </button>

        <button
          onClick={() => setActiveSection('invisiveis')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeSection === 'invisiveis'
              ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Macetes Invisíveis</span>
        </button>

        <button
          onClick={() => setActiveSection('erros')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeSection === 'erros'
              ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Erros Comuns</span>
        </button>

        <button
          onClick={() => setActiveSection('defesas')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeSection === 'defesas'
              ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Defesas & Counters</span>
        </button>

        <button
          onClick={() => setActiveSection('sinergia')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeSection === 'sinergia'
              ? 'bg-purple-600 text-white font-black shadow-md'
              : 'text-purple-400 hover:text-purple-200 bg-purple-950/40 hover:bg-purple-900/60'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Análise Tática de Sinergia</span>
        </button>
      </div>

      {/* SECTION CONTENT DISPLAY */}
      {/* 1. VISÃO GERAL & MATRIZ */}
      {activeSection === 'geral' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>Matriz Comparativa de Características</span>
            </h3>
            <span className="text-xs text-zinc-400">
              {techA.name} vs. {techB.name}
            </span>
          </div>

          <div className="space-y-4">
            {/* Row: Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 items-center">
              <div className="md:col-span-1 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Categoria & Tipo
              </div>
              <div className="md:col-span-2 text-sm font-bold text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>{CATEGORY_NAMES[techA.category]}</span>
                <span className="text-xs text-zinc-500 font-mono">({techA.subCategory.replace('_', ' ')})</span>
              </div>
              <div className="md:col-span-2 text-sm font-bold text-blue-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>{CATEGORY_NAMES[techB.category]}</span>
                <span className="text-xs text-zinc-500 font-mono">({techB.subCategory.replace('_', ' ')})</span>
              </div>
            </div>

            {/* Row: Dificuldade */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 items-center">
              <div className="md:col-span-1 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Nível de Dificuldade
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <span className={`text-xs font-bold ${DIFFICULTY_MAP[techA.difficulty].color}`}>
                  {DIFFICULTY_MAP[techA.difficulty].label}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3].map(lvl => (
                    <div
                      key={lvl}
                      className={`h-2 flex-1 rounded-full ${
                        lvl <= DIFFICULTY_MAP[techA.difficulty].level ? 'bg-amber-400' : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <span className={`text-xs font-bold ${DIFFICULTY_MAP[techB.difficulty].color}`}>
                  {DIFFICULTY_MAP[techB.difficulty].label}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3].map(lvl => (
                    <div
                      key={lvl}
                      className={`h-2 flex-1 rounded-full ${
                        lvl <= DIFFICULTY_MAP[techB.difficulty].level ? 'bg-blue-400' : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Row: Posição Inicial */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 items-start">
              <div className="md:col-span-1 text-xs font-bold text-zinc-400 uppercase tracking-wider pt-1">
                Posição Inicial
              </div>
              <div className="md:col-span-2 space-y-1">
                <span className="text-xs sm:text-sm font-bold text-white block">
                  {techA.startingPosition}
                </span>
                <span className="text-[11px] text-zinc-400 leading-snug block">
                  Gatilho de entrada para a mecânica de {techA.name}.
                </span>
              </div>
              <div className="md:col-span-2 space-y-1">
                <span className="text-xs sm:text-sm font-bold text-white block">
                  {techB.startingPosition}
                </span>
                <span className="text-[11px] text-zinc-400 leading-snug block">
                  Gatilho de entrada para a mecânica de {techB.name}.
                </span>
              </div>
            </div>

            {/* Row: Posição Alvo & Objetivo */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 items-start">
              <div className="md:col-span-1 text-xs font-bold text-zinc-400 uppercase tracking-wider pt-1">
                Alvo / Resultado
              </div>
              <div className="md:col-span-2 text-xs sm:text-sm font-bold text-amber-300">
                {techA.targetPositionOrSub}
                {techA.points && <span className="ml-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono">+{techA.points} pts</span>}
              </div>
              <div className="md:col-span-2 text-xs sm:text-sm font-bold text-blue-300">
                {techB.targetPositionOrSub}
                {techB.points && <span className="ml-2 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-mono">+{techB.points} pts</span>}
              </div>
            </div>

            {/* Row: Modalidade & Faixa */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 items-center">
              <div className="md:col-span-1 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Modalidade & Faixa
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${BELT_COLORS[techA.minBelt].bg} ${BELT_COLORS[techA.minBelt].text}`}>
                  {BELT_COLORS[techA.minBelt].label}
                </span>
                <span className="text-xs text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                  {techA.modality === 'nogi' ? '🩳 No-Gi (Sem Pano)' : techA.modality === 'ambos' ? '⚡ Gi & No-Gi' : '🥋 Gi (Com Kimono)'}
                </span>
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${BELT_COLORS[techB.minBelt].bg} ${BELT_COLORS[techB.minBelt].text}`}>
                  {BELT_COLORS[techB.minBelt].label}
                </span>
                <span className="text-xs text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                  {techB.modality === 'nogi' ? '🩳 No-Gi (Sem Pano)' : techB.modality === 'ambos' ? '⚡ Gi & No-Gi' : '🥋 Gi (Com Kimono)'}
                </span>
              </div>
            </div>

            {/* Row: Legalidade IBJJF */}
            {(techA.ibjjfLegalityNote || techB.ibjjfLegalityNote) && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 items-start">
                <div className="md:col-span-1 text-xs font-bold text-zinc-400 uppercase tracking-wider pt-1">
                  Regras IBJJF
                </div>
                <div className="md:col-span-2 text-xs text-zinc-300 leading-relaxed">
                  {techA.ibjjfLegalityNote || 'Permitido segundo os regulamentos gerais da categoria.'}
                </div>
                <div className="md:col-span-2 text-xs text-zinc-300 leading-relaxed">
                  {techB.ibjjfLegalityNote || 'Permitido segundo os regulamentos gerais da categoria.'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MECÂNICA & ALAVANCAS */}
      {activeSection === 'mecanica' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider border-b border-zinc-800 pb-3">
              <Target className="w-4 h-4" />
              <span>Mecânica & Foco de {techA.name}</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <span className="text-xs font-bold text-zinc-400 uppercase">Resumo da Alavanca</span>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {techA.summary}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase">Vetor de Força & Apoio</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Parte de <strong>{techA.startingPosition}</strong> para atingir <strong>{techA.targetPositionOrSub}</strong>. O movimento requer domínio angular e fixação do oponente antes da tração final.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {techA.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-blue-400 font-black text-sm uppercase tracking-wider border-b border-zinc-800 pb-3">
              <Target className="w-4 h-4" />
              <span>Mecânica & Foco de {techB.name}</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <span className="text-xs font-bold text-zinc-400 uppercase">Resumo da Alavanca</span>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {techB.summary}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                <span className="text-xs font-bold text-blue-300 uppercase">Vetor de Força & Apoio</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Parte de <strong>{techB.startingPosition}</strong> para atingir <strong>{techB.targetPositionOrSub}</strong>. O movimento requer domínio angular e fixação do oponente antes da tração final.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {techB.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PASSO A PASSO COMPARATIVO */}
      {activeSection === 'passos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tech A Steps */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span>{techA.name}</span>
              <span className="text-xs text-zinc-500 font-mono">{techA.steps.length} etapas</span>
            </h4>

            <div className="space-y-3">
              {techA.steps.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech B Steps */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-blue-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span>{techB.name}</span>
              <span className="text-xs text-zinc-500 font-mono">{techB.steps.length} etapas</span>
            </h4>

            <div className="space-y-3">
              {techB.steps.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MACETES INVISÍVEIS */}
      {activeSection === 'invisiveis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/90 border border-amber-500/20 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Macetes Invisíveis de {techA.name}</span>
            </h4>

            <div className="space-y-3">
              {techA.invisibleDetails.map((detail, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs sm:text-sm text-amber-200 leading-relaxed flex items-start gap-3">
                  <span className="text-amber-400 font-bold shrink-0">🥋</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-blue-500/20 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-blue-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Macetes Invisíveis de {techB.name}</span>
            </h4>

            <div className="space-y-3">
              {techB.invisibleDetails.map((detail, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-xs sm:text-sm text-blue-200 leading-relaxed flex items-start gap-3">
                  <span className="text-blue-400 font-bold shrink-0">🥋</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. ERROS COMUNS */}
      {activeSection === 'erros' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/90 border border-red-500/20 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-red-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Erros Comuns em {techA.name}</span>
            </h4>

            <div className="space-y-3">
              {techA.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 text-xs sm:text-sm text-red-200 leading-relaxed flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">⚠️</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-red-500/20 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-red-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Erros Comuns em {techB.name}</span>
            </h4>

            <div className="space-y-3">
              {techB.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 text-xs sm:text-sm text-red-200 leading-relaxed flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">⚠️</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. DEFESAS & COUNTERS */}
      {activeSection === 'defesas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Como Defender {techA.name}</span>
            </h4>

            <div className="space-y-3">
              {techA.counters.map((counter, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-3">
                  <span className="text-amber-400 font-bold shrink-0">🛡️</span>
                  <span>{counter}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-blue-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Como Defender {techB.name}</span>
            </h4>

            <div className="space-y-3">
              {techB.counters.map((counter, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-3">
                  <span className="text-blue-400 font-bold shrink-0">🛡️</span>
                  <span>{counter}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. ANÁLISE TÁTICA DE SINERGIA */}
      {activeSection === 'sinergia' && (
        <div className="bg-gradient-to-br from-zinc-900 via-purple-950/20 to-zinc-950 border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Diagnóstico de Conexão Tática: {techA.name} ⚔️ {techB.name}
              </h3>
              <p className="text-xs text-zinc-400">
                Avaliação de sinergia para transições, ataque duplo e montagem de gameplan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
              <span className="text-xs font-bold text-zinc-400 uppercase">Posição de Origem</span>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {tacticalSynergy.sharesStartingPos ? (
                  <>
                    <span className="text-emerald-400">✓ Posição Compartilhada</span>
                  </>
                ) : (
                  <>
                    <span className="text-zinc-500">≠ Posições Diferentes</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">
                {tacticalSynergy.sharesStartingPos
                  ? 'Perfeito para armar dilemas (quando o oponente defende uma, abre espaço para a outra).'
                  : 'Exige transição intermediária para encadear as duas no mesmo rola.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
              <span className="text-xs font-bold text-zinc-400 uppercase">Ataque Duplo / Combo</span>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {tacticalSynergy.isCombo ? (
                  <span className="text-amber-400 font-black">⚡ Combo Conectado</span>
                ) : (
                  <span className="text-zinc-400">Combinação Tática Livre</span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">
                {tacticalSynergy.isCombo
                  ? 'Existe conexão direta registrada nos follow-ups oficiais de uma para a outra.'
                  : 'Pode ser utilizada como recurso alternativo na progressão de luta.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
              <span className="text-xs font-bold text-zinc-400 uppercase">Relação de Ataque/Defesa</span>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {tacticalSynergy.isCounter ? (
                  <span className="text-red-400 font-bold">🛡️ Contra-Golpe Direto</span>
                ) : (
                  <span className="text-blue-400 font-bold">Movimentos Complementares</span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">
                {tacticalSynergy.isCounter
                  ? 'Uma dessas técnicas é a resposta exata para contra-atacar a tentativa da outra.'
                  : 'Foco na versatilidade do repertório de tatame.'}
              </p>
            </div>
          </div>

          {/* Tactical Advice Box */}
          <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Dica de Ouro do Mestre:</span>
            </span>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              No Jiu-Jitsu de alto nível, os melhores atletas nunca atacam de forma isolada. Ao estudar <strong>{techA.name}</strong> junto com <strong>{techB.name}</strong>, você força o oponente a escolher qual defesa usar — se ele defender o braço, abre o pescoço; se defender o quadril, expõe as pernas. Pratique essas duas posições de forma encadeada nos seus drills!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
