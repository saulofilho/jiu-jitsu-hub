// Japanese Traditional Ambient Soundscape Engine using Web Audio API
// Synthesizes Shakuhachi flute, wind sweeps, temple bells (suikinkutsu/rin gong), and taiko pulses

export type SoundscapePreset = 'shakuhachi' | 'wind_temple' | 'zen_garden' | 'dojo_taiko';

export interface SoundscapeInfo {
  id: SoundscapePreset;
  title: string;
  kanji: string;
  description: string;
  icon: string;
}

export const SOUNDSCAPE_PRESETS: SoundscapeInfo[] = [
  {
    id: 'shakuhachi',
    title: 'Flauta Shakuhachi & Vento na Montanha',
    kanji: '尺八の風',
    description: 'Frases melódicas na escala Insen tradicional com sopro de bambu e brisa leve.',
    icon: '🎋',
  },
  {
    id: 'wind_temple',
    title: 'Sinos do Templo & Suikinkutsu',
    kanji: '寺院の鐘',
    description: 'Ressonâncias metálicas de tigela tibetana e carrilhões ao sopro do vento.',
    icon: '🔔',
  },
  {
    id: 'zen_garden',
    title: 'Jardim Zen do Dojo & Brisa Suave',
    kanji: '枯山水',
    description: 'Atmosfera calma de meditação silenciosa com ressonância profunda e paz interior.',
    icon: '🍃',
  },
  {
    id: 'dojo_taiko',
    title: 'Foco Bushido & Pulso Taiko',
    kanji: '武士道',
    description: 'Batimento rítmico suave de tambor ancestral e zumbido harmônico de concentração.',
    icon: '🥋',
  },
];

// Insen Scale frequencies (D4, Eb4, G4, A4, C5, D5, Eb5)
const INSEN_NOTES = [293.66, 311.13, 392.0, 440.0, 523.25, 587.33, 622.25];
const BELL_NOTES = [587.33, 880.0, 1174.66, 1318.5, 1760.0];

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.45;
  private currentPreset: SoundscapePreset = 'shakuhachi';

  // Nodes for continuous ambient generators
  private windSource: AudioNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;

  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  private activeTimers: number[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getPreset(): SoundscapePreset {
    return this.currentPreset;
  }

  // Create pink/brown noise buffer for natural wind
  private createWindNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * 4; // 4 second loop
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // Start continuous ambient bed (wind + drone)
  private startAmbientBed() {
    if (!this.ctx || !this.masterGain) return;

    // 1. Wind noise generator
    try {
      const noiseBuffer = this.createWindNoiseBuffer();
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noiseSource.start();
      this.windSource = noiseSource;
      this.windFilter = filter;
      this.windGain = gain;

      // Slow wind modulation loop
      const modulateWind = () => {
        if (!this.isPlaying || !this.ctx || !this.windFilter || !this.windGain) return;
        const now = this.ctx.currentTime;
        const targetFreq = 180 + Math.random() * 400; // 180Hz to 580Hz
        const targetGain = 0.12 + Math.random() * 0.16;
        const duration = 3 + Math.random() * 4;

        this.windFilter.frequency.setTargetAtTime(targetFreq, now, duration * 0.5);
        this.windGain.gain.setTargetAtTime(targetGain, now, duration * 0.5);

        const timer = window.setTimeout(modulateWind, duration * 1000);
        this.activeTimers.push(timer);
      };
      modulateWind();
    } catch (e) {
      console.warn('Wind synthesis notice:', e);
    }

    // 2. Deep warm singing bowl / tanpura drone
    try {
      const drone = this.ctx.createOscillator();
      drone.type = 'sine';
      drone.frequency.setValueAtTime(146.83, this.ctx.currentTime); // D3 fundamental

      // Sub harmonic
      const subDrone = this.ctx.createOscillator();
      subDrone.type = 'triangle';
      subDrone.frequency.setValueAtTime(73.41, this.ctx.currentTime); // D2

      const droneGainNode = this.ctx.createGain();
      droneGainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);

      drone.connect(droneGainNode);
      subDrone.connect(droneGainNode);
      droneGainNode.connect(this.masterGain);

      drone.start();
      subDrone.start();
      this.droneOsc = drone;
      this.droneGain = droneGainNode;
    } catch (e) {
      console.warn('Drone notice:', e);
    }
  }

  // Play a realistic Shakuhachi bamboo flute phrase (Insen scale)
  private playShakuhachiNote(freq: number, duration: number = 3.5) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Primary flute oscillator (sine + slight triangle blend)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Pitch vibrato (LFO)
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.setValueAtTime(4.8, now); // ~5Hz traditional flute vibrato
      vibratoGain.gain.setValueAtTime(0, now);
      // Fade in vibrato slowly after breath attack
      vibratoGain.gain.setValueAtTime(0, now + 0.4);
      vibratoGain.gain.linearRampToValueAtTime(freq * 0.015, now + 1.2);

      vibrato.connect(osc1.frequency);
      vibrato.start(now);
      vibrato.stop(now + duration);

      // 2. Breath noise component (Muraiki flute breath)
      const breathBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
      const bData = breathBuffer.getChannelData(0);
      for (let i = 0; i < bData.length; i++) {
        bData[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const breathSource = this.ctx.createBufferSource();
      breathSource.buffer = breathBuffer;

      const breathFilter = this.ctx.createBiquadFilter();
      breathFilter.type = 'bandpass';
      breathFilter.frequency.setValueAtTime(freq * 2, now);
      breathFilter.Q.setValueAtTime(3.0, now);

      const breathGain = this.ctx.createGain();
      breathGain.gain.setValueAtTime(0.01, now);
      breathGain.gain.linearRampToValueAtTime(0.09, now + 0.2);
      breathGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      breathSource.connect(breathFilter);
      breathFilter.connect(breathGain);

      // 3. Note envelope gain
      const noteGain = this.ctx.createGain();
      noteGain.gain.setValueAtTime(0.0001, now);
      // Soft organic attack
      noteGain.gain.linearRampToValueAtTime(0.18, now + 0.35);
      // Sustain
      noteGain.gain.setValueAtTime(0.16, now + duration * 0.6);
      // Gentle breath tail release
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(noteGain);
      breathGain.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc1.start(now);
      breathSource.start(now);

      osc1.stop(now + duration + 0.1);
      breathSource.stop(now + duration + 0.1);
    } catch (e) {
      console.warn('Flute sound error:', e);
    }
  }

  // Play a resonant temple bell / singing bowl chime (Rin Gong)
  private playTempleBell(freq: number = 880, decayTime: number = 4.0) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Overtone 2
      const overtone = this.ctx.createOscillator();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2.76, now); // Inharmonic metallic strike

      const strikeGain = this.ctx.createGain();
      strikeGain.gain.setValueAtTime(0.16, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      const overtoneGain = this.ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.06, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + (decayTime * 0.4));

      osc.connect(strikeGain);
      overtone.connect(overtoneGain);

      strikeGain.connect(this.masterGain);
      overtoneGain.connect(this.masterGain);

      osc.start(now);
      overtone.start(now);

      osc.stop(now + decayTime);
      overtone.stop(now + decayTime);
    } catch (e) {
      console.warn('Bell sound error:', e);
    }
  }

  // Play a soft Taiko drum beat
  private playTaikoBeat() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch (e) {
      console.warn('Taiko error:', e);
    }
  }

  // Scheduling loops based on selected preset
  private scheduleNextEvent() {
    if (!this.isPlaying) return;

    let delayMs = 3500;

    if (this.currentPreset === 'shakuhachi') {
      // Pick random Insen note
      const randomNote = INSEN_NOTES[Math.floor(Math.random() * INSEN_NOTES.length)];
      const duration = 2.8 + Math.random() * 2.0;
      this.playShakuhachiNote(randomNote, duration);

      // Occasionally trigger a soft distant bell
      if (Math.random() > 0.6) {
        window.setTimeout(() => {
          if (this.isPlaying) {
            const bell = BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)];
            this.playTempleBell(bell, 5.0);
          }
        }, 1200);
      }

      delayMs = 3800 + Math.random() * 3200;
    } else if (this.currentPreset === 'wind_temple') {
      const bell = BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)];
      this.playTempleBell(bell, 5.5 + Math.random() * 2);
      delayMs = 2800 + Math.random() * 3000;
    } else if (this.currentPreset === 'zen_garden') {
      if (Math.random() > 0.4) {
        const note = INSEN_NOTES[Math.floor(Math.random() * 3)];
        this.playShakuhachiNote(note, 4.0);
      } else {
        this.playTempleBell(440, 6.0);
      }
      delayMs = 4500 + Math.random() * 3500;
    } else if (this.currentPreset === 'dojo_taiko') {
      this.playTaikoBeat();
      if (Math.random() > 0.5) {
        window.setTimeout(() => {
          if (this.isPlaying) this.playTaikoBeat();
        }, 380);
      }
      delayMs = 2400 + Math.random() * 1800;
    }

    const timer = window.setTimeout(() => {
      this.scheduleNextEvent();
    }, delayMs);

    this.activeTimers.push(timer);
  }

  public play(preset?: SoundscapePreset) {
    this.initContext();
    if (preset) {
      this.currentPreset = preset;
    }
    this.stop(); // Clear existing loops

    this.isPlaying = true;
    this.startAmbientBed();
    this.scheduleNextEvent();
  }

  public stop() {
    this.isPlaying = false;
    this.activeTimers.forEach((t) => window.clearTimeout(t));
    this.activeTimers = [];

    if (this.windSource) {
      try {
        (this.windSource as AudioBufferSourceNode).stop();
        this.windSource.disconnect();
      } catch {
        // Ignored
      }
      this.windSource = null;
    }

    if (this.droneOsc) {
      try {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
      } catch {
        // Ignored
      }
      this.droneOsc = null;
    }
  }

  public switchPreset(preset: SoundscapePreset) {
    this.currentPreset = preset;
    if (this.isPlaying) {
      this.play(preset);
    }
  }
}

export const ambientSoundEngine = new AmbientSoundEngine();
