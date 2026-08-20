export type BeltLevel = 'branca' | 'azul' | 'roxa' | 'marrom' | 'preta' | 'coral' | 'vermelha';

export type TechniqueCategory = 
  | 'finalizacao' 
  | 'raspagem' 
  | 'passagem' 
  | 'queda' 
  | 'defesa' 
  | 'guarda' 
  | 'posicao';

export type SubCategory = 
  | 'estrangulamento' 
  | 'chave_braco' 
  | 'chave_perna' 
  | 'chave_ombro' 
  | 'guarda_fechada' 
  | 'guarda_aberta' 
  | 'meia_guarda' 
  | 'passagem_pressao' 
  | 'passagem_agil' 
  | 'projeção_judo' 
  | 'queda_wrestling' 
  | 'saida_montada' 
  | 'saida_costas' 
  | 'saida_100kg';

export type Modality = 'gi' | 'nogi' | 'ambos';

export type Difficulty = 'basico' | 'intermediario' | 'avancado';

export type BadgeRarity = 'bronze' | 'prata' | 'ouro' | 'diamante' | 'lendario';
export type BadgeCategory = 'repertorio' | 'disciplina' | 'fundamentos' | 'conhecimento' | 'mestria';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
  xpReward: number;
  perk?: string;
}

export interface Technique {
  id: string;
  name: string;
  japaneseName?: string;
  category: TechniqueCategory;
  subCategory: SubCategory;
  difficulty: Difficulty;
  minBelt: BeltLevel;
  modality: Modality;
  points?: number; // e.g. 2 for sweep/takedown, 3 for pass, 4 for mount/back
  summary: string;
  startingPosition: string;
  targetPositionOrSub: string;
  steps: string[];
  invisibleDetails: string[];
  commonMistakes: string[];
  counters: string[];
  followUps: string[];
  ibjjfLegalityNote?: string;
  tags: string[];
}

export interface School {
  id: string;
  name: string;
  founders: string[];
  foundationYear: number;
  headquarters: string;
  motto: string;
  philosophy: string;
  fightingStyle: string;
  notableChampions: string[];
  lineage: string;
  historySummary: string;
  funFacts: string[];
  logoColor: string;
  symbolEmoji: string;
}

export interface HistoryTopic {
  id: string;
  title: string;
  subtitle: string;
  category: 'origem' | 'curiosidade' | 'lutas_historicas' | 'linhagens' | 'filosofia' | 'faixas';
  era: string;
  summary: string;
  fullContent: string[];
  keyFigures: string[];
  legacyImpact: string;
  highlightQuote?: string;
}

export interface GlossaryTerm {
  term: string;
  origin: 'Japonês' | 'Gíria Brasileira' | 'Técnico' | 'Wrestling';
  definition: string;
  exampleContext: string;
}

export interface TournamentEvent {
  id: string;
  name: string;
  organization: 'IBJJF' | 'ADCC' | 'AJP' | 'CBJJE' | 'WNO' | 'BJJ Stars';
  date: string;
  location: string;
  modality: 'Gi' | 'No-Gi' | 'Gi & No-Gi';
  description: string;
  status: 'upcoming' | 'recent' | 'ongoing';
  livestreamInfo?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Competição' | 'Entrevista' | 'Técnica' | 'Comunidade' | 'História';
  date: string;
  author: string;
  readTime: string;
  excerpt: string;
  content: string[];
  tags: string[];
  likes: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'regras' | 'tecnica' | 'historia' | 'faixas';
  difficulty: Difficulty;
}

export interface ScoreboardState {
  athlete1: {
    name: string;
    points: number;
    advantages: number;
    penalties: number;
    color: 'blue' | 'white';
  };
  athlete2: {
    name: string;
    points: number;
    advantages: number;
    penalties: number;
    color: 'white' | 'black' | 'red';
  };
  roundTimeSeconds: number;
  initialTimeSeconds: number;
  isRunning: boolean;
  roundNumber: number;
  totalRounds: number;
  breakTimeSeconds: number;
  isBreak: boolean;
}

export type TrainingMood = 'excelente' | 'bom' | 'normal' | 'desafiador' | 'exaustivo';

export interface TrainingDiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  modality: Modality;
  durationMinutes: number;
  rollsCount: number;
  mood: TrainingMood;
  whatTrained: string; // Notas sobre o que treinou no dia
  difficulties: string; // Quais dificuldades encontrou
  keyLearnings?: string; // Ajustes técnicos / aprendizados do dia
  sparringPartners?: string; // Parceiros de treino
  techniquesLearned?: string[]; // IDs or names of techniques practiced
  tags?: string[];
  createdAt: string;
}
