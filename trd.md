# Technical Requirements Document (TRD)

# Regrouping Quest
### Gamified Math Simulation Platform — Grade 3 Regrouping

| Field | Value |
|---------|---------|
| Version | 1.0 |
| Date | June 2026 |
| Tech Stack | React 18 + Vite + Framer Motion + Tone.js + Tailwind CSS |
| Deployment | intelliasg.com/courses/grade-3-math |
| Architecture | SPA |
| Companion Document | PRD v1.0 |

---

# 1. Technical Overview

## Architecture Summary

### Frontend
- React 18
- Vite
- TypeScript

### Styling
- Tailwind CSS
- CSS Modules

### Animation
- Framer Motion
- CSS Keyframes

### Audio
- Tone.js
- HTML5 Audio API

### State Management
- Context API
- useReducer

### Storage
- localStorage

### Testing
- Vitest
- React Testing Library

### Deployment
- Vercel
- Netlify

---

# 2. Repository Structure

```text
regrouping-quest/
├── public/
│   ├── audio/
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── components/
│   │   ├── characters/
│   │   ├── simulation/
│   │   ├── quiz/
│   │   ├── rewards/
│   │   ├── story/
│   │   └── ui/
│
│   ├── screens/
│   ├── hooks/
│   ├── data/
│   ├── utils/
│   ├── context/
│   └── styles/
│
├── vite.config.js
├── tailwind.config.js
└── package.json