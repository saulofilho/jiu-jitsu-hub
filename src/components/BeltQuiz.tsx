import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  ArrowRight,
  HelpCircle,
  Swords,
  Scroll
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { BeltLevel } from '../types';
import confetti from 'canvas-confetti';

interface BeltQuizProps {
  userBelt: BeltLevel;
}

export const BeltQuiz: React.FC<BeltQuizProps> = ({ userBelt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (score >= QUIZ_QUESTIONS.length * 0.75) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div id="belt-quiz-section" className="space-y-6 max-w-3xl mx-auto">
      {/* Header card */}
      <div className="bg-[#0f0f15]/90 border border-red-950/60 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-2 backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 p-0.5 shadow-lg shadow-red-900/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-warrior font-bold text-white">
                  Exame de Graduação & Regras IBJJF
                </h2>
                <span className="font-kanji text-xs text-red-400 font-bold px-2 py-0.5 rounded bg-red-950/60 border border-red-800/60">
                  昇段
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Avalie seus conhecimentos teóricos, regras de pontuação, história do Bushido e biomecânica.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-zinc-950 text-amber-400 border border-zinc-800 shrink-0">
            {isFinished ? 'Finalizado' : `Questão ${currentIndex + 1}/${QUIZ_QUESTIONS.length}`}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Progress Bar */}
          <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-amber-600 transition-all duration-300 shadow-sm"
              style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/70 uppercase font-warrior font-bold text-[10px] tracking-wider">
                {currentQ.category}
              </span>
              <span className="text-zinc-400 capitalize font-medium">Nível: {currentQ.difficulty}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-warrior font-bold text-white leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let optionStyle = 'bg-zinc-950 hover:bg-zinc-900/80 border-zinc-800/90 text-zinc-200';
              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-950/30';
                } else if (idx === selectedOption) {
                  optionStyle = 'bg-red-950/80 border-red-500 text-red-300 shadow-md shadow-red-950/30';
                } else {
                  optionStyle = 'bg-zinc-950/50 border-zinc-900 text-zinc-600 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm flex items-start justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="mt-0.5 font-normal leading-relaxed">{option}</span>
                  </div>

                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className="bg-[#141010] border border-red-950/80 rounded-2xl p-4 space-y-2 animate-fade-in shadow-lg">
              <h5 className="text-xs font-warrior font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" /> Ensinamento do Sensei:
              </h5>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Footer Action */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-zinc-950 font-black text-xs transition-all shadow-lg shadow-red-900/30 font-warrior"
              >
                <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Próximo Desafio' : 'Ver Veredito do Dojo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results Screen */
        <div className="bg-[#0e0e13] border border-red-950/70 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600/20 to-amber-600/20 border border-red-500/30 flex items-center justify-center mx-auto shadow-xl">
            <Award className="w-10 h-10 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-warrior font-bold text-white">
              Exame Teórico Concluído!
            </h3>
            <p className="text-sm text-zinc-400">
              Você acertou <strong className="text-amber-400 font-mono text-lg">{score}</strong> de <strong className="text-zinc-200">{QUIZ_QUESTIONS.length}</strong> questões ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%).
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed font-medium">
            {score >= QUIZ_QUESTIONS.length * 0.8 ? (
              <span className="text-emerald-400 font-bold block">
                🥋 Excelente! Seu conhecimento teórico e de arbitragem está afiado como uma katana e digno de graduação!
              </span>
            ) : score >= QUIZ_QUESTIONS.length * 0.5 ? (
              <span className="text-amber-400 font-bold block">
                🥋 Bom desempenho! Revise os pergaminhos de pontuação e as histórias para gabaritar o próximo exame.
              </span>
            ) : (
              <span className="text-red-400 font-bold block">
                🥋 Mais disciplina e estudo de fundamentos são necessários. Consulte a enciclopédia de golpes antes de tentar novamente!
              </span>
            )}
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-zinc-950 font-black text-xs transition-all shadow-lg shadow-red-900/30 font-warrior"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refazer Avaliação</span>
          </button>
        </div>
      )}
    </div>
  );
};

