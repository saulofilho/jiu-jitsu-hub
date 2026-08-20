import React, { useState } from 'react';
import { 
  Users, 
  Trophy, 
  MapPin, 
  Calendar, 
  GitBranch, 
  Award, 
  Sparkles, 
  Flame, 
  ChevronRight,
  Search
} from 'lucide-react';
import { School } from '../types';
import { SCHOOLS } from '../data/schools';

export const SchoolsLineages: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<School>(SCHOOLS[0]);
  const [searchSchool, setSearchSchool] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'lineage'>('cards');

  const filteredSchools = SCHOOLS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchSchool.toLowerCase()) ||
      s.founders.some((f) => f.toLowerCase().includes(searchSchool.toLowerCase())) ||
      s.notableChampions.some((c) => c.toLowerCase().includes(searchSchool.toLowerCase()))
  );

  return (
    <div id="schools-lineages-section" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              Escolas, Equipes & Linhagens Históricas
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Conheça as grandes academias que forjaram lendas e moldaram a evolução da Arte Suave no mundo.
            </p>
          </div>

          {/* Toggle cards vs lineage tree */}
          <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Academias & Equipes</span>
            </button>
            <button
              onClick={() => setViewMode('lineage')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'lineage' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Árvore Genealógica (Linhagem)</span>
            </button>
          </div>
        </div>

        {/* Search */}
        {viewMode === 'cards' && (
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar equipe, fundador ou campeão mundial..."
              value={searchSchool}
              onChange={(e) => setSearchSchool(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}
      </div>

      {viewMode === 'lineage' ? (
        /* Lineage Tree Visualization */
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-amber-400" />
              A Grande Árvore Genealógica do Brazilian Jiu-Jitsu
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Como as ramificações dos pioneiros japoneses e brasileiros se multiplicaram nas maiores equipes modernas.
            </p>
          </div>

          {/* Root: Mitsuyo Maeda */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-amber-600 to-red-600 text-zinc-950 p-0.5 rounded-2xl shadow-xl shadow-amber-500/10 max-w-sm w-full">
              <div className="bg-zinc-950 rounded-[14px] p-4 text-center">
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-extrabold uppercase tracking-wider">
                  O Patriarca Japonês (1914)
                </span>
                <h4 className="text-base font-black text-white mt-1">Mitsuyo Maeda (Conde Koma)</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Discípulo direto de Jigoro Kano (Kodokan) que trouxe a arte ao Pará</p>
              </div>
            </div>

            <div className="w-0.5 h-8 bg-zinc-700 my-1"></div>

            {/* Level 2: Carlos & Helio Gracie + Luiz França */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-3xl">
              {/* Gracie Branch */}
              <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl p-4 text-center space-y-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold uppercase">
                  Linhagem Gracie (Zona Sul Carioca)
                </span>
                <h5 className="text-sm font-extrabold text-white">Carlos Gracie & Hélio Gracie</h5>
                <p className="text-[11px] text-zinc-400">Desenvolveram as alavancas e o Vale-Tudo na primeira Academia Gracie (1925)</p>
              </div>

              {/* Fadda Branch */}
              <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl p-4 text-center space-y-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                  Linhagem Fadda (Subúrbio Carioca)
                </span>
                <h5 className="text-sm font-extrabold text-white">Luiz França → Oswaldo Fadda</h5>
                <p className="text-[11px] text-zinc-400">Jiu-Jitsu comunitário no subúrbio e pioneirismo nas chaves de pé (Leglocks)</p>
              </div>
            </div>

            <div className="w-0.5 h-8 bg-zinc-700 my-1"></div>

            {/* Level 3: The Legendary Branches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-xs font-bold text-amber-400">Rolls Gracie</span>
                <p className="text-[11px] text-zinc-400">Inovação e Cross-training</p>
                <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-300">
                  → Jacaré Cavalcanti → <strong className="text-blue-400">Alliance</strong> & <strong className="text-emerald-400">Checkmat</strong>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-xs font-bold text-amber-400">Carlson Gracie</span>
                <p className="text-[11px] text-zinc-400">Pressão e Vale-Tudo</p>
                <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-300">
                  → Dedé Pederneiras, Libório, Bustamante → <strong className="text-orange-400">Carlson Team / ATT</strong>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-xs font-bold text-amber-400">Carlos Gracie Jr.</span>
                <p className="text-[11px] text-zinc-400">Organização e Expansão</p>
                <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-300">
                  → Barra da Tijuca (1986) → <strong className="text-red-400">Gracie Barra (1000+ sedes)</strong>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-xs font-bold text-amber-400">Nova União (Fadda + Gracie)</span>
                <p className="text-[11px] text-zinc-400">Fusão Perfeita</p>
                <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-300">
                  → Dedé Pederneiras & Wendell Alexander → <strong className="text-blue-400">Nova União</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Detailed Academy Browser layout (Sidebar + Detail) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left list of schools */}
          <div className="lg:col-span-5 space-y-3">
            {filteredSchools.map((school) => {
              const isSelected = selectedSchool.id === school.id;
              return (
                <div
                  key={school.id}
                  id={`school-item-${school.id}`}
                  onClick={() => setSelectedSchool(school)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-900 border-amber-500 shadow-lg shadow-amber-500/10 scale-[1.01]'
                      : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                        {school.symbolEmoji}
                      </span>
                      <div>
                        <h4 className="text-sm sm:text-base font-extrabold text-white">
                          {school.name}
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Fundação: {school.foundationYear} • {school.founders.join(', ')}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-400 translate-x-1' : 'text-zinc-600'} transition-transform`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right School Detail View */}
          <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Header info */}
            <div className="border-b border-zinc-800 pb-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{selectedSchool.symbolEmoji}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                    Fundada em {selectedSchool.foundationYear}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {selectedSchool.name}
                </h3>
                <p className="text-xs sm:text-sm text-amber-400/90 font-serif italic mt-1">
                  "{selectedSchool.motto}"
                </p>
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-950/70 rounded-xl p-3.5 border border-zinc-800/80">
                <span className="text-zinc-400 flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                  <Users className="w-3.5 h-3.5 text-amber-400" /> Fundadores:
                </span>
                <p className="text-zinc-100 font-semibold mt-1">{selectedSchool.founders.join(', ')}</p>
              </div>

              <div className="bg-zinc-950/70 rounded-xl p-3.5 border border-zinc-800/80">
                <span className="text-zinc-400 flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> Sedes Principais:
                </span>
                <p className="text-zinc-100 font-semibold mt-1">{selectedSchool.headquarters}</p>
              </div>
            </div>

            {/* History Summary */}
            <div className="space-y-2">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                História & Trajetória
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/60">
                {selectedSchool.historySummary}
              </p>
            </div>

            {/* Philosophy & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-1.5">
                <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Filosofia de Ensino:
                </h5>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedSchool.philosophy}
                </p>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-1.5">
                <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Estilo de Jogo no Tatame:
                </h5>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedSchool.fightingStyle}
                </p>
              </div>
            </div>

            {/* Lineage */}
            <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-xs">
              <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                Linhagem Marcial Direta:
              </span>
              <p className="text-amber-300 font-mono font-medium">{selectedSchool.lineage}</p>
            </div>

            {/* Champions Pills */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Principais Campeões Mundiais & Lendas Reveladas:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedSchool.notableChampions.map((champ, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-lg bg-zinc-950 text-zinc-200 font-medium border border-zinc-800 flex items-center gap-1.5"
                  >
                    <Award className="w-3 h-3 text-amber-400" />
                    {champ}
                  </span>
                ))}
              </div>
            </div>

            {/* Fun Facts */}
            {selectedSchool.funFacts.length > 0 && (
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <h5 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Curiosidades do Dojo
                </h5>
                <ul className="space-y-1.5 text-xs text-amber-200/90">
                  {selectedSchool.funFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
