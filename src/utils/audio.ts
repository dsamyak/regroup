// @ts-ignore
import audioMapRaw from './audioMap.js';
export let currentAudio: HTMLAudioElement | null = null;

const audioMap: Record<string, string> = audioMapRaw || {};

export function stopNarration() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

let audioCtx: AudioContext | null = null;
export function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
}

export function initAudioEngine() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  // Play a silent audio to unlock HTML5 Audio element autoplay
  const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
  silentAudio.play().catch(() => {});
}

export async function getAudioUrl(text: string, _style: string = 'statement'): Promise<string> {
  if (audioMap[text]) {
    return audioMap[text];
  }
  console.warn(`No pre-generated audio found for: "${text}"`);
  return '';
}

export async function speak(text: string, style: string = 'statement'): Promise<void> {
  stopNarration();
  const url = await getAudioUrl(text, style);
  if (!url) return;

  return new Promise((resolve) => {
    currentAudio = new Audio(url);
    currentAudio.onended = () => resolve();
    currentAudio.onerror = () => resolve();
    currentAudio.play().catch((e) => {
      console.error("Audio playback restricted by browser:", e);
      resolve();
    });
  });
}

export async function narrate(segments: { text: string; style?: string }[]) {
  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    if (i + 1 < segments.length) {
      preloadNarration(segments[i + 1].text, segments[i + 1].style);
    }
    await speak(text, style);
  }
}

export function preloadNarration(text: string, style: string = 'statement') {
  getAudioUrl(text, style);
}

export function playTone(frequency: number, duration: number = 200) {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) { /* silent fallback */ }
}

export const sounds = {
  correct: () => { playTone(523, 150); setTimeout(() => playTone(659, 150), 150); setTimeout(() => playTone(784, 200), 300); },
  wrong: () => { playTone(220, 300); },
  badge: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 200), i * 150)); },
  click: () => playTone(440, 80),
  streak: () => { playTone(880, 100); setTimeout(() => playTone(1100, 150), 100); },
};
