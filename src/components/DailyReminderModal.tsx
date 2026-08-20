import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Clock,
  Calendar,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  Flame,
  X,
  Play,
  Info,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import {
  ReminderConfig,
  ReminderTheme,
  PRESET_TIMES,
  THEME_MESSAGES,
  loadReminderConfig,
  saveReminderConfig,
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  triggerPushNotification,
  playMartialChime
} from '../utils/notificationSystem';
import { loadStreakData } from '../utils/streakTracker';

interface DailyReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged?: (config: ReminderConfig) => void;
}

const DAYS_OF_WEEK = [
  { id: 0, label: 'Dom', full: 'Domingo' },
  { id: 1, label: 'Seg', full: 'Segunda-feira' },
  { id: 2, label: 'Ter', full: 'Terça-feira' },
  { id: 3, label: 'Qua', full: 'Quarta-feira' },
  { id: 4, label: 'Qui', full: 'Quinta-feira' },
  { id: 5, label: 'Sex', full: 'Sexta-feira' },
  { id: 6, label: 'Sáb', full: 'Sábado' },
];

const THEME_OPTIONS: { id: ReminderTheme; label: string; desc: string; icon: string }[] = [
  { id: 'streak', label: 'Proteção de Streak & Disciplina', desc: 'Avisa quantos dias seguidos você está ativo e estimula a não quebrar.', icon: '🔥' },
  { id: 'motivational', label: 'Filosofia & Frases dos Mestres', desc: 'Citações clássicas de Carlson, Hélio e lendas da arte suave.', icon: '🥋' },
  { id: 'fundamentals', label: 'Fundamentos & Postura', desc: 'Foco em base, fuga de quadril, pegadas e defesa sólida.', icon: '🛡️' },
  { id: 'submissions', label: 'Ataques & Finalizações', desc: 'Lembretes táticos sobre alavancas de armlock, triângulo e estrangulamentos.', icon: '⚡' },
  { id: 'mindset', label: 'Mente Serena & Respiração', desc: 'Reflexões sobre controle emocional e calma no meio da pressão.', icon: '🧘' },
  { id: 'custom', label: 'Mensagem Personalizada', desc: 'Escreva seu próprio grito de guerra ou aviso para o tatame.', icon: '✍️' },
];

export const DailyReminderModal: React.FC<DailyReminderModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [config, setConfig] = useState<ReminderConfig>(loadReminderConfig);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(getNotificationPermission);
  const [testSent, setTestSent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(loadReminderConfig());
      setPermission(getNotificationPermission());
      setTestSent(false);
      setToastMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const supported = isNotificationSupported();
  const streak = loadStreakData();

  const handleToggleEnabled = async () => {
    if (!config.enabled && permission !== 'granted') {
      const result = await requestNotificationPermission();
      setPermission(result);
      if (result === 'granted') {
        const updated = { ...config, enabled: true };
        setConfig(updated);
        saveReminderConfig(updated);
        onConfigChanged?.(updated);
        showToast('🔔 Lembretes ativados com sucesso! Permissão concedida.');
      } else {
        showToast('⚠️ Permissão negada pelo navegador. Ative as notificações nas configurações do site.', 'error');
      }
    } else {
      const updated = { ...config, enabled: !config.enabled };
      setConfig(updated);
      saveReminderConfig(updated);
      onConfigChanged?.(updated);
      showToast(updated.enabled ? '🔔 Lembrete diário ativado!' : '🔕 Lembretes diários desativados.');
    }
  };

  const handleRequestPermissionDirectly = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') {
      const updated = { ...config, enabled: true };
      setConfig(updated);
      saveReminderConfig(updated);
      onConfigChanged?.(updated);
      showToast('✅ Permissão concedida com sucesso!');
    }
  };

  const handleTimeChange = (newTime: string) => {
    const updated = { ...config, time: newTime };
    setConfig(updated);
    saveReminderConfig(updated);
    onConfigChanged?.(updated);
  };

  const toggleDay = (dayId: number) => {
    let newDays: number[];
    if (config.selectedDays.includes(dayId)) {
      if (config.selectedDays.length === 1) {
        showToast('⚠️ Selecione pelo menos um dia para o lembrete.', 'error');
        return;
      }
      newDays = config.selectedDays.filter((d) => d !== dayId);
    } else {
      newDays = [...config.selectedDays, dayId].sort((a, b) => a - b);
    }
    const updated = { ...config, selectedDays: newDays };
    setConfig(updated);
    saveReminderConfig(updated);
    onConfigChanged?.(updated);
  };

  const selectAllDays = () => {
    const updated = { ...config, selectedDays: [0, 1, 2, 3, 4, 5, 6] };
    setConfig(updated);
    saveReminderConfig(updated);
    onConfigChanged?.(updated);
  };

  const selectWeekdays = () => {
    const updated = { ...config, selectedDays: [1, 2, 3, 4, 5] };
    setConfig(updated);
    saveReminderConfig(updated);
    onConfigChanged?.(updated);
  };

  const handleThemeChange = (theme: ReminderTheme) => {
    const updated = { ...config, theme };
    setConfig(updated);
    saveReminderConfig(updated);
    onConfigChanged?.(updated);
  };

  const handleCustomMessageChange = (msg: string) => {
    const updated = { ...config, customMessage: msg };
    setConfig(updated);
    saveReminderConfig(updated);
    onConfigChanged?.(updated);
  };

  const handleToggleSound = () => {
    const updated = { ...config, soundEnabled: !config.soundEnabled };
    setConfig(updated);
    saveReminderConfig(updated);
    onConfigChanged?.(updated);
    if (updated.soundEnabled) {
      playMartialChime();
    }
  };

  const handleSendTestNotification = async () => {
    if (permission !== 'granted') {
      const res = await requestNotificationPermission();
      setPermission(res);
      if (res !== 'granted') {
        showToast('⚠️ Permissão não concedida. Não foi possível enviar o push de teste.', 'error');
        return;
      }
    }

    const payload = config.theme === 'custom' && config.customMessage.trim()
      ? { title: '🥋 Teste do Lembrete de Treino!', body: config.customMessage.trim() }
      : THEME_MESSAGES[config.theme](streak.currentStreak || 1);

    const ok = triggerPushNotification(
      `[TESTE] ${payload.title}`,
      {
        body: payload.body,
      },
      config.soundEnabled
    );

    if (ok) {
      setTestSent(true);
      showToast('🚀 Notificação de teste enviada para seu sistema!');
      setTimeout(() => setTestSent(false), 4000);
    } else {
      showToast('⚠️ Falha ao disparar notificação. Verifique se o navegador suporta notificações.', 'error');
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const activeThemeObj = THEME_OPTIONS.find((t) => t.id === config.theme) || THEME_OPTIONS[0];
  const previewPayload = config.theme === 'custom' && config.customMessage.trim()
    ? { title: '🥋 Hora do Treino de Jiu-Jitsu!', body: config.customMessage.trim() }
    : THEME_MESSAGES[config.theme](streak.currentStreak || 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        id="daily-reminder-modal-content"
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <BellRing className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Lembrete Diário de Treino
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Web Push API
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Receba notificações automáticas no seu horário de treino e nunca quebre seu Streak
              </p>
            </div>
          </div>

          <button
            id="btn-close-reminder-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="px-6 pt-4">
            <div className="p-3 rounded-xl bg-zinc-900 border border-amber-500/50 text-xs font-semibold text-amber-300 flex items-center gap-2 animate-fade-in shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="relative z-10 p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Main Activation Banner & Permission Status */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            config.enabled && permission === 'granted'
              ? 'bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
              : 'bg-zinc-900/70 border-zinc-800'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  config.enabled && permission === 'granted'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {config.enabled ? <BellRing className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Status do Lembrete:</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      config.enabled && permission === 'granted'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {config.enabled && permission === 'granted' ? 'ATIVADO' : 'DESATIVADO'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {permission === 'granted'
                      ? `Notificações autorizadas pelo navegador. Disparo diário às ${config.time}.`
                      : permission === 'denied'
                      ? '⚠️ Permissão bloqueada pelo navegador. Libere nas permissões da barra de endereço.'
                      : 'Clique no botão ao lado para autorizar as notificações no navegador.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {permission !== 'granted' && supported && (
                  <button
                    id="btn-grant-permission-now"
                    onClick={handleRequestPermissionDirectly}
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition-all shadow-md shadow-amber-500/20"
                  >
                    Permitir Notificações
                  </button>
                )}

                <button
                  id="btn-toggle-reminder-main"
                  onClick={handleToggleEnabled}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 ${
                    config.enabled
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-emerald-500/20'
                  }`}
                >
                  {config.enabled ? 'Desativar' : 'Ativar Lembrete'}
                </button>
              </div>
            </div>
          </div>

          {/* Time Picker & Quick Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                1. Horário do Lembrete de Treino
              </label>
              <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                {config.time} (24h)
              </span>
            </div>

            {/* Quick Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_TIMES.map((preset) => {
                const isSelected = config.time === preset.time;
                return (
                  <button
                    key={preset.time}
                    id={`btn-preset-time-${preset.time.replace(':', '')}`}
                    onClick={() => handleTimeChange(preset.time)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10 scale-[1.02]'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base">{preset.icon}</span>
                      <span className="text-xs font-mono font-black">{preset.time}</span>
                    </div>
                    <span className="text-xs font-bold text-white mt-1.5">{preset.label}</span>
                    <span className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{preset.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Time Selector Input */}
            <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
              <span className="text-xs font-medium text-zinc-400">Ou defina um horário específico:</span>
              <input
                id="input-custom-reminder-time"
                type="time"
                value={config.time}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 text-amber-400 font-mono font-bold text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-400"
              />
              <span className="text-xs text-zinc-500 hidden sm:inline">Persistido automaticamente no navegador.</span>
            </div>
          </div>

          {/* Days of Week Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                2. Dias da Semana de Treino
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectWeekdays}
                  className="text-[11px] text-zinc-400 hover:text-amber-400 font-medium px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800"
                >
                  Seg a Sex
                </button>
                <button
                  type="button"
                  onClick={selectAllDays}
                  className="text-[11px] text-zinc-400 hover:text-amber-400 font-medium px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800"
                >
                  Todos os dias
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {DAYS_OF_WEEK.map((d) => {
                const isSelected = config.selectedDays.includes(d.id);
                return (
                  <button
                    key={d.id}
                    id={`btn-day-toggle-${d.id}`}
                    onClick={() => toggleDay(d.id)}
                    className={`py-2.5 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 border-amber-400 font-black shadow-md shadow-amber-500/20 scale-[1.03]'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <div>{d.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Motivational Theme Selector */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              3. Mensagem & Estilo do Lembrete
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = config.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    id={`btn-theme-${theme.id}`}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/80 text-amber-200 shadow-md'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{theme.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{theme.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{theme.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom message text box if 'custom' theme */}
            {config.theme === 'custom' && (
              <div className="mt-2 space-y-1.5 animate-fade-in">
                <label className="text-xs font-semibold text-zinc-400">Digite sua frase de motivação:</label>
                <input
                  id="input-custom-reminder-msg"
                  type="text"
                  value={config.customMessage}
                  onChange={(e) => handleCustomMessageChange(e.target.value)}
                  placeholder="Ex: Não falte ao treino hoje, seu futuro faixa preta agradece!"
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          {/* Sound & Chime Options */}
          <div className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                {config.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-bold text-white">Toque Harmônico OSS (Som do Tatame)</span>
                <p className="text-[11px] text-zinc-400">Toca um sino sutil de tatame ao disparar o lembrete.</p>
              </div>
            </div>

            <button
              id="btn-toggle-sound"
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                config.soundEnabled
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              {config.soundEnabled ? 'Ativado' : 'Silencioso'}
            </button>
          </div>

          {/* Live Notification Preview Box */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Pré-visualização do Push no Sistema:
            </span>
            <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-4 flex items-start gap-3 shadow-inner">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 shrink-0">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-sm">🥋</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{previewPayload.title}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{config.time}</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{previewPayload.body}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold">
                  <Flame className="w-3 h-3" />
                  <span>Streak Atual: {streak.currentStreak} dia(s)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="relative z-10 px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Salvo no localStorage</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-test-notification"
              onClick={handleSendTestNotification}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                testSent
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>{testSent ? '✓ Enviado!' : 'Testar Notificação Agora'}</span>
            </button>

            <button
              id="btn-save-close-reminder"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-all shadow-md shadow-amber-500/20"
            >
              Concluir
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
