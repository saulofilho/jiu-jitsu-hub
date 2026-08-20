export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  historyDates: string[]; // List of unique YYYY-MM-DD
  totalCheckIns: number;
  hasCheckedInToday: boolean;
  quizzesCompleted: number;
  mestreAIConsultations: number;
  drillsLoggedCount: number;
}

const STORAGE_KEY = 'bjj_streak_data';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadStreakData(): StreakData {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Default initial state for a new martial artist
      const initial: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        historyDates: [today],
        totalCheckIns: 1,
        hasCheckedInToday: true,
        quizzesCompleted: 0,
        mestreAIConsultations: 0,
        drillsLoggedCount: 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const data: StreakData = JSON.parse(saved);

    // Calculate if streak is active, continued, or reset
    const hasCheckedInToday = data.historyDates?.includes(today) || data.lastActiveDate === today;

    let currentStreak = data.currentStreak || 1;
    if (!hasCheckedInToday) {
      if (data.lastActiveDate === yesterday) {
        // Streak is still alive (user was active yesterday, haven't checked in yet today)
        // currentStreak remains unchanged until today's check-in
      } else if (data.lastActiveDate && data.lastActiveDate < yesterday) {
        // Missed more than 1 day: reset streak to 0 until check-in
        currentStreak = 0;
      }
    }

    return {
      ...data,
      currentStreak,
      hasCheckedInToday,
      historyDates: data.historyDates || [data.lastActiveDate || today],
      longestStreak: Math.max(data.longestStreak || 1, currentStreak),
    };
  } catch {
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: today,
      historyDates: [today],
      totalCheckIns: 1,
      hasCheckedInToday: true,
      quizzesCompleted: 0,
      mestreAIConsultations: 0,
      drillsLoggedCount: 0,
    };
  }
}

export function saveStreakData(data: StreakData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save streak data', e);
  }
}

export function recordDailyCheckIn(): { data: StreakData; isNewDay: boolean } {
  const current = loadStreakData();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (current.historyDates.includes(today) && current.lastActiveDate === today) {
    return { data: current, isNewDay: false };
  }

  let newStreak = current.currentStreak;
  if (current.lastActiveDate === yesterday) {
    newStreak += 1;
  } else if (current.lastActiveDate === today) {
    // Already checked in today
  } else {
    // Started a new streak
    newStreak = 1;
  }

  const updatedHistory = Array.from(new Set([...current.historyDates, today]));
  const longest = Math.max(current.longestStreak, newStreak);

  const updated: StreakData = {
    ...current,
    currentStreak: newStreak,
    longestStreak: longest,
    lastActiveDate: today,
    historyDates: updatedHistory,
    totalCheckIns: current.totalCheckIns + 1,
    hasCheckedInToday: true,
  };

  saveStreakData(updated);
  return { data: updated, isNewDay: true };
}

export function incrementStreakCounter(field: 'quizzesCompleted' | 'mestreAIConsultations' | 'drillsLoggedCount', amount: number = 1): StreakData {
  const current = loadStreakData();
  const updated: StreakData = {
    ...current,
    [field]: (current[field] || 0) + amount,
  };
  saveStreakData(updated);
  return updated;
}

export function setCustomStreakForTesting(days: number): StreakData {
  const current = loadStreakData();
  const today = getTodayDateString();
  
  // Generate simulated history dates
  const history: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    history.push(`${y}-${m}-${day}`);
  }

  const updated: StreakData = {
    ...current,
    currentStreak: days,
    longestStreak: Math.max(current.longestStreak, days),
    lastActiveDate: today,
    historyDates: history,
    totalCheckIns: Math.max(current.totalCheckIns, days),
    hasCheckedInToday: true,
  };

  saveStreakData(updated);
  return updated;
}
