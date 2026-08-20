import React, { useState, useEffect } from 'react';
import { BeltLevel } from './types';
import { Navbar } from './components/Navbar';
import { TechniqueEncyclopedia } from './components/TechniqueEncyclopedia';
import { SchoolsLineages } from './components/SchoolsLineages';
import { HistoryCuriosities } from './components/HistoryCuriosities';
import { RulesAndScoreboard } from './components/RulesAndScoreboard';
import { NewsAndCalendar } from './components/NewsAndCalendar';
import { MestreAI } from './components/MestreAI';
import { BeltQuiz } from './components/BeltQuiz';
import { SearchModal } from './components/SearchModal';
import { DailyTipCard } from './components/DailyTipCard';
import { UserProfileStats } from './components/UserProfileStats';
import { TrainingStatsModal } from './components/TrainingStatsModal';
import { BadgeUnlockToast } from './components/BadgeUnlockToast';
import { TrainingDiary } from './components/TrainingDiary';
import { TechniqueComparator } from './components/TechniqueComparator';
import { Shield, Award, Heart, Sparkles, BookOpen, Flame, Target } from 'lucide-react';
import { TECHNIQUES } from './data/techniques';
import { getUserXPProgress, AchievementBadge } from './utils/xpSystem';
import { loadStreakData } from './utils/streakTracker';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('golpes');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<AchievementBadge | null>(null);
  const [compareTechA, setCompareTechA] = useState<string>('armlock-guarda-fechada');
  const [compareTechB, setCompareTechB] = useState<string>('triangulo-guarda-fechada');

  // Persistent user belt selection
  const [userBelt, setUserBelt] = useState<BeltLevel>(() => {
    const saved = localStorage.getItem('bjj_user_belt');
    return (saved as BeltLevel) || 'azul';
  });

  // Persistent favorite techniques
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bjj_favorites');
      return saved ? JSON.parse(saved) : ['arm_lock_guarda', 'kimura_guarda', 'triangulo_guarda'];
    } catch {
      return ['arm_lock_guarda', 'kimura_guarda', 'triangulo_guarda'];
    }
  });

  // Persistent trained moves checklist
  const [trainedMoves, setTrainedMoves] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bjj_trained_moves');
      return saved ? JSON.parse(saved) : ['arm_lock_guarda', 'raspagem_tesoura'];
    } catch {
      return ['arm_lock_guarda', 'raspagem_tesoura'];
    }
  });

  // Check for badge unlocks dynamically
  useEffect(() => {
    const streak = loadStreakData();
    const progress = getUserXPProgress(trainedMoves, TECHNIQUES, favorites, streak);
    const knownUnlockedRaw = localStorage.getItem('bjj_known_unlocked_badge_ids');
    let knownUnlocked: string[] = [];
    try {
      if (knownUnlockedRaw) knownUnlocked = JSON.parse(knownUnlockedRaw);
    } catch {
      knownUnlocked = [];
    }

    const currentUnlocked = progress.achievements.filter(a => a.unlocked);
    const newlyFound = currentUnlocked.find(a => !knownUnlocked.includes(a.id));

    if (newlyFound && knownUnlocked.length > 0) {
      setNewlyUnlockedBadge(newlyFound);
    }

    const allUnlockedIds = currentUnlocked.map(a => a.id);
    localStorage.setItem('bjj_known_unlocked_badge_ids', JSON.stringify(allUnlockedIds));
  }, [trainedMoves, favorites]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bjj_user_belt', userBelt);
  }, [userBelt]);

  useEffect(() => {
    localStorage.setItem('bjj_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('bjj_trained_moves', JSON.stringify(trainedMoves));
  }, [trainedMoves]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleTrained = (id: string) => {
    setTrainedMoves((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNavigateFromSearch = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-zinc-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userBelt={userBelt}
        setUserBelt={setUserBelt}
        openSearch={() => setIsSearchOpen(true)}
        favoritesCount={favorites.length}
        trainedCount={trainedMoves.length}
        trainedMoves={trainedMoves}
        totalCount={TECHNIQUES.length}
        openStatsModal={() => setIsStatsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Daily Tip component displayed on home / main view */}
        <DailyTipCard onNavigate={(tab) => setActiveTab(tab)} />

        {activeTab === 'golpes' && (
          <TechniqueEncyclopedia
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            trainedMoves={trainedMoves}
            toggleTrained={toggleTrained}
            userBelt={userBelt}
            onNavigateToProfile={() => setActiveTab('perfil')}
            onCompareTechnique={(techId) => {
              setCompareTechA(techId);
              setActiveTab('comparador');
            }}
          />
        )}

        {activeTab === 'comparador' && (
          <TechniqueComparator
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            trainedMoves={trainedMoves}
            toggleTrained={toggleTrained}
            userBelt={userBelt}
            initialTechIdA={compareTechA}
            initialTechIdB={compareTechB}
          />
        )}

        {activeTab === 'diario' && (
          <TrainingDiary
            userBelt={userBelt}
            trainedMoves={trainedMoves}
            onMarkTrained={toggleTrained}
            onNavigateToTechniques={() => setActiveTab('golpes')}
          />
        )}

        {activeTab === 'perfil' && (
          <UserProfileStats
            userBelt={userBelt}
            setUserBelt={setUserBelt}
            trainedMoves={trainedMoves}
            toggleTrained={toggleTrained}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'escolas' && <SchoolsLineages />}

        {activeTab === 'historia' && <HistoryCuriosities />}

        {activeTab === 'regras' && <RulesAndScoreboard />}

        {activeTab === 'noticias' && <NewsAndCalendar />}

        {activeTab === 'mestre-ai' && <MestreAI userBelt={userBelt} />}

        {activeTab === 'quiz' && <BeltQuiz userBelt={userBelt} />}
      </main>

      {/* Global Quick Donut Stats Modal */}
      <TrainingStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        userBelt={userBelt}
        trainedMoves={trainedMoves}
        favorites={favorites}
        onOpenFullProfile={() => setActiveTab('perfil')}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigateFromSearch}
      />

      {/* Badge Unlock Celebration Toast */}
      <BadgeUnlockToast
        unlockedBadge={newlyUnlockedBadge}
        onClose={() => setNewlyUnlockedBadge(null)}
      />

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-extrabold text-white tracking-wider">
                JIU-JITSU HUB • ARTE SUAVE
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Enciclopédia Completa de Golpes, História, Linhagens, Regras IBJJF & Inteligência Artificial.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-zinc-400">
            <button onClick={() => setActiveTab('golpes')} className="hover:text-amber-400 transition-colors">
              Golpes
            </button>
            <button onClick={() => setActiveTab('perfil')} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
              Meu Perfil & Gráficos
            </button>
            <button onClick={() => setActiveTab('escolas')} className="hover:text-amber-400 transition-colors">
              Escolas
            </button>
            <button onClick={() => setActiveTab('historia')} className="hover:text-amber-400 transition-colors">
              História
            </button>
            <button onClick={() => setActiveTab('regras')} className="hover:text-amber-400 transition-colors">
              Placar IBJJF
            </button>
            <button onClick={() => setActiveTab('noticias')} className="hover:text-amber-400 transition-colors">
              Notícias
            </button>
            <button onClick={() => setActiveTab('mestre-ai')} className="text-amber-400 hover:text-amber-300 transition-colors">
              Mestre IA
            </button>
          </div>

          <div className="text-xs text-zinc-600 font-mono">
            OSS • 押忍 • Jiu-Jitsu Para Todos
          </div>
        </div>
      </footer>
    </div>
  );
}
