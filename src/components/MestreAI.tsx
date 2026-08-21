import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Shield, 
  Target, 
  Loader2, 
  Flame, 
  Brain, 
  CheckCircle2,
  RefreshCw,
  Swords,
  Scroll
} from 'lucide-react';
import { BeltLevel } from '../types';

interface MestreAIProps {
  userBelt: BeltLevel;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mestre';
  text: string;
  timestamp: string;
  suggestedDrills?: string[];
}

export const MestreAI: React.FC<MestreAIProps> = ({ userBelt }) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'gameplan'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'mestre',
      text: `🥋 **Oss! Eu sou o Sensei & Mestre BJJ.**\n\nEstou aqui para tirar qualquer dúvida sobre alavancas biomecânicas, defesas de finalizações, passagens de guarda complexas, regras da IBJJF e estratégias de competição do Bushido.\n\nQual é o desafio do seu treino hoje no Dojo?`,
      timestamp: 'Agora',
      suggestedDrills: ['Repetições de saída de 100kg', 'Drill de passagem Knee Slice', 'Transições para as costas']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Gameplan Generator state
  const [gameplanForm, setGameplanForm] = useState({
    weightClass: 'Peso Leve (até 76 kg)',
    playStyle: 'Guardeiro Flexível & Finalizador',
    targetGoal: 'Vencer Campeonato IBJJF por Pontos/Finalização'
  });
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const QUICK_QUESTIONS = [
    'Como passar uma guarda aranha de pernas longas?',
    'Dicas para atleta leve lutar contra pesados no absoluto',
    'Como sair da montada quando o oponente joga todo o peso no peito?',
    'Como encadear Armlock, Triângulo e Omoplata na guarda fechada?'
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/mestre-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          belt: userBelt,
          style: gameplanForm.playStyle,
        })
      });

      const data = await response.json();
      const mestreMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mestre',
        text: data.reply || 'Oss! Mantenha a disciplina nos treinos diários.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedDrills: data.suggestedDrills
      };

      setMessages((prev) => [...prev, mestreMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mestre',
        text: '🥋 **Oss! O segredo é a repetição e a calma.** Mantenha a postura ereta e os cotovelos colados às costelas. Tente novamente em instantes!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateGameplan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch('/api/gameplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          belt: userBelt,
          weightClass: gameplanForm.weightClass,
          playStyle: gameplanForm.playStyle,
          targetGoal: gameplanForm.targetGoal
        })
      });

      const data = await response.json();
      setGeneratedPlan(data.plan);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div id="mestre-ai-section" className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#0f0f15]/90 border border-red-950/60 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-72 h-24 bg-red-600/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 p-0.5 shadow-lg shadow-red-900/30 shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Swords className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-warrior font-bold text-white flex items-center gap-2">
                  Sensei IA & Estratégia de Combate
                </h2>
                <span className="font-kanji text-xs text-red-400 font-bold px-2 py-0.5 rounded bg-red-950/60 border border-red-800/60">
                  師範
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">
                Mentor de Jiu-Jitsu treinado em biomecânica, alavancas do Jiu-Jitsu invisível e regras IBJJF.
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 shrink-0">
            <button
              onClick={() => setActiveMode('chat')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'chat' ? 'bg-gradient-to-r from-red-600 to-amber-600 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Consultar Sensei</span>
            </button>
            <button
              onClick={() => setActiveMode('gameplan')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'gameplan' ? 'bg-gradient-to-r from-red-600 to-amber-600 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Gerador de Gameplan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Chat with Mestre IA */}
      {activeMode === 'chat' && (
        <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
          {/* Quick prompt pills */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-warrior font-bold text-zinc-400 uppercase tracking-widest block">
              Perguntas frequentes ao Sensei:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-red-400 border border-zinc-800 hover:border-red-900/50 transition-colors text-left font-medium"
                >
                  ⚡ {q}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'mestre' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 p-0.5 shrink-0 mt-1 shadow-md shadow-red-950/40">
                    <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                      <Swords className="w-4 h-4 text-red-400" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 text-zinc-950 font-semibold rounded-tr-none shadow-md shadow-red-950/30'
                      : 'bg-zinc-900/90 border border-red-950/40 text-zinc-200 rounded-tl-none shadow-lg'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {msg.suggestedDrills && msg.suggestedDrills.length > 0 && (
                    <div className="pt-2.5 border-t border-zinc-800 space-y-1.5">
                      <span className="text-[10px] uppercase font-warrior font-bold text-red-400 block tracking-wider">
                        Drills Recomendados pelo Sensei:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.suggestedDrills.map((d, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800 font-medium">
                            ✓ {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className={`block text-[10px] ${msg.sender === 'user' ? 'text-zinc-900 font-bold' : 'text-zinc-500'} text-right font-mono`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-zinc-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-zinc-400 text-xs p-3">
                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                <span className="font-warrior">O Sensei está analisando a biomecânica e formulando a estratégia...</span>
              </div>
            )}
          </div>

          {/* Input form */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Pergunte ao Sensei sobre posições, defesas ou regras..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 disabled:opacity-50 text-zinc-950 font-bold transition-all shadow-lg shadow-red-900/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Gameplan Generator */}
      {activeMode === 'gameplan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Config column */}
          <div className="lg:col-span-5 bg-[#0e0e13] border border-red-950/60 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-red-400" />
              <h3 className="text-base font-warrior font-bold text-white">
                Parâmetros do Combatente
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Categoria de Peso:</label>
                <select
                  value={gameplanForm.weightClass}
                  onChange={(e) => setGameplanForm({ ...gameplanForm, weightClass: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-red-500"
                >
                  <option value="Peso Galo (até 57 kg)">Peso Galo (até 57 kg)</option>
                  <option value="Peso Pluma (até 64 kg)">Peso Pluma (até 64 kg)</option>
                  <option value="Peso Pena (até 70 kg)">Peso Pena (até 70 kg)</option>
                  <option value="Peso Leve (até 76 kg)">Peso Leve (até 76 kg)</option>
                  <option value="Peso Médio (até 82 kg)">Peso Médio (até 82 kg)</option>
                  <option value="Peso Meio-Pesado (até 88 kg)">Peso Meio-Pesado (até 88 kg)</option>
                  <option value="Peso Pesado (até 94 kg)">Peso Pesado (até 94 kg)</option>
                  <option value="Super Pesado (até 100 kg)">Super Pesado (até 100 kg)</option>
                  <option value="Pesadíssimo (acima de 100 kg)">Pesadíssimo (+100 kg)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Estilo de Jogo Principal:</label>
                <select
                  value={gameplanForm.playStyle}
                  onChange={(e) => setGameplanForm({ ...gameplanForm, playStyle: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-red-500"
                >
                  <option value="Guardeiro Flexível & Finalizador">Guardeiro Flexível & Finalizador</option>
                  <option value="Passador de Pressão / Amassa-Pão">Passador de Pressão / Amassa-Pão</option>
                  <option value="Passador Ágil (Toreando / Speed Pass)">Passador Ágil (Toreando / Speed Pass)</option>
                  <option value="Quedador de Judô / Wrestling">Quedador de Judô / Wrestling</option>
                  <option value="Especialista em Meia Guarda Profunda">Especialista em Meia Guarda Profunda</option>
                  <option value="Caçador de Perna (Leglocker No-Gi)">Caçador de Perna (Leglocker No-Gi)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Objetivo da Luta:</label>
                <input
                  type="text"
                  value={gameplanForm.targetGoal}
                  onChange={(e) => setGameplanForm({ ...gameplanForm, targetGoal: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateGameplan}
              disabled={isGeneratingPlan}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 disabled:opacity-50 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all font-warrior"
            >
              {isGeneratingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scroll className="w-4 h-4" />}
              <span>{isGeneratingPlan ? 'TRAÇANDO PERGAMINHO TÁTICO...' : 'GERAR GAMEPLAN DE COMBATE'}</span>
            </button>
          </div>

          {/* Results column */}
          <div className="lg:col-span-7 bg-[#0e0e13] border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
            {generatedPlan ? (
              <div className="space-y-4">
                <div className="border-b border-zinc-800/80 pb-4">
                  <span className="text-xs px-2.5 py-0.5 rounded bg-red-950/80 text-red-400 font-bold border border-red-800/80 uppercase tracking-wider font-warrior">
                    Pergaminho de Combate do Sensei
                  </span>
                  <h3 className="text-xl sm:text-2xl font-warrior font-bold text-white mt-1.5">
                    {generatedPlan.title}
                  </h3>
                  {generatedPlan.overview && (
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{generatedPlan.overview}</p>
                  )}
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  {/* Standing strategy */}
                  <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-red-400 font-warrior font-bold uppercase text-[10px] tracking-wider block">
                      1. Início em Pé / Puxada ou Queda:
                    </span>
                    <p className="text-zinc-200 leading-relaxed font-normal">
                      {generatedPlan.standingStrategy}
                    </p>
                  </div>

                  {/* Primary sequence */}
                  <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-amber-400 font-warrior font-bold uppercase text-[10px] tracking-wider block">
                      2. Sequência Primária de Ataque (Plano A):
                    </span>
                    <p className="text-zinc-200 leading-relaxed font-normal">
                      {generatedPlan.primaryAttackSequence || generatedPlan.primarySequence}
                    </p>
                  </div>

                  {/* Backup plan */}
                  <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-sky-400 font-warrior font-bold uppercase text-[10px] tracking-wider block">
                      3. Contragolpe & Plano B (se o adversário travar):
                    </span>
                    <p className="text-zinc-200 leading-relaxed font-normal">
                      {generatedPlan.backupPlan || generatedPlan.secondarySequence}
                    </p>
                  </div>

                  {/* Top subs */}
                  {generatedPlan.keySubmissions && (
                    <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 space-y-2">
                      <span className="text-red-400 font-warrior font-bold uppercase text-[10px] tracking-wider block">
                        4. Finalizações Recomendadas no Fluxo:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(generatedPlan.keySubmissions || generatedPlan.topSubmissions).map((sub: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-xl bg-red-950/50 text-red-300 border border-red-900/60 font-bold text-xs">
                            🎯 {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mindset */}
                  <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-2xl space-y-1">
                    <span className="text-amber-400 font-warrior font-bold uppercase text-[10px] tracking-wider block">
                      5. Foco Mental & Bushido no Tatame:
                    </span>
                    <p className="text-amber-100/90 italic font-serif">
                      "{generatedPlan.mindsetTip || generatedPlan.mentalPreparation || 'Mantenha a calma sob pressão e imponha seu ritmo nos primeiros 60 segundos.'}"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <Target className="w-12 h-12 text-zinc-600 mx-auto" />
                <h4 className="text-base font-warrior font-bold text-zinc-300">Nenhum Gameplan Traçado Ainda</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Configure seu peso, faixa e estilo ao lado e consulte o Sensei para receber um mapa tático de combate passo a passo.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

