import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, BookOpen, Users, ScrollText, Timer, ArrowRight, Scale } from 'lucide-react';
import { TECHNIQUES } from '../data/techniques';
import { SCHOOLS } from '../data/schools';
import { HISTORY_TOPICS, GLOSSARY_TERMS } from '../data/history';
import { IBJJF_POINTS } from '../data/rules';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, itemId?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const techMatches = TECHNIQUES.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    ).map((t) => ({
      id: t.id,
      title: t.name,
      subtitle: `${t.category.toUpperCase()} • ${t.minBelt} • ${t.startingPosition}`,
      tab: 'golpes',
      type: 'Técnica',
      icon: BookOpen
    }));

    const schoolMatches = SCHOOLS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.founders.some((f) => f.toLowerCase().includes(q)) ||
        s.notableChampions.some((c) => c.toLowerCase().includes(q))
    ).map((s) => ({
      id: s.id,
      title: s.name,
      subtitle: `Fundada por ${s.founders.join(', ')} (${s.foundationYear})`,
      tab: 'escolas',
      type: 'Escola / Equipe',
      icon: Users
    }));

    const historyMatches = HISTORY_TOPICS.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.summary.toLowerCase().includes(q) ||
        h.keyFigures.some((f) => f.toLowerCase().includes(q))
    ).map((h) => ({
      id: h.id,
      title: h.title,
      subtitle: `${h.era} • ${h.subtitle}`,
      tab: 'historia',
      type: 'História & Tradição',
      icon: ScrollText
    }));

    const glossaryMatches = GLOSSARY_TERMS.filter(
      (g) => g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q)
    ).map((g) => ({
      id: g.term,
      title: g.term,
      subtitle: g.definition,
      tab: 'historia',
      type: 'Dicionário do Tatame',
      icon: ScrollText
    }));

    const rulesMatches = IBJJF_POINTS.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    ).map((r) => ({
      id: r.name,
      title: r.name,
      subtitle: `+${r.points} Pontos IBJJF • ${r.description}`,
      tab: 'regras',
      type: 'Regra IBJJF',
      icon: Timer
    }));

    const comparatorMatches = (q.includes('compar') || q.includes('vs') || q.includes('versus') || q.includes('duelo') || q.includes('diferen')) ? [{
      id: 'comparador-global',
      title: 'Comparador de Técnicas Lado a Lado',
      subtitle: 'Compare duas técnicas de Jiu-Jitsu (dificuldade, alavanca, mecânica e detalhes)',
      tab: 'comparador',
      type: 'Ferramenta Tática',
      icon: Scale
    }] : [];

    return [...comparatorMatches, ...techMatches, ...schoolMatches, ...historyMatches, ...glossaryMatches, ...rulesMatches].slice(0, 10);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      id="global-search-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 sm:pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="relative flex items-center border-b border-zinc-800 pb-4">
          <Search className="w-5 h-5 text-amber-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Pesquisar golpes, escolas, lendas, regras ou termos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base sm:text-lg text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              Digite qualquer termo como <span className="text-amber-400">"Armlock"</span>, <span className="text-amber-400">"Gracie Barra"</span>, <span className="text-amber-400">"Kimura"</span>, <span className="text-amber-400">"Raspagem"</span>...
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              Nenhum resultado encontrado para "{query}".
            </div>
          ) : (
            results.map((res, idx) => {
              const Icon = res.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onNavigate(res.tab, res.id);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer flex items-center justify-between gap-3 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                          {res.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-zinc-800 text-zinc-400">
                          {res.type}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                        {res.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
