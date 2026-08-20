import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  User,
  X,
  RotateCcw,
  Check,
  Trash2,
  Sparkles,
  AlertCircle,
  SwitchCamera,
  Image as ImageIcon,
  Shield,
  Award,
  Zap,
  Sliders,
  Scissors
} from 'lucide-react';
import { BeltLevel } from '../types';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto: string | null;
  currentName: string;
  userBelt: BeltLevel;
  onSave: (photoDataUrl: string | null, name: string) => void;
}

type TabMode = 'camera' | 'upload' | 'presets';
type PhotoFilter = 'normal' | 'grayscale' | 'contrast' | 'sepia' | 'vintage';

const PRESET_AVATARS = [
  {
    id: 'preset-samurai',
    name: 'Espírito Samurai',
    gradient: 'from-amber-600 to-red-700',
    icon: '🥋',
    tag: 'Guerreiro'
  },
  {
    id: 'preset-lion',
    name: 'Leão do Tatame',
    gradient: 'from-amber-500 to-amber-700',
    icon: '🦁',
    tag: 'Pressão'
  },
  {
    id: 'preset-gi-master',
    name: 'Mestre do Kimono',
    gradient: 'from-blue-600 to-indigo-900',
    icon: '🥋',
    tag: 'Técnica'
  },
  {
    id: 'preset-nogi-ninja',
    name: 'No-Gi Sub Hunter',
    gradient: 'from-purple-600 to-pink-900',
    icon: '⚡',
    tag: 'Velocidade'
  },
  {
    id: 'preset-guard-player',
    name: 'Guarda Infinita',
    gradient: 'from-emerald-600 to-teal-900',
    icon: '🛡️',
    tag: 'Flexibilidade'
  },
  {
    id: 'preset-black-belt',
    name: 'Faixa Preta OSS',
    gradient: 'from-zinc-800 via-red-900 to-zinc-950',
    icon: '🏆',
    tag: 'Mestria'
  }
];

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  currentPhoto,
  currentName,
  userBelt,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('camera');
  const [name, setName] = useState(currentName || '');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(currentPhoto);
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>('normal');

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isFlashActive, setIsFlashActive] = useState(false);

  // File upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize or reset when opened
  useEffect(() => {
    if (isOpen) {
      setName(currentName || '');
      setPreviewPhoto(currentPhoto);
      setSelectedFilter('normal');
      setCameraError(null);
    } else {
      stopCamera();
    }
  }, [isOpen, currentPhoto, currentName]);

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  // Start Camera
  const startCamera = async (facing: 'user' | 'environment' = facingMode) => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Acesso à câmera não suportado neste navegador.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 480 },
          height: { ideal: 480 }
        },
        audio: false
      });

      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(e => console.error('Video play error:', e));
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      let msg = 'Não foi possível acessar a câmera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Permissão de câmera negada. Por favor, permita o acesso nas configurações do navegador ou use o upload de foto.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'Nenhuma câmera encontrada neste dispositivo.';
      }
      setCameraError(msg);
      setIsCameraActive(false);
    }
  };

  // Switch tab effect
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !previewPhoto) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, isOpen]);

  // Capture image from video stream to canvas
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    canvas.width = 400;
    canvas.height = 400;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply Filter if selected
    if (selectedFilter === 'grayscale') {
      ctx.filter = 'grayscale(100%) contrast(1.1)';
    } else if (selectedFilter === 'contrast') {
      ctx.filter = 'contrast(1.25) saturate(1.15)';
    } else if (selectedFilter === 'sepia') {
      ctx.filter = 'sepia(60%) contrast(1.05)';
    } else if (selectedFilter === 'vintage') {
      ctx.filter = 'contrast(1.15) brightness(0.95) saturate(0.8)';
    }

    // Center crop square from video
    const startX = ((video.videoWidth || 480) - size) / 2;
    const startY = ((video.videoHeight || 480) - size) / 2;

    // Flash effect
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    // If front camera, mirror horizontally for natural selfie look
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, startX, startY, size, size, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPreviewPhoto(dataUrl);
    stopCamera();
  };

  // Toggle Camera Facing
  const handleToggleFacingMode = () => {
    const newFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacing);
    startCamera(newFacing);
  };

  // Process uploaded image file
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Square cropping
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, 400, 400);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPreviewPhoto(dataUrl);
        stopCamera();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Preset Selection
  const handleSelectPreset = (preset: typeof PRESET_AVATARS[0]) => {
    // Generate an SVG data url representing the preset avatar
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#b45309" />
            <stop offset="100%" stop-color="#18181b" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#grad)" rx="80" />
        <circle cx="200" cy="200" r="140" fill="#09090b" opacity="0.8" />
        <text x="200" y="225" font-size="110" text-anchor="middle" dominant-baseline="central">${preset.icon}</text>
        <text x="200" y="340" font-size="22" font-weight="900" fill="#fbbf24" text-anchor="middle" font-family="sans-serif">${preset.name.toUpperCase()}</text>
      </svg>
    `;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    setPreviewPhoto(dataUrl);
  };

  const handleRetake = () => {
    setPreviewPhoto(null);
    if (activeTab === 'camera') {
      startCamera(facingMode);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewPhoto(null);
    stopCamera();
  };

  const handleSave = () => {
    onSave(previewPhoto, name.trim() || 'Praticante de Jiu-Jitsu');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="profile-photo-modal-card"
        className="bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full my-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Foto de Perfil do Tatame
              </h3>
              <p className="text-xs text-zinc-400">
                Capture pela câmera ou selecione uma foto para o seu perfil
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Practitioner Name Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span>Nome ou Apelido no Tatame</span>
            <span className="text-[10px] text-zinc-500">Salvo no dispositivo</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Saulo Filho, 'Cascão', 'Samurai'..."
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Method Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              if (!previewPhoto) startCamera(facingMode);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'camera'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Câmera</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('presets');
              stopCamera();
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Avatares</span>
          </button>
        </div>

        {/* MAIN DISPLAY AREA */}
        <div className="relative">
          {/* CAMERA TAB */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              {previewPhoto ? (
                /* Photo Preview & Retake */
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-amber-500/60 shadow-2xl shadow-amber-500/20 bg-zinc-950">
                    <img
                      src={previewPhoto}
                      alt="Foto de perfil capturada"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full pointer-events-none" />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 flex items-center gap-2 border border-zinc-700"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Tirar Outra</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-xs font-bold text-red-300 flex items-center gap-2 border border-red-500/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Live Camera Stream */
                <div className="space-y-3">
                  {cameraError ? (
                    <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-5 text-center space-y-3">
                      <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                      <p className="text-xs text-red-200">{cameraError}</p>
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => startCamera(facingMode)}
                          className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-xl"
                        >
                          Tentar Novamente
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('upload')}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-xs font-bold text-zinc-950 rounded-xl"
                        >
                          Usar Upload de Foto
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex flex-col items-center justify-center">
                      {/* Circular Video Container */}
                      <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden border-4 border-amber-500/80 shadow-2xl bg-zinc-950">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover ${
                            facingMode === 'user' ? 'scale-x-[-1]' : ''
                          }`}
                        />
                        {/* Target Frame Overlay */}
                        <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full pointer-events-none" />
                        
                        {/* Flash Effect */}
                        {isFlashActive && (
                          <div className="absolute inset-0 bg-white opacity-90 transition-opacity duration-150" />
                        )}
                      </div>

                      {/* Controls Bar under camera */}
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          type="button"
                          onClick={handleToggleFacingMode}
                          title="Alternar Câmera Frontal / Traseira"
                          className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-transform active:scale-90"
                        >
                          <SwitchCamera className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          id="btn-snap-profile-photo"
                          onClick={handleCapturePhoto}
                          className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95 transition-all"
                        >
                          <Camera className="w-5 h-5" />
                          <span>Capturar Foto</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* UPLOAD TAB */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileInputChange}
              />

              {previewPhoto ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-amber-500/60 shadow-2xl bg-zinc-950">
                    <img
                      src={previewPhoto}
                      alt="Foto selecionada"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 flex items-center gap-2 border border-zinc-700"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Trocar Imagem</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-xs font-bold text-red-300 flex items-center gap-2 border border-red-500/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={e => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-zinc-700 hover:border-amber-500/50 bg-zinc-950/60 hover:bg-zinc-950'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-zinc-700">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Arraste ou clique para selecionar uma foto
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Suporta imagens JPG, PNG ou WebP. Redimensionamento automático quadrado para o tatame.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* PRESETS TAB */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_AVATARS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 hover:border-amber-500/40 text-center space-y-2 transition-all group relative overflow-hidden"
                  >
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${preset.gradient} flex items-center justify-center mx-auto text-2xl shadow-lg border border-white/20 group-hover:scale-105 transition-transform`}
                    >
                      {preset.icon}
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block truncate">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold uppercase">
                        {preset.tag}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {previewPhoto && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Avatar selecionado!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <div>
            {previewPhoto && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Restaurar Padrão</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              id="btn-save-profile-photo"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Perfil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
