import { useCallback, useRef } from 'react';

// Create audio context lazily to avoid autoplay restrictions
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const useSoundEffects = () => {
  const lastPlayTime = useRef<Record<string, number>>({});

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3,
    delay: number = 0
  ) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);

      oscillator.start(ctx.currentTime + delay);
      oscillator.stop(ctx.currentTime + delay + duration);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }, []);

  const playRollSound = useCallback(() => {
    // Quick click sound for normal rolls
    playTone(800, 0.05, 'square', 0.15);
    playTone(1200, 0.03, 'sine', 0.1, 0.02);
  }, [playTone]);

  const playSuperRollSound = useCallback(() => {
    // Epic ascending arpeggio for super rolls
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      playTone(freq, 0.2, 'sine', 0.25, i * 0.08);
      playTone(freq * 1.5, 0.15, 'triangle', 0.1, i * 0.08);
    });
  }, [playTone]);

  const playAchievementSound = useCallback(() => {
    // Victorious fanfare for achievements
    const fanfare = [
      { freq: 523, delay: 0, duration: 0.15 },
      { freq: 659, delay: 0.12, duration: 0.15 },
      { freq: 784, delay: 0.24, duration: 0.15 },
      { freq: 1047, delay: 0.36, duration: 0.4 },
    ];
    
    fanfare.forEach(({ freq, delay, duration }) => {
      playTone(freq, duration, 'sine', 0.3, delay);
      playTone(freq * 2, duration * 0.7, 'triangle', 0.15, delay);
    });
    
    // Add sparkle effect
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        playTone(2000 + Math.random() * 1000, 0.1, 'sine', 0.1, i * 0.05);
      }
    }, 400);
  }, [playTone]);

  const playHighScoreSound = useCallback(() => {
    // Celebratory sound for new high score
    playTone(440, 0.1, 'sine', 0.3);
    playTone(554, 0.1, 'sine', 0.3, 0.1);
    playTone(659, 0.2, 'sine', 0.35, 0.2);
  }, [playTone]);

  const playPrestigeSound = useCallback(() => {
    // Deep, powerful sound for prestige
    playTone(110, 0.5, 'sawtooth', 0.2);
    playTone(220, 0.4, 'sine', 0.25, 0.1);
    playTone(440, 0.3, 'sine', 0.3, 0.2);
    playTone(880, 0.5, 'sine', 0.35, 0.3);
    
    // Void shimmer
    for (let i = 0; i < 8; i++) {
      playTone(1500 + i * 200, 0.15, 'sine', 0.08, 0.4 + i * 0.05);
    }
  }, [playTone]);

  const playPurchaseSound = useCallback(() => {
    // Cash register style cha-ching
    playTone(1200, 0.08, 'square', 0.15);
    playTone(1600, 0.12, 'sine', 0.2, 0.08);
  }, [playTone]);

  return {
    playRollSound,
    playSuperRollSound,
    playAchievementSound,
    playHighScoreSound,
    playPrestigeSound,
    playPurchaseSound,
  };
};
