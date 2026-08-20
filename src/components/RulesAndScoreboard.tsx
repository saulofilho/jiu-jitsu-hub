import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Award, 
  ShieldAlert, 
  Plus, 
  Minus, 
  Maximize2,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { IBJJF_POINTS, MATCH_DURATIONS } from '../data/rules';
import { playRoundStartBuzzer, playRoundEndBuzzer, playPointClickSound } from '../utils/audio';

export const RulesAndScoreboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'placar' | 'tabela_pontos' | 'tempos'>('placar');

  // Scoreboard State
  const [athlete1, setAthlete1] = useState({ name: 'Atleta Azul', points: 0, adv: 0, pen: 0 });
  const [athlete2, setAthlete2] = useState({ name: 'Atleta Branco', points: 0, adv: 0, pen: 0 });
  
  // Timer State
  const [roundDurationMinutes, setRoundDurationMinutes] = useState(6);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(6 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [isResting, setIsResting] = useState(false);
  const [restDurationSeconds, setRestDurationSeconds] = useState(60);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer countdown loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            playRoundEndBuzzer();
            if (!isResting) {
              // Switch to rest
              setIsResting(true);
              return restDurationSeconds;
            } else {
              // Advance round
              setIsResting(false);
              setCurrentRound((r) => (r < totalRounds ? r + 1 : 1));
              playRoundStartBuzzer();
              return roundDurationMinutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isResting, restDurationSeconds, roundDurationMinutes, totalRounds]);

  const handleStartPause = () => {
    if (!isRunning) {
      playRoundStartBuzzer();
    }
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setIsResting(false);
    setTimeLeftSeconds(roundDurationMinutes * 60);
  };

  const handleResetMatch = () => {
    handleResetTimer();
    setAthlete1({ name: 'Atleta Azul', points: 0, adv: 0, pen: 0 });
    setAthlete2({ name: 'Atleta Branco', points: 0, adv: 0, pen: 0 });
    setCurrentRound(1);
  };

  const changePoints = (athlete: 1 | 2, delta: number) => {
    playPointClickSound();
    if (athlete === 1) {
      setAthlete1((prev) => ({ ...prev, points: Math.max(0, prev.points + delta) }));
    } else {
      setAthlete2((prev) => ({ ...prev, points: Math.max(0, prev.points + delta) }));
    }
  };

  const changeAdv = (athlete: 1 | 2, delta: number) => {
    playPointClickSound();
    if (athlete === 1) {
      setAthlete1((prev) => ({ ...prev, adv: Math.max(0, prev.adv + delta) }));
    } else {
      setAthlete2((prev) => ({ ...prev, adv: Math.max(0, prev.adv + delta) }));
    }
  };

  const changePen = (athlete: 1 | 2, delta: number) => {
    playPointClickSound();
    if (athlete === 1) {
      setAthlete1((prev) => ({ ...prev, pen: Math.max(0, prev.pen + delta) }));
    } else {
      setAthlete2((prev) => ({ ...prev, pen: Math.max(0, prev.pen + delta) }));
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="rules-scoreboard-section" className="space-y-6">
      {/* Header toolbar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Timer className="w-6 h-6 text-amber-400" />
              Regras Oficiais & Placar de Luta IBJJF
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Cronômetro de rola profissional com efeitos sonoros, placar de vantagens/punições e manual de arbitragem.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 shrink-0">
            <button
              onClick={() => setActiveTab('placar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'placar' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Placar & Cronômetro</span>
            </button>
            <button
              onClick={() => setActiveTab('tabela_pontos')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'tabela_pontos' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Tabela de Pontos</span>
            </button>
            <button
              onClick={() => setActiveTab('tempos')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'tempos' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Duração por Faixa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Placar de Luta & Cronômetro */}
      {activeTab === 'placar' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Top Config Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Tempo do Round:</span>
              {[5, 6, 8, 10].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setRoundDurationMinutes(mins);
                    if (!isRunning) setTimeLeftSeconds(mins * 60);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    roundDurationMinutes === mins
                      ? 'bg-amber-500 text-zinc-950'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-xs">Round:</span>
              <span className="text-amber-400 font-bold font-mono text-sm px-2 py-0.5 bg-zinc-900 rounded-md border border-zinc-800">
                {currentRound} / {totalRounds}
              </span>
            </div>
          </div>

          {/* Central Timer Display */}
          <div className="text-center py-4 bg-zinc-900/60 rounded-3xl border border-zinc-800/80 space-y-3 relative overflow-hidden">
            {isResting && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold animate-pulse">
                🔔 INTERVALO / DESCANSO
              </div>
            )}

            <div className={`font-mono text-6xl sm:text-8xl md:text-9xl font-black tracking-tight ${isResting ? 'text-emerald-400' : 'text-white'}`}>
              {formatTime(timeLeftSeconds)}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                id="btn-timer-toggle"
                onClick={handleStartPause}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                }`}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                <span>{isRunning ? 'PAUSAR COMBATE' : 'INICIAR ROLA'}</span>
              </button>

              <button
                id="btn-timer-reset"
                onClick={handleResetTimer}
                className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                title="Reiniciar tempo do round"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                id="btn-match-reset"
                onClick={handleResetMatch}
                className="px-4 py-3 rounded-2xl bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-900/60 font-bold text-xs"
                title="Zerar placar e reiniciar luta"
              >
                Zerar Placar
              </button>
            </div>
          </div>

          {/* Athletes Scoreboards (Split View) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Athlete 1 (Azul) */}
            <div className="bg-gradient-to-b from-blue-950/40 via-zinc-900 to-zinc-950 border-2 border-blue-600/60 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={athlete1.name}
                  onChange={(e) => setAthlete1({ ...athlete1, name: e.target.value })}
                  className="bg-transparent text-lg font-black text-blue-400 focus:outline-none focus:border-b border-blue-500"
                />
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white font-bold uppercase">
                  Faixa Azul
                </span>
              </div>

              {/* Huge Points Number */}
              <div className="text-center py-4 bg-zinc-950/80 rounded-2xl border border-blue-900/40">
                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 block">Pontos</span>
                <span className="font-mono text-7xl font-black text-white">{athlete1.points}</span>
              </div>

              {/* Quick Points Addition Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => changePoints(1, 2)}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-md transition-colors"
                >
                  +2 (Queda/Rasp)
                </button>
                <button
                  onClick={() => changePoints(1, 3)}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-md transition-colors"
                >
                  +3 (Passagem)
                </button>
                <button
                  onClick={() => changePoints(1, 4)}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-md transition-colors"
                >
                  +4 (Montada)
                </button>
                <button
                  onClick={() => changePoints(1, -1)}
                  className="py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs border border-zinc-800"
                >
                  -1 Corrigir
                </button>
              </div>

              {/* Advantages and Penalties Sub-row */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
                {/* Advantages */}
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-amber-400 block">Vantagens</span>
                  <div className="flex items-center justify-center gap-3 my-1">
                    <button onClick={() => changeAdv(1, -1)} className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-2xl font-black text-amber-400 font-mono">{athlete1.adv}</span>
                    <button onClick={() => changeAdv(1, 1)} className="p-1 rounded bg-amber-500 text-zinc-950 hover:bg-amber-400">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Penalties */}
                <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-red-400 block">Punições (Falta)</span>
                  <div className="flex items-center justify-center gap-3 my-1">
                    <button onClick={() => changePen(1, -1)} className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-2xl font-black text-red-400 font-mono">{athlete1.pen}</span>
                    <button onClick={() => changePen(1, 1)} className="p-1 rounded bg-red-600 text-white hover:bg-red-500">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Athlete 2 (Branco) */}
            <div className="bg-gradient-to-b from-stone-900/40 via-zinc-900 to-zinc-950 border-2 border-stone-400/60 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={athlete2.name}
                  onChange={(e) => setAthlete2({ ...athlete2, name: e.target.value })}
                  className="bg-transparent text-lg font-black text-stone-200 focus:outline-none focus:border-b border-stone-400"
                />
                <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 text-zinc-950 font-bold uppercase">
                  Faixa Branca / Corner
                </span>
              </div>

              {/* Huge Points Number */}
              <div className="text-center py-4 bg-zinc-950/80 rounded-2xl border border-stone-700/40">
                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 block">Pontos</span>
                <span className="font-mono text-7xl font-black text-white">{athlete2.points}</span>
              </div>

              {/* Quick Points Addition Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => changePoints(2, 2)}
                  className="py-2.5 rounded-xl bg-stone-200 hover:bg-stone-100 text-zinc-950 font-black text-sm shadow-md transition-colors"
                >
                  +2 (Queda/Rasp)
                </button>
                <button
                  onClick={() => changePoints(2, 3)}
                  className="py-2.5 rounded-xl bg-stone-200 hover:bg-stone-100 text-zinc-950 font-black text-sm shadow-md transition-colors"
                >
                  +3 (Passagem)
                </button>
                <button
                  onClick={() => changePoints(2, 4)}
                  className="py-2.5 rounded-xl bg-stone-200 hover:bg-stone-100 text-zinc-950 font-black text-sm shadow-md transition-colors"
                >
                  +4 (Montada)
                </button>
                <button
                  onClick={() => changePoints(2, -1)}
                  className="py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs border border-zinc-800"
                >
                  -1 Corrigir
                </button>
              </div>

              {/* Advantages and Penalties Sub-row */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
                {/* Advantages */}
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-amber-400 block">Vantagens</span>
                  <div className="flex items-center justify-center gap-3 my-1">
                    <button onClick={() => changeAdv(2, -1)} className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-2xl font-black text-amber-400 font-mono">{athlete2.adv}</span>
                    <button onClick={() => changeAdv(2, 1)} className="p-1 rounded bg-amber-500 text-zinc-950 hover:bg-amber-400">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Penalties */}
                <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-red-400 block">Punições (Falta)</span>
                  <div className="flex items-center justify-center gap-3 my-1">
                    <button onClick={() => changePen(2, -1)} className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-2xl font-black text-red-400 font-mono">{athlete2.pen}</span>
                    <button onClick={() => changePen(2, 1)} className="p-1 rounded bg-red-600 text-white hover:bg-red-500">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tabela de Pontos Oficial */}
      {activeTab === 'tabela_pontos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {IBJJF_POINTS.map((rule, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <h4 className="text-base font-black text-white">{rule.name}</h4>
                  <span className="text-sm font-black px-3 py-1 rounded-xl bg-amber-500 text-zinc-950 shadow-md">
                    +{rule.points} PONTOS
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {rule.description}
                </p>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Tempo de estabilização necessário: {rule.stabilizationTime}</span>
                  </div>
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/60 text-zinc-400 text-[11px]">
                    <strong className="text-zinc-200">Exemplos práticos:</strong> {rule.examples.join(', ')}
                  </div>
                  <p className="text-[11px] text-zinc-400 italic">
                    💡 <strong className="text-zinc-300 not-italic">Nota do Árbitro:</strong> {rule.keyNotes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Duração de Combates por Faixa */}
      {activeTab === 'tempos' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl mx-auto">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Tempo Oficial de Luta IBJJF (Adulto & Master)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tabela oficial de minutos por round estabelecida no Livro de Regras da Federação Internacional de Jiu-Jitsu.
            </p>
          </div>

          <div className="divide-y divide-zinc-800">
            {MATCH_DURATIONS.map((d, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <span className="font-semibold text-zinc-200">{d.belt}</span>
                <span className="font-mono font-bold text-amber-400 px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800">
                  {d.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
