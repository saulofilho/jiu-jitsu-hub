import React, { useState, useEffect, useCallback } from 'react';
import {
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  ShieldAlert,
  Flame,
  Clock,
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Technique, BeltLevel } from '../types';

interface FocusModeReaderProps {
  technique: Technique;
  allTechniques: Technique[];
  onClose: () => void;
  onSelectTechnique: (technique: Technique) => void;
  isFavorite: boolean;
  isTrained: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleTrained: (id: string) => void;
}

const BELT_BADGES: Record<BeltLevel, { label: string; bg: string; text: string }> = {
  branca: { label: 'Faixa Branca+', bg: 'bg-stone-200', text: 'text-stone-900' },
  azul: { label: 'Faixa Azul+', bg: 'bg-blue-600', text: 'text-white' },
  roxa: { label: 'Faixa Roxa+', bg: 'bg-purple-600', text: 'text-white' },
  marrom: { label: 'Faixa Marrom+', bg: 'bg-amber-900', text: 'text-amber-100' },
  preta: { label: 'Faixa Preta', bg: 'bg-zinc-900', text: 'text-red-500' },
  coral: { label: 'Faixa Coral', bg: 'bg-red-700', text: 'text-white' },
  vermelha: { label: 'Faixa Vermelha', bg: 'bg-red-800', text: 'text-amber-300' },
};

export function FocusModeReader({
  technique,
  allTechniques,
  onClose,
  onSelectTechnique,
  isFavorite,
  isTrained,
  onToggleFavorite,
  onToggleTrained,
}: FocusModeReaderProps) {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [viewFormat, setViewFormat] = useState<'stepper' | 'full'>('stepper');
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('large');

  // Drill Timer (ex: 3 min rounds for repetitive drills)
  const [timerSeconds, setTimerSeconds] = useState<number>(180);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [initialTimer, setInitialTimer] = useState<number>(180);

  // Technique indexing for Prev / Next
  const currentIndex = allTechniques.findIndex((t) => t.id === technique.id);
  const prevTech = currentIndex > 0 ? allTechniques[currentIndex - 1] : null;
  const nextTech = currentIndex < allTechniques.length - 1 ? allTechniques[currentIndex + 1] : null;

  // Handle drill timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const resetTimer = (secs: number = 180) => {
    setIsTimerRunning(false);
    setInitialTimer(secs);
    setTimerSeconds(secs);
  };

  // Keyboard navigation for focus mode
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        if (viewFormat === 'stepper') {
          setActiveStepIndex((prev) => (prev < technique.steps.length - 1 ? prev + 1 : prev));
        }
      } else if (e.key === 'ArrowLeft') {
        if (viewFormat === 'stepper') {
          setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
      }
    },
    [onClose, technique.steps.length, viewFormat]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset step index when technique changes
  useEffect(() => {
    setActiveStepIndex(0);
  }, [technique.id]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getFontSizeClasses = () => {
    switch (fontSizeLevel) {
      case 'xlarge':
        return {
          title: 'text-3xl sm:text-5xl',
          stepNumber: 'text-4xl sm:text-6xl',
          stepText: 'text-xl sm:text-2xl leading-relaxed',
          detailsText: 'text-base sm:text-lg',
        };
      case 'large':
        return {
          title: 'text-2xl sm:text-4xl',
          stepNumber: 'text-3xl sm:text-5xl',
          stepText: 'text-lg sm:text-xl leading-relaxed',
          detailsText: 'text-sm sm:text-base',
        };
      case 'normal':
      default:
        return {
          title: 'text-xl sm:text-3xl',
          stepNumber: 'text-2xl sm:text-4xl',
          stepText: 'text-base sm:text-lg leading-relaxed',
          detailsText: 'text-xs sm:text-sm',
        };
    }
  };

  const fontClasses = getFontSizeClasses();

  return (
    <div
      id="focus-mode-container"
      className="fixed inset-0 z-[100] bg-zinc-950 text-zinc-100 flex flex-col justify-between overflow-hidden select-none animate-fade-in font-sans"
    >
      {/* Subtle background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-900/40 blur-[100px] pointer-events-none" />

      {/* TOP BAR: Minimalist Controls */}
      <header className="relative z-10 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Technique Quick Info */}
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0 ${BELT_BADGES[technique.minBelt].bg} ${BELT_BADGES[technique.minBelt].text}`}
          >
            {BELT_BADGES[technique.minBelt].label}
          </span>
          <div className="truncate">
            <h1 className="text-base sm:text-lg font-black text-white truncate tracking-tight">
              {technique.name}
            </h1>
            {technique.japaneseName && (
              <span className="text-xs text-amber-400/90 font-serif italic hidden sm:inline">
                {technique.japaneseName}
              </span>
            )}
          </div>
        </div>

        {/* Center: Drill Timer */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900/90 border border-zinc-800 rounded-xl">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-mono font-bold text-zinc-200">
            {formatTimer(timerSeconds)}
          </span>
          <button
            id="btn-focus-timer-toggle"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            title={isTimerRunning ? 'Pausar Cronômetro' : 'Iniciar Treino'}
            className="p-1 text-zinc-400 hover:text-amber-400 transition-colors"
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            id="btn-focus-timer-reset"
            onClick={() => resetTimer(initialTimer)}
            title="Reiniciar (3 min)"
            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Actions & Exit */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Format Toggle: Passo a Passo ou Lista Completa */}
          <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => setViewFormat('stepper')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewFormat === 'stepper'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Passo a Passo
            </button>
            <button
              onClick={() => setViewFormat('full')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewFormat === 'full'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Visão Completa
            </button>
          </div>

          {/* Font Size Adjuster */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setFontSizeLevel('normal')}
              title="Texto Normal"
              className={`p-1.5 rounded text-xs ${
                fontSizeLevel === 'normal' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'
              }`}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFontSizeLevel('xlarge')}
              title="Texto Gigante (Ideal para ler no tatame)"
              className={`p-1.5 rounded text-xs ${
                fontSizeLevel === 'xlarge' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Favorite Button */}
          <button
            id="btn-focus-fav"
            onClick={() => onToggleFavorite(technique.id)}
            title="Favoritar Golpe"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
          >
            {isFavorite ? (
              <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {/* Mark Trained */}
          <button
            id="btn-focus-trained"
            onClick={() => onToggleTrained(technique.id)}
            title="Marcar como Treinado"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isTrained
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden md:inline">{isTrained ? 'Treinado' : 'Marcar Treino'}</span>
          </button>

          {/* Close / Sair do Modo Foco */}
          <button
            id="btn-exit-focus-mode"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 text-xs font-bold transition-all active:scale-95"
            title="Sair do Modo Foco (ESC)"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Sair do Modo Foco</span>
          </button>
        </div>
      </header>

      {/* MAIN READING CANVAS */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-5xl w-full mx-auto flex flex-col justify-between">
        {viewFormat === 'stepper' ? (
          /* SINGLE STEP / STEPPER CAROUSEL (TATAMI DRILL OPTIMIZED) */
          <div className="flex-1 flex flex-col justify-center space-y-6 sm:space-y-8 my-auto">
            {/* Context Position Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5 text-zinc-300 font-bold uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-amber-500" /> Posição:
                </span>
                <span className="text-zinc-200">{technique.startingPosition}</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-amber-400 font-bold">{technique.targetPositionOrSub}</span>
              </div>

              {technique.points && (
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  +{technique.points} Pontos IBJJF
                </span>
              )}
            </div>

            {/* Current Step Display Card */}
            <div className="bg-zinc-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
              {/* Step indicator pills */}
              <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1">
                {technique.steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeStepIndex
                        ? 'w-10 bg-amber-400'
                        : idx < activeStepIndex
                        ? 'w-4 bg-amber-700/60 hover:bg-amber-600'
                        : 'w-4 bg-zinc-800 hover:bg-zinc-700'
                    }`}
                    title={`Ir para Passo ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <div className="shrink-0 flex flex-col items-center">
                  <span
                    className={`font-black text-amber-400 font-mono tracking-tighter ${fontClasses.stepNumber}`}
                  >
                    0{activeStepIndex + 1}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Passo {activeStepIndex + 1}/{technique.steps.length}
                  </span>
                </div>

                <div className="flex-1 space-y-4">
                  <p className={`font-semibold text-zinc-100 ${fontClasses.stepText}`}>
                    {technique.steps[activeStepIndex]}
                  </p>
                </div>
              </div>

              {/* Invisible Jiu-Jitsu Highlight for this technique */}
              {technique.invisibleDetails.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-start gap-3 bg-amber-950/30 border border-amber-500/20 rounded-2xl p-4">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      Ajuste Invisível & Ponto Crítico de Pressão:
                    </span>
                    <p className={`text-amber-100/90 leading-relaxed ${fontClasses.detailsText}`}>
                      {technique.invisibleDetails[activeStepIndex % technique.invisibleDetails.length]}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                id="btn-focus-prev-step"
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeStepIndex === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 border border-zinc-800 font-bold text-sm transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Passo Anterior</span>
              </button>

              <div className="text-xs text-zinc-500 font-mono hidden sm:block">
                Use <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">←</kbd>{' '}
                e <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">→</kbd> ou <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Espaço</kbd>
              </div>

              <button
                id="btn-focus-next-step"
                onClick={() =>
                  setActiveStepIndex((prev) =>
                    prev < technique.steps.length - 1 ? prev + 1 : prev
                  )
                }
                disabled={activeStepIndex === technique.steps.length - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:pointer-events-none text-zinc-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Próximo Passo</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* FULL VIEW (ALL STEPS & ANNOTATIONS AT ONCE) */
          <div className="space-y-6 my-auto">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <h2 className={`font-black text-white ${fontClasses.title}`}>
                {technique.name}
              </h2>
              <p className="text-sm text-zinc-400">{technique.summary}</p>
            </div>

            {/* All Steps in Sequence */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Sequência Completa de Execução:
              </h3>
              <div className="space-y-3">
                {technique.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5"
                  >
                    <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className={`text-zinc-200 ${fontClasses.detailsText}`}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Invisible Jiu-Jitsu & Mistakes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technique.invisibleDetails.length > 0 && (
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-2">
                  <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> Jiu-Jitsu Invisível
                  </h4>
                  <ul className="space-y-1.5">
                    {technique.invisibleDetails.map((det, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-amber-100/80 flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        <span>{det}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {technique.commonMistakes.length > 0 && (
                <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 space-y-2">
                  <h4 className="text-xs font-black text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> Erros Críticos a Evitar
                  </h4>
                  <ul className="space-y-1.5">
                    {technique.commonMistakes.map((mis, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-red-200/80 flex items-start gap-2">
                        <span className="text-red-400 font-bold">✕</span>
                        <span>{mis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM FOOTER: Quick Switching Between Techniques */}
      <footer className="relative z-10 border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {prevTech ? (
          <button
            id="btn-focus-prev-tech"
            onClick={() => onSelectTechnique(prevTech)}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Golpe Anterior:</span>
            <span className="text-amber-400/90 truncate max-w-[140px] sm:max-w-[200px]">
              {prevTech.name}
            </span>
          </button>
        ) : (
          <div />
        )}

        <div className="text-xs text-zinc-500 font-mono">
          Golpe {currentIndex + 1} de {allTechniques.length}
        </div>

        {nextTech ? (
          <button
            id="btn-focus-next-tech"
            onClick={() => onSelectTechnique(nextTech)}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <span className="hidden sm:inline">Próximo Golpe:</span>
            <span className="text-amber-400/90 truncate max-w-[140px] sm:max-w-[200px]">
              {nextTech.name}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div />
        )}
      </footer>
    </div>
  );
}
