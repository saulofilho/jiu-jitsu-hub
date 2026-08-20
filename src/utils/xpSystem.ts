import { Technique, BeltLevel, TechniqueCategory, AchievementBadge, BadgeRarity, BadgeCategory } from '../types';
import { StreakData, loadStreakData } from './streakTracker';

export interface RankTier {
  level: number;
  name: string;
  belt: BeltLevel;
  degrees: number; // 0 to 4 stripes
  minXP: number;
  title: string;
  unlockedPerk: string;
}

export type { AchievementBadge } from '../types';

export interface UserXPProgress {
  totalXP: number;
  currentTier: RankTier;
  nextTier: RankTier | null;
  xpInCurrentTier: number;
  xpRequiredForNextTier: number;
  tierProgressPercentage: number;
  totalTechniquesCount: number;
  trainedCount: number;
  trainedPercentage: number;
  achievements: AchievementBadge[];
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  recentMilestones: string[];
  streakData: StreakData;
}

export const RANK_TIERS: RankTier[] = [
  { level: 1, name: 'Faixa Branca (0 Graus)', belt: 'branca', degrees: 0, minXP: 0, title: 'Iniciado nos Tatames', unlockedPerk: 'Acesso aos Fundamentos e Sobrevivência' },
  { level: 2, name: 'Faixa Branca (1º Grau)', belt: 'branca', degrees: 1, minXP: 150, title: 'Batedor de Consciência', unlockedPerk: 'Primeira listra de perseverança' },
  { level: 3, name: 'Faixa Branca (2º Grau)', belt: 'branca', degrees: 2, minXP: 350, title: 'Guardeiro em Formação', unlockedPerk: 'Domínio das fugas essenciais de quadril' },
  { level: 4, name: 'Faixa Branca (3º Grau)', belt: 'branca', degrees: 3, minXP: 600, title: 'Passador Aspirante', unlockedPerk: 'Entendimento de postura e base' },
  { level: 5, name: 'Faixa Branca (4º Grau)', belt: 'branca', degrees: 4, minXP: 900, title: 'Graduando para a Azul', unlockedPerk: 'Repertório sólido de raspagens e finalizações básicas' },
  
  { level: 6, name: 'Faixa Azul (0 Graus)', belt: 'azul', degrees: 0, minXP: 1300, title: 'Guerreiro da Arte Suave', unlockedPerk: 'Passagem pelo primeiro grande teste de resiliência' },
  { level: 7, name: 'Faixa Azul (1º Grau)', belt: 'azul', degrees: 1, minXP: 1750, title: 'Especialista em Guardas', unlockedPerk: 'Desenvolvimento do jogo aberto e meia guarda' },
  { level: 8, name: 'Faixa Azul (2º Grau)', belt: 'azul', degrees: 2, minXP: 2250, title: 'Pressão e Mobilidade', unlockedPerk: 'Conexão entre passagens ágeis e de pressão' },
  { level: 9, name: 'Faixa Azul (3º Grau)', belt: 'azul', degrees: 3, minXP: 2800, title: 'Caçador de Alavancas', unlockedPerk: 'Refinamento de chaves de braço e triângulos' },
  { level: 10, name: 'Faixa Azul (4º Grau)', belt: 'azul', degrees: 4, minXP: 3400, title: 'Pronto para a Faixa Roxa', unlockedPerk: 'Fluidez e repertório técnico diversificado' },

  { level: 11, name: 'Faixa Roxa (0 Graus)', belt: 'roxa', degrees: 0, minXP: 4100, title: 'Artista do Jiu-Jitsu', unlockedPerk: 'Início da criação do seu Jiu-Jitsu autoral' },
  { level: 12, name: 'Faixa Roxa (1º Grau)', belt: 'roxa', degrees: 1, minXP: 4850, title: 'Mestre do Timing', unlockedPerk: 'Antecipação de movimentos e contra-ataques' },
  { level: 13, name: 'Faixa Roxa (2º Grau)', belt: 'roxa', degrees: 2, minXP: 5650, title: 'Estrategista de Posição', unlockedPerk: 'Domínio das transições e guarda aranha/lasso' },
  { level: 14, name: 'Faixa Roxa (3º Grau)', belt: 'roxa', degrees: 3, minXP: 6500, title: 'Finalizador Dinâmico', unlockedPerk: 'Ataques múltiplos encadeados' },
  { level: 15, name: 'Faixa Roxa (4º Grau)', belt: 'roxa', degrees: 4, minXP: 7400, title: 'Candidato à Faixa Marrom', unlockedPerk: 'Velocidade, precisão e leitura avançada de luta' },

  { level: 16, name: 'Faixa Marrom (0 Graus)', belt: 'marrom', degrees: 0, minXP: 8400, title: 'Cirurgião das Alavancas', unlockedPerk: 'Lapidação técnica extrema e ataques de perna' },
  { level: 17, name: 'Faixa Marrom (1º Grau)', belt: 'marrom', degrees: 1, minXP: 9450, title: 'Senhor da Pressão', unlockedPerk: 'Ajuste de peso invisível e controle posicional' },
  { level: 18, name: 'Faixa Marrom (2º Grau)', belt: 'marrom', degrees: 2, minXP: 10550, title: 'Mestre dos Contra-Golpes', unlockedPerk: 'Inversões de cenário com mínimo esforço' },
  { level: 19, name: 'Faixa Marrom (3º Grau)', belt: 'marrom', degrees: 3, minXP: 11700, title: 'Guardião da Tradição', unlockedPerk: 'Capacidade de instrução e mentoria no dojo' },
  { level: 20, name: 'Faixa Marrom (4º Grau)', belt: 'marrom', degrees: 4, minXP: 12900, title: 'À Beira da Faixa Preta', unlockedPerk: 'Todas as peças do tabuleiro perfeitamente alinhadas' },

  { level: 21, name: 'Faixa Preta (0 Graus)', belt: 'preta', degrees: 0, minXP: 14200, title: 'Professor & Faixa Preta', unlockedPerk: 'O recomeço: mestria absoluta e transmissão da arte' },
  { level: 22, name: 'Faixa Preta (1º Grau)', belt: 'preta', degrees: 1, minXP: 15600, title: 'Mestre dos Tatames', unlockedPerk: 'Jiu-Jitsu Invisível no mais alto nível de consciência' },
];

export function calculateTechniqueXP(technique: Technique): number {
  let xp = 100; // Base XP
  if (technique.difficulty === 'intermediario') xp = 150;
  if (technique.difficulty === 'avancado') xp = 200;

  // Extra points bonus if technique has scoring point value
  if (technique.points) {
    xp += technique.points * 10;
  }

  // Bonus for invisible details depth
  if (technique.invisibleDetails && technique.invisibleDetails.length > 0) {
    xp += technique.invisibleDetails.length * 15;
  }

  return xp;
}

export function getUserXPProgress(
  trainedIds: string[],
  allTechniques: Technique[],
  favorites: string[] = [],
  customStreak?: StreakData
): UserXPProgress {
  const streak = customStreak || loadStreakData();
  const trainedSet = new Set(trainedIds);
  const trainedTechs = allTechniques.filter(t => trainedSet.has(t.id));
  
  let baseTechniqueXP = 0;
  trainedTechs.forEach(t => {
    baseTechniqueXP += calculateTechniqueXP(t);
  });

  const totalTechniquesCount = allTechniques.length;
  // Support custom extra drills/drilled sessions logged to scale techniques learned
  const totalTrainedAndDrilled = trainedTechs.length + (streak.drillsLoggedCount || 0);
  const trainedCount = totalTrainedAndDrilled;
  const trainedPercentage = totalTechniquesCount > 0
    ? Math.min(100, Math.round((trainedCount / totalTechniquesCount) * 100))
    : 0;

  // Calculate Category breakdown for achievements
  const subsCount = trainedTechs.filter(t => t.category === 'finalizacao').length;
  const sweepsCount = trainedTechs.filter(t => t.category === 'raspagem').length;
  const passesCount = trainedTechs.filter(t => t.category === 'passagem').length;
  const defensesCount = trainedTechs.filter(t => t.category === 'defesa').length;
  const takedownsCount = trainedTechs.filter(t => t.category === 'queda').length;
  const noGiCount = trainedTechs.filter(t => t.modality === 'nogi' || t.modality === 'ambos').length;
  const invisibleDetailsLearned = trainedTechs.reduce((acc, t) => acc + (t.invisibleDetails?.length || 0), 0);

  // All Defined Badges / Achievements
  const rawBadges: Omit<AchievementBadge, 'unlockedAt'>[] = [
    // --- REPERTÓRIO E TÉCNICAS APRENDIDAS (INCLUINDO 50 TÉCNICAS) ---
    {
      id: 'first_step',
      title: 'Primeiro Rolamento',
      description: 'Marque seu 1º golpe aprendido ou treinado no tatame.',
      iconName: 'Sparkles',
      category: 'repertorio',
      rarity: 'bronze',
      unlocked: trainedCount >= 1,
      progress: Math.min(1, trainedCount),
      target: 1,
      xpReward: 100,
      perk: 'Título: Aluno Iniciado'
    },
    {
      id: 'white_belt_scholar',
      title: 'Fundamentos do Tatame',
      description: 'Aprenda 5 técnicas completas no seu currículo.',
      iconName: 'BookOpen',
      category: 'repertorio',
      rarity: 'bronze',
      unlocked: trainedCount >= 5,
      progress: Math.min(5, trainedCount),
      target: 5,
      xpReward: 200,
      perk: 'Tag de Perfil: Estudioso'
    },
    {
      id: 'repertoire_10',
      title: 'Repertório Sólido',
      description: 'Domine 10 técnicas entre raspagens, finalizações e passagens.',
      iconName: 'Layers',
      category: 'repertorio',
      rarity: 'prata',
      unlocked: trainedCount >= 10,
      progress: Math.min(10, trainedCount),
      target: 10,
      xpReward: 350,
      perk: 'Título: Estrategista do Dojo'
    },
    {
      id: 'veteran_25',
      title: 'Veterano dos Tatames',
      description: 'Marque 25 técnicas dominadas na enciclopédia.',
      iconName: 'Award',
      category: 'repertorio',
      rarity: 'ouro',
      unlocked: trainedCount >= 25,
      progress: Math.min(25, trainedCount),
      target: 25,
      xpReward: 750,
      perk: 'Insígnia Dourada de Veterano'
    },
    {
      id: 'master_50_techniques',
      title: 'Enciclopédia Humana (50 Técnicas)',
      description: 'Alcance a impressionante marca de 50 técnicas aprendidas e driladas!',
      iconName: 'Trophy',
      category: 'repertorio',
      rarity: 'lendario',
      unlocked: trainedCount >= 50,
      progress: Math.min(50, trainedCount),
      target: 50,
      xpReward: 2000,
      perk: 'Título Honorífico: Mestre Enciclopédico'
    },

    // --- SEQUÊNCIA DE USO / DIAS CONSECUTIVOS (INCLUINDO 10 DIAS) ---
    {
      id: 'streak_1_day',
      title: 'Batismo no Tatame',
      description: 'Marque presença e inicie sua jornada diária de estudos.',
      iconName: 'CheckCircle2',
      category: 'disciplina',
      rarity: 'bronze',
      unlocked: streak.currentStreak >= 1,
      progress: Math.min(1, streak.currentStreak),
      target: 1,
      xpReward: 50,
      perk: 'Chama de Atividade Ativada'
    },
    {
      id: 'streak_3_days',
      title: 'Guerreiro da Semana',
      description: 'Mantenha 3 dias consecutivos de treinos e estudos.',
      iconName: 'Flame',
      category: 'disciplina',
      rarity: 'bronze',
      unlocked: streak.currentStreak >= 3,
      progress: Math.min(3, streak.currentStreak),
      target: 3,
      xpReward: 150,
      perk: 'Multiplicador de Sequência x1.1'
    },
    {
      id: 'streak_7_days',
      title: 'Semana Perfeita',
      description: 'Complete 7 dias consecutivos de constância e disciplina.',
      iconName: 'Calendar',
      category: 'disciplina',
      rarity: 'prata',
      unlocked: streak.currentStreak >= 7,
      progress: Math.min(7, streak.currentStreak),
      target: 7,
      xpReward: 400,
      perk: 'Moldura Prateada de Perfil'
    },
    {
      id: 'streak_10_days',
      title: 'Hábito de Samurai (10 Dias Consecutivos)',
      description: 'Alcance 10 dias seguidos sem falhar na sua rotina de Jiu-Jitsu.',
      iconName: 'Zap',
      category: 'disciplina',
      rarity: 'diamante',
      unlocked: streak.currentStreak >= 10,
      progress: Math.min(10, streak.currentStreak),
      target: 10,
      xpReward: 1000,
      perk: 'Título Especial: Espírito Inquebrável'
    },
    {
      id: 'streak_30_days',
      title: 'Lenda da Constância',
      description: 'Supere 30 dias ininterruptos de dedicação absoluta.',
      iconName: 'Crown',
      category: 'disciplina',
      rarity: 'lendario',
      unlocked: streak.currentStreak >= 30,
      progress: Math.min(30, streak.currentStreak),
      target: 30,
      xpReward: 3000,
      perk: 'Coroa de Dedicação Suprema'
    },

    // --- ESPECIALIDADES & FUNDAMENTOS ---
    {
      id: 'sub_specialist',
      title: 'Mestre das Finalizações',
      description: 'Treine pelo menos 5 finalizações diferentes (Armlock, Triângulo, etc.).',
      iconName: 'Flame',
      category: 'fundamentos',
      rarity: 'prata',
      unlocked: subsCount >= 5,
      progress: Math.min(5, subsCount),
      target: 5,
      xpReward: 300,
      perk: 'Especialista em Chaves e Estrangulamentos'
    },
    {
      id: 'sweep_artist',
      title: 'Alavanca Humana',
      description: 'Treine pelo menos 3 raspagens para dominar a arte de inverter a luta.',
      iconName: 'TrendingUp',
      category: 'fundamentos',
      rarity: 'prata',
      unlocked: sweepsCount >= 3,
      progress: Math.min(3, sweepsCount),
      target: 3,
      xpReward: 250,
      perk: 'Especialista em Guarda Ativa'
    },
    {
      id: 'pass_master',
      title: 'Passador de Elite',
      description: 'Treine pelo menos 3 passagens de guarda (Knee Cut, Leg Drag, Over-Under).',
      iconName: 'Target',
      category: 'fundamentos',
      rarity: 'prata',
      unlocked: passesCount >= 3,
      progress: Math.min(3, passesCount),
      target: 3,
      xpReward: 250,
      perk: 'Pressão Imparável'
    },
    {
      id: 'iron_defense',
      title: 'Escudo Inabalável',
      description: 'Domine pelo menos 2 defesas e fugas críticas (montada, costas ou armlock).',
      iconName: 'Shield',
      category: 'fundamentos',
      rarity: 'prata',
      unlocked: defensesCount >= 2,
      progress: Math.min(2, defensesCount),
      target: 2,
      xpReward: 250,
      perk: 'Defesa Hermética'
    },
    {
      id: 'takedown_power',
      title: 'Domínio em Pé',
      description: 'Treine pelo menos 2 quedas de Judô ou entradas de Wrestling.',
      iconName: 'Award',
      category: 'fundamentos',
      rarity: 'prata',
      unlocked: takedownsCount >= 2,
      progress: Math.min(2, takedownsCount),
      target: 2,
      xpReward: 250,
      perk: 'Equilíbrio e Projeção'
    },
    {
      id: 'nogi_specialist',
      title: 'Gladiador Sem Pano (No-Gi)',
      description: 'Aprenda 5 técnicas adaptadas ou exclusivas para combate No-Gi.',
      iconName: 'Crosshair',
      category: 'fundamentos',
      rarity: 'ouro',
      unlocked: noGiCount >= 5,
      progress: Math.min(5, noGiCount),
      target: 5,
      xpReward: 500,
      perk: 'Insígnia de Combatente No-Gi'
    },
    {
      id: 'invisible_master',
      title: 'Jiu-Jitsu Invisível',
      description: 'Estude mais de 15 detalhes invisíveis e ajustes ocultos de alavanca.',
      iconName: 'Sparkles',
      category: 'mestria',
      rarity: 'ouro',
      unlocked: invisibleDetailsLearned >= 15,
      progress: Math.min(15, invisibleDetailsLearned),
      target: 15,
      xpReward: 600,
      perk: 'Sensibilidade de Peso e Alavanca'
    },

    // --- CONHECIMENTO, TEORIA & COMUNIDADE ---
    {
      id: 'favorites_collector',
      title: 'Arsenal Selecionado',
      description: 'Favorite pelo menos 5 técnicas no seu livro de golpes prediletos.',
      iconName: 'Heart',
      category: 'conhecimento',
      rarity: 'bronze',
      unlocked: favorites.length >= 5,
      progress: Math.min(5, favorites.length),
      target: 5,
      xpReward: 150,
      perk: 'Curador Técnico'
    },
    {
      id: 'mestre_ai_disciple',
      title: 'Discípulo do Mestre AI',
      description: 'Consulte o Mestre AI para tirar dúvidas táticas e ajustes de posições.',
      iconName: 'Bot',
      category: 'conhecimento',
      rarity: 'prata',
      unlocked: (streak.mestreAIConsultations || 0) >= 1,
      progress: Math.min(1, streak.mestreAIConsultations || 0),
      target: 1,
      xpReward: 200,
      perk: 'Mente Aberta para o Aprendizado'
    },
    {
      id: 'quiz_graduate',
      title: 'Gabarito de Faixa',
      description: 'Complete ao menos 1 exame de regras e conhecimentos gerais no Quiz de Faixas.',
      iconName: 'HelpCircle',
      category: 'conhecimento',
      rarity: 'prata',
      unlocked: (streak.quizzesCompleted || 0) >= 1,
      progress: Math.min(1, streak.quizzesCompleted || 0),
      target: 1,
      xpReward: 250,
      perk: 'Conhecedor das Regras IBJJF'
    }
  ];

  // Map to full AchievementBadge with unlock timestamps persisted in local storage
  const savedUnlockDatesRaw = localStorage.getItem('bjj_unlocked_badges_dates');
  let savedUnlockDates: Record<string, string> = {};
  try {
    if (savedUnlockDatesRaw) savedUnlockDates = JSON.parse(savedUnlockDatesRaw);
  } catch {
    savedUnlockDates = {};
  }

  let updatedDates = false;
  const nowStr = new Date().toLocaleDateString('pt-BR');

  const achievements: AchievementBadge[] = rawBadges.map(b => {
    if (b.unlocked) {
      if (!savedUnlockDates[b.id]) {
        savedUnlockDates[b.id] = nowStr;
        updatedDates = true;
      }
      return {
        ...b,
        unlockedAt: savedUnlockDates[b.id]
      };
    }
    return {
      ...b,
      unlockedAt: undefined
    };
  });

  if (updatedDates) {
    try {
      localStorage.setItem('bjj_unlocked_badges_dates', JSON.stringify(savedUnlockDates));
    } catch (e) {
      console.error(e);
    }
  }

  // Bonus XP from Unlocked Badges
  let achievementBonusXP = 0;
  achievements.forEach(a => {
    if (a.unlocked) {
      achievementBonusXP += a.xpReward;
    }
  });

  const totalXP = baseTechniqueXP + achievementBonusXP;

  // Determine current RankTier
  let currentTier = RANK_TIERS[0];
  let nextTier: RankTier | null = RANK_TIERS[1] || null;

  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (totalXP >= RANK_TIERS[i].minXP) {
      currentTier = RANK_TIERS[i];
      nextTier = RANK_TIERS[i + 1] || null;
    } else {
      break;
    }
  }

  // Calculate percentage within current tier
  let xpInCurrentTier = 0;
  let xpRequiredForNextTier = 1;
  let tierProgressPercentage = 100;

  if (nextTier) {
    const tierSpan = nextTier.minXP - currentTier.minXP;
    xpInCurrentTier = totalXP - currentTier.minXP;
    xpRequiredForNextTier = tierSpan;
    tierProgressPercentage = Math.min(100, Math.max(0, Math.round((xpInCurrentTier / tierSpan) * 100)));
  }

  const unlockedBadgesCount = achievements.filter(a => a.unlocked).length;
  const totalBadgesCount = achievements.length;

  const recentMilestones: string[] = [];
  if (currentTier.level >= 2) recentMilestones.push(`Graduação: ${currentTier.name}`);
  if (streak.currentStreak >= 3) recentMilestones.push(`Sequência Ativa: ${streak.currentStreak} dias consecutivos no tatame`);
  if (trainedCount >= 50) recentMilestones.push('Marco Lendário: 50 técnicas aprendidas!');
  else if (trainedCount >= 10) recentMilestones.push(`Repertório: ${trainedCount} técnicas registradas`);

  return {
    totalXP,
    currentTier,
    nextTier,
    xpInCurrentTier,
    xpRequiredForNextTier,
    tierProgressPercentage,
    totalTechniquesCount,
    trainedCount,
    trainedPercentage,
    achievements,
    unlockedBadgesCount,
    totalBadgesCount,
    recentMilestones,
    streakData: streak
  };
}
