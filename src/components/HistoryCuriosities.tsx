import React, { useState } from 'react';
import { 
  ScrollText, 
  BookOpen, 
  Sparkles, 
  Award, 
  Clock, 
  Search, 
  Flame, 
  Shield, 
  ChevronDown, 
  ChevronUp,
  Quote
} from 'lucide-react';
import { HistoryTopic, GlossaryTerm } from '../types';
import { HISTORY_TOPICS, GLOSSARY_TERMS } from '../data/history';
import { BELT_SYSTEM } from '../data/rules';

export const HistoryCuriosities: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'historias' | 'faixas' | 'dicionario'>('historias');
  const [selectedTopic, setSelectedTopic] = useState<HistoryTopic>(HISTORY_TOPICS[0]);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(HISTORY_TOPICS[0].id);

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (g) =>
      g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.definition.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.origin.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div id="history-curiosities-section" className="space-y-6">
      {/* Header & Sub-tabs */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <ScrollText className="w-6 h-6 text-amber-400" />
              História, Curiosidades & Dicionário BJJ
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Origens centenárias, batalhas inesquecíveis, tradição do tatame e o significado sagrado das faixas.
            </p>
          </div>

          {/* Subtabs toggle */}
          <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 shrink-0">
            <button
              onClick={() => setActiveSubTab('historias')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'historias' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Grandes Histórias ({HISTORY_TOPICS.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('faixas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'faixas' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Sistema de Faixas</span>
            </button>
            <button
              onClick={() => setActiveSubTab('dicionario')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'dicionario' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dicionário do Tatame</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: Grandes Histórias e Curiosidades */}
      {activeSubTab === 'historias' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Topics List */}
          <div className="lg:col-span-5 space-y-3">
            {HISTORY_TOPICS.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <div
                  key={topic.id}
                  id={`topic-item-${topic.id}`}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-900 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-400">
                      {topic.era}
                    </span>
                    <span className="text-[10px] text-zinc-400 capitalize">
                      {topic.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    {topic.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Full Topic Reading Pane */}
          <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-zinc-800 pb-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {selectedTopic.era}
                </span>
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                  {selectedTopic.category.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {selectedTopic.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                {selectedTopic.subtitle}
              </p>
            </div>

            {/* Quote if present */}
            {selectedTopic.highlightQuote && (
              <div className="bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-r-2xl italic text-xs sm:text-sm text-amber-200 flex items-start gap-3">
                <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p>"{selectedTopic.highlightQuote}"</p>
              </div>
            )}

            {/* Full Story Paragraphs */}
            <div className="space-y-3.5 text-xs sm:text-sm text-zinc-200 leading-relaxed">
              {selectedTopic.fullContent.map((p, idx) => (
                <p key={idx} className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60">
                  {p}
                </p>
              ))}
            </div>

            {/* Figures and Legacy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-800 text-xs">
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Personagens-Chave:
                </span>
                <p className="text-zinc-100 font-semibold">{selectedTopic.keyFigures.join(', ')}</p>
              </div>

              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                  Legado para a Arte Suave:
                </span>
                <p className="text-zinc-300">{selectedTopic.legacyImpact}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Sistema de Faixas & Graus */}
      {activeSubTab === 'faixas' && (
        <div className="space-y-6">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="max-w-3xl space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                A Jornada das Faixas no Brazilian Jiu-Jitsu
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                A graduação no Jiu-Jitsu não é apenas um teste físico, mas uma evolução do caráter, paciência e entendimento da biomecânica. Diferente de outras artes marciais onde a faixa preta pode ser obtida em poucos anos, no Jiu-Jitsu a faixa preta exige em média de 8 a 15 anos de treino quase diário.
              </p>
            </div>

            {/* Belt Cards Pipeline */}
            <div className="space-y-4">
              {BELT_SYSTEM.map((belt, index) => (
                <div
                  key={index}
                  className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Visual Belt Bar */}
                    <div 
                      className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-inner border border-zinc-700"
                      style={{ backgroundColor: belt.colorHex === '#111827' ? '#18181b' : belt.colorHex }}
                    >
                      <div className="w-full h-3 bg-red-600 border-y border-zinc-900"></div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base sm:text-lg font-black text-white">
                          {belt.belt}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                          Idade mínima: {belt.minAge} anos
                        </span>
                      </div>
                      <p className="text-xs text-amber-400 font-medium mt-0.5 italic">
                        "{belt.meaning}"
                      </p>
                      <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
                        <strong className="text-zinc-400">Foco do treinamento:</strong> {belt.focus}
                      </p>
                    </div>
                  </div>

                  <div className="bg-zinc-900/90 rounded-xl px-4 py-2.5 border border-zinc-800 shrink-0 text-center">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                      Tempo Mínimo IBJJF
                    </span>
                    <span className="text-sm font-extrabold text-amber-400">
                      {Math.floor(belt.minTimeMonths / 12)} {belt.minTimeMonths >= 24 ? 'anos' : 'ano'} ({belt.minTimeMonths} meses)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Dicionário do Tatame */}
      {activeSubTab === 'dicionario' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Glossário & Gírias do Tatame (A a Z)
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Aprenda a terminologia clássica e as expressões que só quem veste quimono conhece.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar termo ou gíria..."
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 space-y-2 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-base font-extrabold text-white">
                    {item.term}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-900 text-amber-400 border border-zinc-800">
                    {item.origin}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {item.definition}
                </p>
                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/50 text-[11px] text-zinc-400 italic">
                  <span className="text-amber-400 font-bold not-italic">Exemplo:</span> "{item.exampleContext}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
