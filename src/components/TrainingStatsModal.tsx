import React from 'react';
import { X, Award, Target, CheckCircle2, Bookmark, ArrowRight, TrendingUp } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BeltLevel, TechniqueCategory } from '../types';
import { TECHNIQUES } from '../data/techniques';
import { getUserXPProgress } from '../utils/xpSystem';
import { BeltRankProgressBar } from './BeltRankProgressBar';

interface TrainingStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBelt: BeltLevel;
  trainedMoves: string[];
  favorites: string[];
  onOpenFullProfile?: () => void;
}

const CATEGORY_NAMES: Record<TechniqueCategory, string> = {
  finalizacao: 'Finalizações',
  raspagem: 'Raspagens',
  passagem: 'Passagens',
  queda: 'Quedas',
  defesa: 'Defesas',
  guarda: 'Guarda',
  posicao: 'Posições'
};

const CATEGORY_COLORS: Record<TechniqueCategory, string> = {
  finalizacao: '#ef4444',
  raspagem: '#f59e0b',
  passagem: '#3b82f6',
  queda: '#8b5cf6',
  defesa: '#10b981',
  guarda: '#06b6d4',
  posicao: '#ec4899',
};

export function TrainingStatsModal({
  isOpen,
  onClose,
  userBelt,
  trainedMoves,
  favorites,
  onOpenFullProfile
}: TrainingStatsModalProps) {
  if (!isOpen) return null;

  const total = TECHNIQUES.length;
  const trained = trainedMoves.length;
  const untrained = Math.max(0, total - trained);
  const percentage = total > 0 ? Math.round((trained / total) * 100) : 0;

  const xpProgress = getUserXPProgress(trainedMoves, TECHNIQUES);

  const donutData = [
    { name: 'Técnicas Treinadas', value: trained, color: '#10b981' },
    { name: 'Pendentes de Treino', value: untrained, color: '#27272a' },
  ];

  const categoryStats = (['finalizacao', 'raspagem', 'passagem', 'queda', 'defesa'] as TechniqueCategory[]).map(
    (cat) => {
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
    }
  );

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-zinc-100 flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: data.payload.color }}
            />
            {data.name}
          </p>
          <p className="text-zinc-300 font-mono">
            {data.value} golpes ({Math.round((data.value / total) * 100)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div
        id="training-stats-donut-modal"
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                Progresso de Treino
              </h2>
              <p className="text-xs text-zinc-400">
                Gráfico de Rosca de Técnicas Treinadas
              </p>
            </div>
          </div>

          <button
            id="btn-close-stats-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Belt Rank & XP Progression Bar Compact */}
        <BeltRankProgressBar progress={xpProgress} variant="compact" />

        {/* Donut Chart with Centered Metric */}
        <div className="relative w-full h-56 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="#09090b"
                strokeWidth={2}
                animationDuration={800}
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
            </PieChart>
          </ResponsiveContainer>

          {/* Donut hole center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              {percentage}%
            </span>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              {trained} de {total}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Concluídos
            </span>
          </div>
        </div>

        {/* Key Indicators */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-950/70 border border-emerald-500/30 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <span className="text-xs font-bold text-zinc-200 block">Treinados</span>
              <span className="text-xs text-zinc-400 font-mono">
                {trained} golpes ({percentage}%)
              </span>
            </div>
          </div>

          <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-zinc-700 shrink-0" />
            <div>
              <span className="text-xs font-bold text-zinc-200 block">A Treinar</span>
              <span className="text-xs text-zinc-400 font-mono">
                {untrained} golpes ({100 - percentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Category Progress Micro-bars */}
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            Distribuição por Categoria
          </span>
          <div className="space-y-2">
            {categoryStats.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium">{cat.name}</span>
                  <span className="font-mono text-zinc-400 text-[11px]">
                    <span className="text-white font-bold">{cat.trained}</span>/{cat.total} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          {onOpenFullProfile && (
            <button
              onClick={() => {
                onClose();
                onOpenFullProfile();
              }}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
            >
              <span>Abrir Painel Completo de Perfil</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors ml-auto"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
