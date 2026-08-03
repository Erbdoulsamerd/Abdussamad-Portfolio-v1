'use client';

import { useEffect, useRef } from 'react';

type SoundState = {
  context: AudioContext | null;
  unlocked: boolean;
  enabled: boolean;
  lastHoverAt: number;
};

const interactiveSelector = 'a, button, input, select, textarea, summary, [role="button"], .btn, .ulink';

export default function SoundEffects() {
  const soundState = useRef<SoundState>({
    context: null,
    unlocked: false,
    enabled: true,
    lastHoverAt: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      soundState.current.enabled = false;
      return;
    }

    const AudioContextConstructor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;

    const ensureContext = () => {
      if (!soundState.current.context) {
        soundState.current.context = new AudioContextConstructor();
      }
      return soundState.current.context;
    };

    const playTone = (
      frequency: number,
      duration: number,
      type: OscillatorType,
      volume: number,
      attack = 0.002,
      release = 0.08,
    ) => {
      const ctx = ensureContext();
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.04, now + duration * 0.35);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + release);
    };

    const playNoiseBurst = (frequency: number, duration: number, volume: number) => {
      const ctx = ensureContext();
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const now = ctx.currentTime;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * 0.65;
      }

      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      src.buffer = buffer;
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      src.start(now);
      src.stop(now + duration);
    };

    const playArrival = () => {
      if (!soundState.current.enabled) return;
      playTone(110, 0.22, 'sine', 0.009, 0.003, 0.16);
      playTone(180, 0.24, 'triangle', 0.005, 0.002, 0.18);
      playNoiseBurst(520, 0.16, 0.002);
    };

    const playHover = () => {
      if (!soundState.current.enabled) return;
      const now = performance.now();
      if (now - soundState.current.lastHoverAt < 120) return;
      soundState.current.lastHoverAt = now;
      playTone(310, 0.06, 'triangle', 0.008, 0.001, 0.05);
      playNoiseBurst(900, 0.04, 0.001);
    };

    const playClick = () => {
      if (!soundState.current.enabled) return;
      playTone(170, 0.14, 'square', 0.01, 0.001, 0.09);
      playTone(260, 0.11, 'sine', 0.006, 0.001, 0.07);
      playNoiseBurst(650, 0.08, 0.0018);
    };

    const unlockAudio = () => {
      const ctx = ensureContext();
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      if (!soundState.current.unlocked) {
        soundState.current.unlocked = true;
        playArrival();
      }
    };

    const handlePointerStart = () => {
      unlockAudio();
    };

    const handleMouseEnter = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(interactiveSelector)) return;
      playHover();
    };

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(interactiveSelector)) return;
      playClick();
    };

    document.addEventListener('pointerdown', handlePointerStart, { passive: true });
    document.addEventListener('keydown', handlePointerStart, { passive: true });
    document.addEventListener('mouseover', handleMouseEnter, { capture: true });
    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      document.removeEventListener('pointerdown', handlePointerStart);
      document.removeEventListener('keydown', handlePointerStart);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}
