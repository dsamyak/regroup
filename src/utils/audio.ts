export function stopNarration() {
  window.speechSynthesis?.cancel();
}

let audioCtx: AudioContext | null = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
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
