import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Flame,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Shield,
  Tag,
  ChevronDown,
  ChevronUp,
  Share2,
  Download,
  Copy,
  Check,
  Dumbbell,
  Smile,
  Frown,
  Meh,
  Zap,
  Target,
  Users,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { TrainingDiaryEntry, TrainingMood, Modality, BeltLevel } from '../types';
import { TECHNIQUES } from '../data/techniques';
import { recordDailyCheckIn } from '../utils/streakTracker';

interface TrainingDiaryProps {
  userBelt?: BeltLevel;
  trainedMoves?: string[];
  onMarkTrained?: (techniqueId: string) => void;
  onNavigateToTechniques?: () => void;
}

const STORAGE_KEY = 'bjj_training_diary_entries';

const INITIAL_DEMO_ENTRIES: TrainingDiaryEntry[] = [
  {
    id: 'diary-demo-1',
    date: new Date().toISOString().split('T')[0],
    title: 'Passagem Knee Cut & Ajuste de Esgrima',
    modality: 'gi',
    durationMinutes: 90,
    rollsCount: 5,
    mood: 'bom',
    whatTrained: 'Trabalhamos sequências de passagem de meia guarda para a montada focando no Knee Cut (corte de joelho). No rola livre, foquei em manter a base pesada sem dar espaço para a reposição de guarda-gancho.',
    difficulties: 'Perdi a esgrima duas vezes quando o adversário usou a meia guarda profunda e tentou subir nas minhas costas. Preciso abaixar mais o quadril e travar a cabeça dele antes de avançar o joelho.',
    keyLearnings: 'O professor me orientou a nunca entrar com o joelho no tatame sem estar com a mão na gola bem firme controlando a cabeça.',
    sparringPartners: 'Bruno (Faixa Azul), Carlos (Faixa Branca 4 graus)',
    techniquesLearned: ['passagem-knee-cut', 'armlock-guarda-fechada'],
    tags: ['Meia Guarda', 'Knee Cut', 'Esgrima', 'Passagem'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'diary-demo-2',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    title: 'Treino Sem Kimono (No-Gi) & Single Leg',
    modality: 'nogi',
    durationMinutes: 75,
    rollsCount: 6,
    mood: 'desafiador',
    whatTrained: 'Aquecimento com entradas de queda (Single Leg e Double Leg). Na parte técnica, finalizações na guilhotina partindo do sprawl e contra-ataques de defesa de queda.',
    difficulties: 'Muita dificuldade no suor sem o pano para segurar a pegada na guilhotina e senti o gás pesado no 4º rola consecutivo.',
    keyLearnings: 'No No-Gi, o ajuste da guilhotina precisa fechar a axila antes de tracionar o quadril, sem depender de pegadas frouxas.',
    sparringPartners: 'Lucas (Faixa Roxa), Rafael (Faixa Azul)',
    techniquesLearned: ['single-leg', 'guilhotina-fechada'],
    tags: ['No-Gi', 'Guilhotina', 'Quedas', 'Wrestling'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

const MOOD_CONFIG: Record<TrainingMood, { label: string; icon: any; color: string; bg: string; border: string }> = {
  excelente: { label: 'Excelente (Fluxo Alto)', icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-400/40' },
  bom: { label: 'Bom (Evolução Clara)', icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  normal: { label: 'Normal (Rotina Mantida)', icon: Meh, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  desafiador: { label: 'Desafiador (Pressão Forte)', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  exaustivo: { label: 'Exaustivo (Superação)', icon: Flame, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' }
};

export const TrainingDiary: React.FC<TrainingDiaryProps> = ({
  userBelt = 'branca',
  trainedMoves = [],
  onMarkTrained,
  onNavigateToTechniques
}) => {
  const [entries, setEntries] = useState<TrainingDiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading diary entries:', e);
    }
    return INITIAL_DEMO_ENTRIES;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Form States
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formTitle, setFormTitle] = useState('');
  const [formModality, setFormModality] = useState<Modality>('gi');
  const [formDuration, setFormDuration] = useState<number>(90);
  const [formRolls, setFormRolls] = useState<number>(5);
  const [formMood, setFormMood] = useState<TrainingMood>('bom');
  const [formWhatTrained, setFormWhatTrained] = useState('');
  const [formDifficulties, setFormDifficulties] = useState('');
  const [formKeyLearnings, setFormKeyLearnings] = useState('');
  const [formPartners, setFormPartners] = useState('');
  const [formSelectedTechniques, setFormSelectedTechniques] = useState<string[]>([]);
  const [formTagInput, setFormTagInput] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModality, setFilterModality] = useState<string>('todas');
  const [filterMood, setFilterMood] = useState<string>('todas');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);

  // Save to LocalStorage whenever entries change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to persist diary entries to localStorage:', e);
    }
  }, [entries]);

  // Handle Form Open (New or Edit)
  const openNewForm = () => {
    setEditingEntryId(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTitle('');
    setFormModality('gi');
    setFormDuration(90);
    setFormRolls(5);
    setFormMood('bom');
    setFormWhatTrained('');
    setFormDifficulties('');
    setFormKeyLearnings('');
    setFormPartners('');
    setFormSelectedTechniques([]);
    setFormTags([]);
    setIsFormOpen(true);
  };

  const openEditForm = (entry: TrainingDiaryEntry) => {
    setEditingEntryId(entry.id);
    setFormDate(entry.date);
    setFormTitle(entry.title);
    setFormModality(entry.modality);
    setFormDuration(entry.durationMinutes);
    setFormRolls(entry.rollsCount);
    setFormMood(entry.mood);
    setFormWhatTrained(entry.whatTrained);
    setFormDifficulties(entry.difficulties);
    setFormKeyLearnings(entry.keyLearnings || '');
    setFormPartners(entry.sparringPartners || '');
    setFormSelectedTechniques(entry.techniquesLearned || []);
    setFormTags(entry.tags || []);
    setIsFormOpen(true);
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (formTagInput.trim()) {
      const formatted = formTagInput.trim().replace(/^#/, '');
      if (!formTags.includes(formatted)) {
        setFormTags([...formTags, formatted]);
      }
      setFormTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormTags(formTags.filter(t => t !== tagToRemove));
  };

  const toggleTechniqueInForm = (techId: string) => {
    if (formSelectedTechniques.includes(techId)) {
      setFormSelectedTechniques(formSelectedTechniques.filter(id => id !== techId));
    } else {
      setFormSelectedTechniques([...formSelectedTechniques, techId]);
    }
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWhatTrained.trim()) return;

    const titleToUse = formTitle.trim() || `Treino de Jiu-Jitsu (${formModality === 'nogi' ? 'No-Gi' : 'Com Kimono'})`;

    if (editingEntryId) {
      // Edit existing
      setEntries(prev =>
        prev.map(item => {
          if (item.id === editingEntryId) {
            return {
              ...item,
              date: formDate,
              title: titleToUse,
              modality: formModality,
              durationMinutes: formDuration,
              rollsCount: formRolls,
              mood: formMood,
              whatTrained: formWhatTrained.trim(),
              difficulties: formDifficulties.trim(),
              keyLearnings: formKeyLearnings.trim(),
              sparringPartners: formPartners.trim(),
              techniquesLearned: formSelectedTechniques,
              tags: formTags
            };
          }
          return item;
        })
      );
    } else {
      // Create new
      const newEntry: TrainingDiaryEntry = {
        id: `diary-${Date.now()}`,
        date: formDate,
        title: titleToUse,
        modality: formModality,
        durationMinutes: formDuration,
        rollsCount: formRolls,
        mood: formMood,
        whatTrained: formWhatTrained.trim(),
        difficulties: formDifficulties.trim(),
        keyLearnings: formKeyLearnings.trim(),
        sparringPartners: formPartners.trim(),
        techniquesLearned: formSelectedTechniques,
        tags: formTags,
        createdAt: new Date().toISOString()
      };

      setEntries(prev => [newEntry, ...prev]);

      // Automatically register daily streak check-in on adding a training note
      recordDailyCheckIn();

      // Automatically mark selected techniques as trained if callback provided
      if (onMarkTrained && formSelectedTechniques.length > 0) {
        formSelectedTechniques.forEach(id => {
          if (!trainedMoves.includes(id)) {
            onMarkTrained(id);
          }
        });
      }
    }

    setIsFormOpen(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    setShowDeleteConfirmId(null);
  };

  const handleCopySummary = (entry: TrainingDiaryEntry) => {
    const text = `🥋 Diário de Treino BJJ - ${entry.date}\n` +
      `📌 ${entry.title} (${entry.modality === 'nogi' ? 'Sem Kimono' : 'Com Kimono'})\n` +
      `⏱️ Duração: ${entry.durationMinutes} min | 🔄 Rolas: ${entry.rollsCount} rounds\n` +
      `\n🥋 O que treinei:\n${entry.whatTrained}\n` +
      `\n⚠️ Dificuldades encontradas:\n${entry.difficulties || 'Nenhuma registrada.'}\n` +
      (entry.keyLearnings ? `\n💡 Ajustes/Lições:\n${entry.keyLearnings}\n` : '') +
      `\n📱 Registrado no Jiu-Jitsu Hub`;

    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bjj-diario-treinos-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesModality = filterModality === 'todas' || entry.modality === filterModality;
      const matchesMood = filterMood === 'todas' || entry.mood === filterMood;
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        entry.title.toLowerCase().includes(query) ||
        entry.whatTrained.toLowerCase().includes(query) ||
        entry.difficulties.toLowerCase().includes(query) ||
        (entry.keyLearnings && entry.keyLearnings.toLowerCase().includes(query)) ||
        (entry.sparringPartners && entry.sparringPartners.toLowerCase().includes(query)) ||
        (entry.tags && entry.tags.some(t => t.toLowerCase().includes(query)));

      return matchesModality && matchesMood && matchesSearch;
    });
  }, [entries, filterModality, filterMood, searchQuery]);

  // Summary statistics
  const totalMinutes = useMemo(() => entries.reduce((acc, e) => acc + (e.durationMinutes || 0), 0), [entries]);
  const totalRolls = useMemo(() => entries.reduce((acc, e) => acc + (e.rollsCount || 0), 0), [entries]);
  const recordedDifficultiesCount = useMemo(() => entries.filter(e => e.difficulties && e.difficulties.trim().length > 0).length, [entries]);

  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return dateObj.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  return (
    <div id="training-diary-page" className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                Caderno de Bordo do Tatame
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Diário de Treino & Anotações
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Registre notas rápidas sobre o que treinou no dia, detalhes de posições, ajustes dos professores e as principais dificuldades encontradas nos rolas.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="btn-export-diary"
              onClick={handleExportJSON}
              title="Exportar notas em formato JSON para backup"
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar Backup</span>
            </button>

            <button
              id="btn-new-diary-entry"
              onClick={openNewForm}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Anotar Treino do Dia</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-zinc-800/80">
          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Treinos Registrados
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black font-mono text-white">{entries.length}</span>
              <span className="text-xs text-zinc-500">sessões</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Tempo de Tatame
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black font-mono text-amber-400">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Rounds de Rola
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black font-mono text-emerald-400">{totalRolls}</span>
              <span className="text-xs text-zinc-500">combates</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Dificuldades Mapeadas
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black font-mono text-purple-400">{recordedDifficultiesCount}</span>
              <span className="text-xs text-zinc-500">pontos-chave</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / DRAWER FORM FOR NEW/EDIT ENTRY */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingEntryId ? 'Editar Anotação de Treino' : 'Novo Registro de Treino'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Preencha o que foi passado no tatame e onde você sentiu maior dificuldade.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4 sm:space-y-5">
              {/* Row 1: Date & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Data do Treino
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Título / Foco Principal
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Treino de Passagem Knee Cut & Defesa de Meia"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 2: Modality, Duration, Rolls, Mood */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Modalidade
                  </label>
                  <select
                    value={formModality}
                    onChange={e => setFormModality(e.target.value as Modality)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="gi">🥋 Com Kimono (Gi)</option>
                    <option value="nogi">🩳 Sem Kimono (No-Gi)</option>
                    <option value="ambos">⚡ Ambos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Duração (min)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    step="5"
                    value={formDuration}
                    onChange={e => setFormDuration(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Rounds de Rola
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={formRolls}
                    onChange={e => setFormRolls(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Sensação / Rendimento
                  </label>
                  <select
                    value={formMood}
                    onChange={e => setFormMood(e.target.value as TrainingMood)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="excelente">✨ Excelente</option>
                    <option value="bom">😊 Bom</option>
                    <option value="normal">😐 Normal</option>
                    <option value="desafiador">⚡ Desafiador</option>
                    <option value="exaustivo">🔥 Exaustivo</option>
                  </select>
                </div>
              </div>

              {/* Row 3: What Trained (Required) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>O que você treinou hoje? (Técnicas, Drills, Posições) *</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 lowercase">obrigatório</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Treinamos passagem de guarda toureando conectando com o joelho na barriga. No rola, consegui raspar da guarda fechada mas cansei no final..."
                  value={formWhatTrained}
                  onChange={e => setFormWhatTrained(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Row 4: Difficulties Found (Highlighted) */}
              <div className="space-y-1.5 bg-amber-500/5 p-3.5 rounded-2xl border border-amber-500/20">
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quais dificuldades encontrou? (Travamentos, falhas, defesas difíceis)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Tive dificuldade para manter a esgrima quando o adversário pesou o quadril; tomei pressão na guarda e não consegui sair o quadril no tempo certo..."
                  value={formDifficulties}
                  onChange={e => setFormDifficulties(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Row 5: Key Learnings / Tips */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Ajustes & Aprendizados para a Próxima (Opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: O professor avisou para manter a cabeça colada no peito antes de tentar o triângulo..."
                  value={formKeyLearnings}
                  onChange={e => setFormKeyLearnings(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Row 6: Quick Technique Linker & Sparring Partners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>Parceiros de Rola</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Pedro (Faixa Roxa), Marcelo..."
                    value={formPartners}
                    onChange={e => setFormPartners(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tags & Palavras-chave</span>
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Ex: Meia Guarda, Armlock"
                      value={formTagInput}
                      onChange={e => setFormTagInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag(e);
                        }
                      }}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl text-zinc-200"
                    >
                      +
                    </button>
                  </div>
                  {/* Tag Pills */}
                  {formTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formTags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full flex items-center gap-1 border border-zinc-700"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-zinc-500 hover:text-red-400 ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Technique Selector from Encyclopedia */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Vincular Técnicas da Enciclopédia ({formSelectedTechniques.length} selecionadas):
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                  {TECHNIQUES.slice(0, 16).map(tech => {
                    const isSelected = formSelectedTechniques.includes(tech.id);
                    return (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => toggleTechniqueInForm(tech.id)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg transition-all border ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-sm'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tech.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/20"
                >
                  {editingEntryId ? 'Salvar Alterações' : 'Salvar no Diário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH CONTROLS */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar nas anotações (ex: esgrima, knee cut, guilhotina, cansaço)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Filter Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Modality Filter */}
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setFilterModality('todas')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filterModality === 'todas' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterModality('gi')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filterModality === 'gi' ? 'bg-amber-500 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Gi (Com Pano)
              </button>
              <button
                onClick={() => setFilterModality('nogi')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filterModality === 'nogi' ? 'bg-amber-500 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                No-Gi (Sem Pano)
              </button>
            </div>

            {/* Mood filter */}
            <select
              value={filterMood}
              onChange={e => setFilterMood(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="todas">Todos os Rendimentos</option>
              <option value="excelente">✨ Excelente</option>
              <option value="bom">😊 Bom</option>
              <option value="normal">😐 Normal</option>
              <option value="desafiador">⚡ Desafiador</option>
              <option value="exaustivo">🔥 Exaustivo</option>
            </select>
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800/80 pt-3">
          <span>
            Exibindo <strong className="text-zinc-300">{filteredEntries.length}</strong> de{' '}
            <strong className="text-zinc-300">{entries.length}</strong> anotações
          </span>
          {entries.length === 0 && (
            <span className="text-amber-400">Nenhum registro ainda. Clique em "Anotar Treino do Dia" acima!</span>
          )}
        </div>
      </div>

      {/* DIARY TIMELINE / ENTRIES LIST */}
      {filteredEntries.length === 0 ? (
        <div className="p-12 text-center bg-zinc-900/40 border border-zinc-800/80 rounded-3xl space-y-4">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-300">Nenhum registro encontrado</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Tente alterar os filtros de busca ou crie sua primeira anotação detalhando o que praticou no tatame.
            </p>
          </div>
          <button
            onClick={openNewForm}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
          >
            + Anotar Novo Treino
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map(entry => {
            const mood = MOOD_CONFIG[entry.mood];
            const MoodIcon = mood.icon;

            return (
              <div
                key={entry.id}
                id={`diary-card-${entry.id}`}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-6 sm:p-7 space-y-5 transition-all shadow-xl hover:shadow-2xl relative overflow-hidden group"
              >
                {/* Header Row: Date, Title, Modality, Mood */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-zinc-800/80 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateDisplay(entry.date)}
                      </span>

                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                          entry.modality === 'nogi'
                            ? 'bg-purple-950/40 text-purple-300 border-purple-500/40'
                            : entry.modality === 'ambos'
                            ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                            : 'bg-blue-950/40 text-blue-300 border-blue-500/40'
                        }`}
                      >
                        {entry.modality === 'nogi' ? '🩳 No-Gi (Sem Kimono)' : entry.modality === 'ambos' ? '⚡ Ambos' : '🥋 Gi (Com Kimono)'}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${mood.bg} ${mood.color} ${mood.border}`}
                      >
                        <MoodIcon className="w-3 h-3" />
                        <span>{mood.label}</span>
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight pt-1">
                      {entry.title}
                    </h3>
                  </div>

                  {/* Actions (Copy, Edit, Delete) */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleCopySummary(entry)}
                      title="Copiar resumo do treino para compartilhar"
                      className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
                    >
                      {copiedId === entry.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => openEditForm(entry)}
                      title="Editar esta anotação"
                      className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-blue-400 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirmId(entry.id)}
                      title="Excluir anotação"
                      className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Banner */}
                {showDeleteConfirmId === entry.id && (
                  <div className="bg-red-950/40 border border-red-500/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2 text-xs text-red-300">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Tem certeza que deseja excluir esta anotação de treino permanentemente?</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setShowDeleteConfirmId(null)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )}

                {/* BODY CONTENT: What Trained & Difficulties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Box: What Trained */}
                  <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>O que Treinou no Dia</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                      {entry.whatTrained}
                    </p>
                  </div>

                  {/* Right Box: Difficulties Found */}
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Dificuldades Encontradas & Travamentos</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                      {entry.difficulties || 'Nenhuma dificuldade registrada para esta sessão.'}
                    </p>
                  </div>
                </div>

                {/* KEY LEARNINGS (IF ANY) */}
                {entry.keyLearnings && (
                  <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-4 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                        Ajuste Técnico & Lição do Professor
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {entry.keyLearnings}
                      </p>
                    </div>
                  </div>
                )}

                {/* FOOTER METRICS & TAGS */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800/80 text-xs">
                  {/* Left: Duration & Rolls */}
                  <div className="flex items-center gap-4 text-zinc-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{entry.durationMinutes} minutos</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Dumbbell className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{entry.rollsCount} rounds de rola</span>
                    </span>
                    {entry.sparringPartners && (
                      <span className="hidden lg:flex items-center gap-1.5 text-zinc-400">
                        <Users className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="truncate max-w-xs">{entry.sparringPartners}</span>
                      </span>
                    )}
                  </div>

                  {/* Right: Techniques & Tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {entry.tags && entry.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-950 text-zinc-400 border border-zinc-800"
                      >
                        #{tag}
                      </span>
                    ))}
                    {entry.techniquesLearned && entry.techniquesLearned.map(techId => {
                      const tech = TECHNIQUES.find(t => t.id === techId);
                      return (
                        <span
                          key={techId}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1"
                        >
                          <Target className="w-3 h-3" />
                          <span>{tech ? tech.name : techId}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
