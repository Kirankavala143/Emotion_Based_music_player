## Project Summary
AI Emotion Sync is a Next.js application that recommends personalized soundscapes based on a user's current mood. It uses AI-powered facial expression recognition (via face-api.js) and manual selection to categorize emotions and play matching music.

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS, Lucide React (icons)
- Animation: Framer Motion
- AI: @vladmandic/face-api (Face detection & expressions)
- UI Components: Radix UI, shadcn/ui
- Components: React-Webcam for camera integration

## Architecture
- `src/app/`: Main entry point and page layouts
- `src/components/`: Reusable UI components including `EmotionRecognition` and `MusicPlayer`
- `src/lib/`: Core logic, music data, and utility functions
- `public/models/`: AI model weights and manifests for face detection

## User Preferences
- No specific preferences yet.

## Project Guidelines
- Use functional components with TypeScript.
- Follow the existing code style for UI components (dark theme, glassmorphism).
- AI models are loaded dynamically to avoid SSR issues.

## Common Patterns
- Dynamic importing for client-side only components (e.g., EmotionRecognition).
- Framer Motion for smooth transitions between emotion states.
