import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Clock,
  User,
  Shield,
  Layers,
  HelpCircle,
  Film,
  Maximize2,
  Flame,
  Tag,
  Share2,
  Box
} from 'lucide-react';
import { Technique, TechniqueVideo, TechniqueVideoChapter } from '../types';

interface TechniqueVideoPlayerProps {
  technique: Technique;
  onOpen3DView?: () => void;
  onOpenFocusMode?: () => void;
}

// Helper to extract clean YouTube Video ID from any URL or string
export function extractYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const clean = urlOrId.trim();
  
  // If it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }
  
  // Match youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = clean.match(regExp);
  return match ? match[1] : null;
}

const STORAGE_KEY_PREFIX = 'bjj_hub_custom_videos_';

export const TechniqueVideoPlayer: React.FC<TechniqueVideoPlayerProps> = ({
  technique,
  onOpen3DView,
  onOpenFocusMode,
}) => {
  // Local custom videos saved by user in localStorage
  const [customVideos, setCustomVideos] = useState<TechniqueVideo[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [currentChapterSeconds, setCurrentChapterSeconds] = useState<number | null>(null);
  const [isPlayingPlaceholder, setIsPlayingPlaceholder] = useState(false);
  const [placeholderProgress, setPlaceholderProgress] = useState(0);

  // New video form state
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoInstructor, setNewVideoInstructor] = useState('');
  const [newVideoNotes, setNewVideoNotes] = useState('');

  // Load custom videos from localStorage on mount or technique change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${technique.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCustomVideos(parsed);
        }
      } else {
        setCustomVideos([]);
      }
    } catch (e) {
      console.warn('Failed to load custom videos from localStorage', e);
    }
  }, [technique.id]);

  // Combined video list (default curated + user custom)
  const allVideos: TechniqueVideo[] = useMemo(() => {
    const defaults = technique.videos || [];
    // If no default videos are defined in the dataset, generate standard master demonstration placeholders
    if (defaults.length === 0) {
      const fallbackPlaceholder: TechniqueVideo = {
        id: `demo-placeholder-${technique.id}`,
        title: `Demonstração Técnica: ${technique.name}`,
        instructor: 'Mestres & Professores da Linhagem Gracie / IBJJF',
        academyOrChannel: 'Jiu-Jitsu Hub Master Archive',
        duration: '03:45',
        isPlaceholder: true,
        description: `Análise cinemática e instrução passo a passo com foco em pontos de alavanca, quebra de postura e finalização precisa partindo de ${technique.startingPosition}.`,
        chapters: [
          { timeSeconds: 0, label: '1. Pegadas & Quebra de Postura', focusPoint: 'Domínio de golas, mangas ou nuca' },
          { timeSeconds: 45, label: '2. Encaixe do Ângulo & Quadril', focusPoint: 'Alinhamento dos vetores de força e alavanca' },
          { timeSeconds: 95, label: '3. Travamento Articular / Vascular', focusPoint: 'Ajuste do fulcro sem desperdício de força' },
          { timeSeconds: 150, label: '4. Finalização Segura & Tap-Out', focusPoint: 'Pressão progressiva e controle defensivo' },
        ],
      };
      return [...customVideos, fallbackPlaceholder];
    }
    return [...customVideos, ...defaults];
  }, [technique, customVideos]);

  // Ensure active index is valid
  useEffect(() => {
    if (activeVideoIndex >= allVideos.length) {
      setActiveVideoIndex(0);
    }
  }, [allVideos.length, activeVideoIndex]);

  const activeVideo = allVideos[activeVideoIndex] || allVideos[0];
  const ytId = activeVideo?.youtubeId ? extractYouTubeId(activeVideo.youtubeId) : extractYouTubeId(activeVideo?.videoUrl);

  // Handle saving new custom video
  const handleSaveCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim()) return;

    const extractedYt = extractYouTubeId(newVideoUrl);
    const newEntry: TechniqueVideo = {
      id: `custom-vid-${Date.now()}`,
      title: newVideoTitle.trim() || `Instrucional: ${technique.name}`,
      instructor: newVideoInstructor.trim() || 'Meu Professor / Treino Pessoal',
      youtubeId: extractedYt || undefined,
      videoUrl: !extractedYt ? newVideoUrl.trim() : undefined,
      duration: 'Personalizado',
      description: newVideoNotes.trim() || 'Vídeo de instrução adicionado pelo praticante.',
      sourceType: 'custom',
      isPlaceholder: false,
      chapters: [
        { timeSeconds: 0, label: 'Início da Demonstração', focusPoint: 'Execução técnica completa' },
      ],
    };

    const updated = [newEntry, ...customVideos];
    setCustomVideos(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${technique.id}`, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save custom video', err);
    }

    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoInstructor('');
    setNewVideoNotes('');
    setIsAddModalOpen(false);
    setActiveVideoIndex(0);
  };

  // Handle removing a custom video
  const handleRemoveCustomVideo = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customVideos.filter((v) => v.id !== videoId);
    setCustomVideos(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${technique.id}`, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to remove custom video', err);
    }
  };

  // Simulated animated progress for demonstration placeholder
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingPlaceholder) {
      interval = setInterval(() => {
        setPlaceholderProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingPlaceholder(false);
            return 0;
          }
          return prev + 1.2;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlayingPlaceholder]);

  return (
    <div id="technique-video-player-container" className="space-y-6">
      {/* Video Variation Selector & Add Custom Video Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 px-2">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>Vídeos ({allVideos.length}):</span>
          </span>

          {allVideos.map((vid, idx) => (
            <button
              key={vid.id || idx}
              id={`btn-video-tab-${idx}`}
              onClick={() => {
                setActiveVideoIndex(idx);
                setCurrentChapterSeconds(null);
                setIsPlayingPlaceholder(false);
                setPlaceholderProgress(0);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeVideoIndex === idx
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-zinc-950 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <Play className={`w-3 h-3 ${activeVideoIndex === idx ? 'fill-white' : 'text-amber-400'}`} />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">{vid.title}</span>
              {vid.sourceType === 'custom' && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-300 font-mono">
                  Meu Vídeo
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Add custom video button */}
        <button
          id="btn-open-add-video-modal"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all shrink-0 ml-auto"
          title="Vincular vídeo do YouTube ou gravação própria desta técnica"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Vincular Meu Vídeo / YouTube</span>
        </button>
      </div>

      {/* Main Video Viewport / Embed / Placeholder */}
      <div className="relative rounded-3xl overflow-hidden bg-black border border-zinc-800 shadow-2xl group">
        {ytId ? (
          /* Responsive YouTube Embed */
          <div className="relative w-full pt-[56.25%] bg-black">
            <iframe
              className="absolute inset-0 w-full h-full rounded-3xl"
              src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&autoplay=0${
                currentChapterSeconds !== null ? `&start=${currentChapterSeconds}` : ''
              }`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : activeVideo?.videoUrl && activeVideo.videoUrl.endsWith('.mp4') ? (
          /* HTML5 Video Player */
          <div className="relative w-full aspect-video bg-black flex items-center justify-center">
            <video
              src={activeVideo.videoUrl}
              controls
              className="w-full h-full rounded-3xl object-contain"
              poster={activeVideo.thumbnailUrl}
            >
              Seu navegador não suporta reprodução de vídeo nativa.
            </video>
          </div>
        ) : (
          /* Interactive Demonstration Video Placeholder Card */
          <div className="relative w-full min-h-[340px] sm:min-h-[400px] p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-zinc-950 via-[#12121a] to-zinc-950">
            {/* Background Grid Pattern & Tatami Ring Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar inside Placeholder */}
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 uppercase tracking-widest flex items-center gap-1">
                    <Film className="w-3 h-3" />
                    Demonstração Técnica Dojo 4K
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold font-mono">
                    {activeVideo?.duration || '03:45'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-warrior font-black text-white tracking-tight">
                  {activeVideo?.title || technique.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instrutor: <strong className="text-zinc-200">{activeVideo?.instructor || 'Mestres da Arte Suave'}</strong></span>
                </p>
              </div>

              {activeVideo?.sourceType === 'custom' && (
                <button
                  onClick={(e) => handleRemoveCustomVideo(activeVideo.id, e)}
                  className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-colors"
                  title="Remover este vídeo personalizado"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Middle Tatami Action Simulator */}
            <div className="relative z-10 my-6 flex flex-col items-center justify-center text-center space-y-4">
              <div
                id="btn-placeholder-play"
                onClick={() => setIsPlayingPlaceholder(!isPlayingPlaceholder)}
                className="cursor-pointer group/play relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-red-600 to-amber-600 p-1 shadow-2xl shadow-red-600/40 hover:scale-105 transition-all"
              >
                <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center group-hover/play:bg-zinc-900 transition-colors">
                  {isPlayingPlaceholder ? (
                    <Pause className="w-10 h-10 text-amber-400 fill-amber-400 animate-pulse" />
                  ) : (
                    <Play className="w-10 h-10 text-white fill-white ml-1.5 group-hover/play:text-amber-400 group-hover/play:fill-amber-400 transition-colors" />
                  )}
                </div>
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 whitespace-nowrap shadow">
                  {isPlayingPlaceholder ? 'Pausar Simulação' : 'Iniciar Vídeo'}
                </span>
              </div>

              <div className="max-w-md space-y-1">
                <p className="text-xs sm:text-sm text-zinc-200 font-medium">
                  {isPlayingPlaceholder
                    ? 'Simulando análise cinemática da execução e quebra de pegadas...'
                    : 'Clique para iniciar o player simulado ou adicione o link oficial do YouTube.'}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {technique.summary}
                </p>
              </div>

              {/* Simulated playback bar */}
              {isPlayingPlaceholder && (
                <div className="w-full max-w-sm bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800 mt-2">
                  <div
                    className="bg-gradient-to-r from-red-600 to-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${placeholderProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Bottom Controls / Quick Actions inside Placeholder */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 text-xs font-bold border border-zinc-700 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Colar URL do YouTube</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {onOpen3DView && (
                  <button
                    onClick={onOpen3DView}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Ver em 3D / 360°</span>
                  </button>
                )}
                {onOpenFocusMode && (
                  <button
                    onClick={onOpenFocusMode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Modo Tatame</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Details & Interactive Chapter Timestamps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2/3): Video Info & Biomechanical Focus Notes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-zinc-900/60 rounded-2xl p-5 border border-zinc-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-red-400" />
                  <span>{activeVideo?.title}</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Instrutor: <strong className="text-amber-400">{activeVideo?.instructor}</strong>
                  {activeVideo?.academyOrChannel && ` • ${activeVideo.academyOrChannel}`}
                </p>
              </div>

              {ytId && (
                <a
                  href={`https://www.youtube.com/watch?v=${ytId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold border border-zinc-700 transition-all shrink-0"
                >
                  <span>Abrir no YouTube</span>
                  <ExternalLink className="w-3 h-3 text-red-400" />
                </a>
              )}
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-3">
              {activeVideo?.description || technique.summary}
            </p>

            {/* Quick Tactical Checklist during Video */}
            <div className="pt-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block mb-2">
                Pontos de Observação Durante o Vídeo:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-zinc-200 block">Posicionamento do Quadril</span>
                    <span className="text-[10px] text-zinc-400">Observe como o atacante cria ângulo e anula o contrapeso.</span>
                  </div>
                </div>

                <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-zinc-200 block">Distribuição do Peso</span>
                    <span className="text-[10px] text-zinc-400">Pressão constante sobre o diafragma e carótidas.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Interactive Chapter Timestamps */}
        <div className="space-y-3">
          <div className="bg-zinc-900/60 rounded-2xl p-4 sm:p-5 border border-zinc-800 space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Capítulos & Marcadores</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {(activeVideo?.chapters || []).length} Etapas
              </span>
            </h5>

            <div className="space-y-2">
              {(activeVideo?.chapters && activeVideo.chapters.length > 0 ? activeVideo.chapters : [
                { timeSeconds: 0, label: '1. Pegadas e Postura Inicial' },
                { timeSeconds: 30, label: '2. Quebra e Desequilíbrio (Kuzushi)' },
                { timeSeconds: 75, label: '3. Encaixe do Golpe' },
                { timeSeconds: 120, label: '4. Finalização e Segurança' },
              ]).map((chap, idx) => {
                const mins = Math.floor(chap.timeSeconds / 60);
                const secs = chap.timeSeconds % 60;
                const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                const isActive = currentChapterSeconds === chap.timeSeconds;

                return (
                  <button
                    key={idx}
                    id={`btn-chapter-${idx}`}
                    onClick={() => {
                      setCurrentChapterSeconds(chap.timeSeconds);
                      if (!isPlayingPlaceholder) {
                        setIsPlayingPlaceholder(true);
                      }
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-500/50 text-white'
                        : 'bg-zinc-950/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-400 shrink-0">
                      {timeFormatted}
                    </span>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold block truncate">{chap.label}</span>
                      {chap.focusPoint && (
                        <span className="text-[10px] text-zinc-400 block truncate">{chap.focusPoint}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tap-out / Safety reminder */}
            <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-900/40 text-[11px] text-red-200/90 flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <span>
                <strong>Segurança no Tatame:</strong> Pratique os movimentos em velocidade controlada e solte a pressão no primeiro sinal de tap-out do colega.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Video Modal */}
      {isAddModalOpen && (
        <div
          id="modal-add-video"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">Vincular Vídeo à Técnica</h4>
                  <p className="text-xs text-zinc-400">{technique.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Link do Vídeo (YouTube ou MP4) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: https://www.youtube.com/watch?v=... ou dQw4w9WgXcQ"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  Aceita links diretos do YouTube, shorts, links compartilhados ou URLs de vídeo.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Título da Demonstração
                  </label>
                  <input
                    type="text"
                    placeholder={`Ex: Detalhes de ${technique.name}`}
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Instrutor / Canal
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Prof. Mestre / Canal BJJ"
                    value={newVideoInstructor}
                    onChange={(e) => setNewVideoInstructor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Notas Pessoais & Ajustes do Treino
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Prestar atenção no giro do quadril aos 01:20 e no detalhe da pegada de gancho..."
                  value={newVideoNotes}
                  onChange={(e) => setNewVideoNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-all shadow-md shadow-amber-500/20"
                >
                  Salvar Vídeo no Meu Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
