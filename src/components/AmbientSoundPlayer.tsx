import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Music, 
  Sliders, 
  Sparkles, 
  Wind, 
  ChevronUp, 
  ChevronDown,
  Headphones
} from 'lucide-react';
import { 
  ambientSoundEngine, 
  SOUNDSCAPE_PRESETS, 
  SoundscapePreset 
} from '../utils/ambientAudio';

export const AmbientSoundPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.45);
  const [currentPreset, setCurrentPreset] = useState<SoundscapePreset>('shakuhachi');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [visualizerLevels, setVisualizerLevels] = useState<number[]>([15, 30, 45, 60, 40, 25, 50, 35]);
  const animationFrameRef = useRef<number | null>(null);

  // Sync state with ambient engine
  const togglePlay = () => {
    if (isPlaying) {
      ambientSoundEngine.stop();
      setIsPlaying(false);
    } else {
      ambientSoundEngine.setVolume(isMuted ? 0 : volume);
      ambientSoundEngine.play(currentPreset);
      setIsPlaying(true);
    }
  };

  const handlePresetChange = (presetId: SoundscapePreset) => {
    setCurrentPreset(presetId);
    ambientSoundEngine.switchPreset(presetId);
    if (!isPlaying) {
      ambientSoundEngine.play(presetId);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isMuted) setIsMuted(false);
    ambientSoundEngine.setVolume(newVol);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      ambientSoundEngine.setVolume(volume);
    } else {
      setIsMuted(true);
      ambientSoundEngine.setVolume(0);
    }
  };

  // Realtime visualizer loop using AudioContext analyser if active
  useEffect(() => {
    if (!isPlaying) {
      setVisualizerLevels([10, 10, 10, 10, 10, 10, 10, 10]);
      return;
    }

    const updateVisualizer = () => {
      const analyser = ambientSoundEngine.getAnalyser();
      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Sample 8 frequency points for bars
        const step = Math.floor(bufferLength / 8);
        const bars: number[] = [];
        for (let i = 0; i < 8; i++) {
          const val = dataArray[i * step] || 0;
          // Scale to percentage height (minimum 15%, max 100%)
          const height = Math.max(15, Math.min(100, Math.round((val / 255) * 100)));
          bars.push(height);
        }
        setVisualizerLevels(bars);
      } else {
        // Fallback subtle procedural wave
        setVisualizerLevels(prev => 
          prev.map(() => 20 + Math.floor(Math.random() * 60))
        );
      }

      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    animationFrameRef.current = requestAnimationFrame(updateVisualizer);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const activePresetInfo = SOUNDSCAPE_PRESETS.find(p => p.id === currentPreset) || SOUNDSCAPE_PRESETS[0];

  return (
    <div id="ambient-soundscape-player" className="w-full bg-[#0a0a0f] border border-red-950/80 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Decorative ambient background gradient */}
      <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Main Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Player Identity & Current Soundscape */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            {/* Play/Pause Button */}
            <button
              id="ambient-play-toggle-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar som ambiente do Dojo' : 'Tocar som ambiente do Dojo'}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-lg ${
                isPlaying 
                  ? 'bg-gradient-to-br from-red-600 to-amber-600 text-zinc-950 shadow-red-900/40 ring-2 ring-red-500/50' 
                  : 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-red-950/70 hover:border-red-800'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Info Title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-warrior font-bold text-white tracking-wider truncate flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  Sons Tradicionais do Dojo
                </span>
                <span className="font-kanji text-[10px] text-red-400 font-bold px-1.5 py-0.5 rounded bg-red-950/80 border border-red-900/60 shrink-0">
                  {activePresetInfo.kanji}
                </span>
                {isPlaying && (
                  <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-1.5 py-0.2 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Ativo
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 truncate mt-0.5 font-medium">
                {activePresetInfo.icon} {activePresetInfo.title}
              </p>
            </div>
          </div>

          {/* Center: Live Soundwave Visualizer */}
          <div className="flex items-center gap-1 h-8 px-3 py-1 bg-zinc-950/80 rounded-xl border border-zinc-800/80 shrink-0">
            {visualizerLevels.map((height, idx) => (
              <div
                key={idx}
                className="w-1 bg-gradient-to-t from-red-600 via-amber-500 to-amber-300 rounded-full transition-all duration-100"
                style={{
                  height: isPlaying ? `${height}%` : '20%',
                  opacity: isPlaying ? 0.9 : 0.3
                }}
              />
            ))}
          </div>

          {/* Right: Volume & Preset Expand Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Volume Control */}
            <div className="flex items-center gap-2 bg-zinc-950/70 border border-zinc-800/80 px-3 py-1.5 rounded-xl">
              <button
                onClick={toggleMute}
                className="text-zinc-400 hover:text-white transition-colors"
                title={isMuted ? 'Desmutar' : 'Mutar'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-zinc-300" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-red-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              />
              <span className="text-[10px] font-mono text-zinc-400 w-7 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            {/* Expand / Presets Picker Toggle */}
            <button
              id="ambient-presets-toggle-btn"
              onClick={() => setIsExpanded(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isExpanded 
                  ? 'bg-red-950/60 border-red-800 text-red-300' 
                  : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Paisagens Sonoras</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Soundscape Selection Grid */}
        {isExpanded && (
          <div className="pt-3 border-t border-zinc-800/80 animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SOUNDSCAPE_PRESETS.map((preset) => {
              const isSelected = currentPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-gradient-to-br from-red-950/80 to-[#141118] border-red-600/70 shadow-lg shadow-red-950/30' 
                      : 'bg-zinc-950/70 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{preset.icon}</span>
                    <span className="font-kanji text-[10px] text-red-400 font-bold px-1.5 py-0.2 rounded bg-zinc-900 border border-red-950">
                      {preset.kanji}
                    </span>
                  </div>
                  <h5 className={`text-xs font-warrior font-bold ${isSelected ? 'text-amber-400' : 'text-zinc-200 group-hover:text-white'}`}>
                    {preset.title}
                  </h5>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-snug">
                    {preset.description}
                  </p>
                  {isSelected && isPlaying && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Reproduzindo Agora
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
