import { narrate } from './audio';

export function say(text: string) { return { text, style: 'statement' }; }
export function ask(text: string) { return { text, style: 'question' }; }
export function cheer(text: string) { return { text, style: 'encouragement' }; }
export function emphasize(text: string) { return { text, style: 'emphasis' }; }
export function think(text: string) { return { text, style: 'thinking' }; }
export function celebrate(text: string) { return { text, style: 'celebration' }; }

export function playIntroNarration() {
  narrate([
    cheer("Let's master regrouping!"),
    say("Learn to carry in addition and borrow in subtraction! Solve puzzles with place value blocks, unlock treasure, and become a regrouping master!")
  ]);
}

export function playWonderNarration(wonderQuestion: string, wonderSubtext: string) {
  narrate([
    think("Hmm... I wonder..."),
    ask(wonderQuestion),
    say(wonderSubtext)
  ]);
}

export function playStoryNarration(text: string, highlight: string) {
  narrate([
    say(text),
    emphasize(highlight)
  ]);
}

export function playSimulateNarration(text: string) {
  narrate([
    say(text)
  ]);
}

export function playReflectNarration(text: string) {
  narrate([
    say(text)
  ]);
}

// Additional narrations can be added here for other phases
