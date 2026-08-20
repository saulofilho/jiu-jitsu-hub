export type ReminderTheme = 'motivational' | 'streak' | 'fundamentals' | 'submissions' | 'mindset' | 'custom';

export interface ReminderConfig {
  enabled: boolean;
  time: string; // "HH:MM" in 24h format, e.g. "18:30"
  selectedDays: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  theme: ReminderTheme;
  customMessage: string;
  soundEnabled: boolean;
  lastNotifiedDate: string; // YYYY-MM-DD to avoid duplicate pushes on the same day
}

const STORAGE_KEY = 'bjj_reminder_config';

export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  enabled: false,
  time: '18:30',
  selectedDays: [1, 2, 3, 4, 5], // Monday to Friday by default
  theme: 'streak',
  customMessage: 'Hora de amarrar a faixa, pisar no tatame e evoluir 1% hoje!',
  soundEnabled: true,
  lastNotifiedDate: '',
};

export const PRESET_TIMES = [
  { label: 'Treino Matinal', time: '07:00', icon: '🌅', desc: 'Comece o dia com foco e energia' },
  { label: 'Treino do Almoço', time: '12:30', icon: '☀️', desc: 'Pausa para suar o kimono' },
  { label: 'Fim de Tarde', time: '18:00', icon: '🌆', desc: 'Desestresse do trabalho no tatame' },
  { label: 'Treino Noturno', time: '20:00', icon: '🌙', desc: 'Rola da noite e descanso com dever cumprido' },
];

export const THEME_MESSAGES: Record<ReminderTheme, (streakDays?: number) => { title: string; body: string }> = {
  streak: (streakDays = 1) => ({
    title: '🥋 Hora do Treino! Mantenha seu Streak!',
    body: `Você já está com ${streakDays} dia(s) ativo(s) no Jiu-Jitsu Hub. Não quebre a sequência, amarre a faixa e vamos ao tatame! OSS!`,
  }),
  motivational: () => ({
    title: '🥋 A Arte Suave Chama!',
    body: '“A faixa preta é a branca que nunca desistiu.” Seu treino de hoje é o alicerce da sua maestria de amanhã!',
  }),
  fundamentals: () => ({
    title: '🥋 Foco nos Fundamentos!',
    body: 'Postura, base e fuga de quadril salvam qualquer rola. Revise suas técnicas hoje e treine com consciência.',
  }),
  submissions: () => ({
    title: '🥋 Caçador de Finalizações!',
    body: 'Alavancas perfeitas superam a força bruta. Pratique seus armlocks, triângulos e estrangulamentos hoje!',
  }),
  mindset: () => ({
    title: '🥋 Mente Calma no Caos (OSS)',
    body: 'Respire fundo, controle o ritmo e imponha seu jogo. O tatame é seu laboratório de superação diária.',
  }),
  custom: () => ({
    title: '🥋 Lembrete de Treino - Jiu-Jitsu Hub',
    body: 'Seu horário de treino chegou! OSS!',
  }),
};

// Check if browser supports Web Notifications
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

// Get current permission state
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

// Request permission from the user
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação:', error);
    return Notification.permission;
  }
}

// Load reminder settings from localStorage
export function loadReminderConfig(): ReminderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_REMINDER_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_REMINDER_CONFIG, ...parsed };
  } catch {
    return DEFAULT_REMINDER_CONFIG;
  }
}

// Save reminder settings to localStorage
export function saveReminderConfig(config: ReminderConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Falha ao salvar configuração de lembrete:', e);
  }
}

// Synthesize pleasant martial arts sound / chime with Web Audio API
export function playMartialChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    // Fundamental tone (Gong / Bell chime harmonic frequencies)
    const freqs = [329.63, 440.0, 659.25, 880.0]; // E4, A4, E5, A5
    
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    });
  } catch {
    // Audio synthesis not available or blocked by autoplay policy
  }
}

// Send a desktop / mobile push notification via the browser Notification API
export function triggerPushNotification(
  title: string,
  options?: NotificationOptions,
  playSound = true
): boolean {
  if (!isNotificationSupported()) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    if (playSound) {
      playMartialChime();
    }

    const notifOptions: NotificationOptions = {
      icon: 'https://cdn-icons-png.flaticon.com/512/3593/3593452.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/3593/3593452.png',
      requireInteraction: false,
      silent: false,
      tag: 'bjj-daily-training-reminder',
      ...options,
    };

    const notif = new Notification(title, notifOptions);

    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    return true;
  } catch (error) {
    console.error('Erro ao disparar notificação push:', error);
    return false;
  }
}

// Check scheduled time vs current time and trigger if due
export function checkAndTriggerScheduledReminder(
  streakDays: number = 1
): { triggered: boolean; message?: string } {
  const config = loadReminderConfig();

  if (!config.enabled) {
    return { triggered: false };
  }

  if (getNotificationPermission() !== 'granted') {
    return { triggered: false };
  }

  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon ...
  if (!config.selectedDays.includes(currentDayOfWeek)) {
    return { triggered: false };
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // Already notified today
  if (config.lastNotifiedDate === todayStr) {
    return { triggered: false };
  }

  // Compare hours and minutes
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;

  // If current time matches or is past the scheduled time within a 5-minute window
  const [schedH, schedM] = config.time.split(':').map(Number);
  const schedMinutesTotal = schedH * 60 + schedM;
  const currentMinutesTotal = now.getHours() * 60 + now.getMinutes();

  // Allow trigger if within the target minute or slightly after (up to 15 mins if user opened app right after)
  if (currentMinutesTotal >= schedMinutesTotal && currentMinutesTotal < schedMinutesTotal + 15) {
    let payload = THEME_MESSAGES[config.theme] ? THEME_MESSAGES[config.theme](streakDays) : THEME_MESSAGES.streak(streakDays);

    if (config.theme === 'custom' && config.customMessage.trim()) {
      payload = {
        title: '🥋 Hora do Treino de Jiu-Jitsu!',
        body: config.customMessage.trim(),
      };
    }

    const success = triggerPushNotification(
      payload.title,
      {
        body: payload.body,
      },
      config.soundEnabled
    );

    if (success) {
      // Mark as notified today to prevent multiple alerts
      config.lastNotifiedDate = todayStr;
      saveReminderConfig(config);
      return { triggered: true, message: payload.body };
    }
  }

  return { triggered: false };
}
