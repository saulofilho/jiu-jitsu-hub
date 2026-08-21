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
import { TechniquePathView } from './components/TechniquePathView';
import { AmbientSoundPlayer } from './components/AmbientSoundPlayer';
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
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col selection:bg-red-600 selection:text-white relative overflow-x-hidden">
      {/* Subtle Martial Atmosphere Background Elements */}
      <div className="fixed inset-0 bg-tatami-pattern opacity-40 pointer-events-none z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

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
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
            onNavigateToPaths={() => setActiveTab('caminhos')}
            onCompareTechnique={(techId) => {
              setCompareTechA(techId);
              setActiveTab('comparador');
            }}
          />
        )}

        {activeTab === 'caminhos' && (
          <TechniquePathView
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            trainedMoves={trainedMoves}
            toggleTrained={toggleTrained}
            userBelt={userBelt}
            onNavigateToTechnique={(techId) => {
              setActiveTab('golpes');
            }}
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

      {/* Warrior / Dojo Footer */}
      <footer className="relative z-10 bg-[#070709] border-t border-red-950/60 text-zinc-400 py-12 mt-16 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Ambient Dojo Soundscape Player */}
          <AmbientSoundPlayer />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <Shield className="w-5 h-5 text-red-500" />
                <span className="font-warrior font-black text-white tracking-widest text-base">
                  JIU-JITSU HUB • ARTE SUAVE
                </span>
                <span className="inkan-stamp text-[10px]">武道</span>
              </div>
              <p className="text-xs text-zinc-400 max-w-md">
                Enciclopédia Marcial: Biomecânica Invisível, Linhagens Históricas, Regras Oficiais IBJJF e Inteligência Artificial para Lutadores.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-zinc-300">
              <button onClick={() => setActiveTab('golpes')} className="hover:text-red-400 transition-colors">
                Golpes (技)
              </button>
              <button onClick={() => setActiveTab('perfil')} className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
                Meu Dojo (道場)
              </button>
              <button onClick={() => setActiveTab('escolas')} className="hover:text-red-400 transition-colors">
                Linhagens (流派)
              </button>
              <button onClick={() => setActiveTab('historia')} className="hover:text-red-400 transition-colors">
                Bushido (武士道)
              </button>
              <button onClick={() => setActiveTab('regras')} className="hover:text-red-400 transition-colors">
                Placar IBJJF
              </button>
              <button onClick={() => setActiveTab('noticias')} className="hover:text-red-400 transition-colors">
                Torneios
              </button>
              <button onClick={() => setActiveTab('mestre-ai')} className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" /> Mestre IA
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-red-500 font-bold">OSS • 押忍</span>
              <span>—</span>
              <span className="text-zinc-400 font-serif">心技体 (Shin-Gi-Tai: Mente, Técnica e Corpo)</span>
            </div>
            <div className="text-zinc-500">
              Jiu-Jitsu Para Todos • Respeito, Disciplina e Honra
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
