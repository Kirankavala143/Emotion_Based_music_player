export type EmotionType = 'joy' | 'melancholy' | 'focus' | 'energy' | 'serenity';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  emotion: EmotionType;
}

export const emotions = [
  { id: 'joy' as EmotionType, label: 'Joy', icon: 'Sun', color: 'from-yellow-400 to-orange-500', description: 'Upbeat and happy tunes to brighten your day' },
  { id: 'melancholy' as EmotionType, label: 'Melancholy', icon: 'CloudRain', color: 'from-blue-400 to-indigo-600', description: 'Deep, emotional melodies for reflective moments' },
  { id: 'focus' as EmotionType, label: 'Focus', icon: 'Brain', color: 'from-emerald-400 to-teal-600', description: 'Lo-fi and ambient beats for deep work' },
  { id: 'energy' as EmotionType, label: 'Energy', icon: 'Zap', color: 'from-red-500 to-purple-600', description: 'High-octane tracks to get you moving' },
  { id: 'serenity' as EmotionType, label: 'Serenity', icon: 'Wind', color: 'from-cyan-400 to-blue-500', description: 'Calm and peaceful soundscapes for relaxation' },
];

export const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Sunshine Vibes',
    artist: 'Sunny Ray',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    emotion: 'joy'
  },
  {
    id: '2',
    title: 'Midnight Rain',
    artist: 'Luna Mist',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1514525253344-99a4299966c2?w=800&q=80',
    emotion: 'melancholy'
  },
  {
    id: '3',
    title: 'Deep Focus',
    artist: 'The Architect',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800&q=80',
    emotion: 'focus'
  },
  {
    id: '4',
    title: 'Electric Surge',
    artist: 'Volt',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80',
    emotion: 'energy'
  },
  {
    id: '5',
    title: 'Ocean Breeze',
    artist: 'Zen Garden',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    cover: 'https://images.unsplash.com/photo-1453738558379-6451299c8907?w=800&q=80',
    emotion: 'serenity'
  },
  {
    id: '6',
    title: 'Golden Hour',
    artist: 'Skyline',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    cover: 'https://images.unsplash.com/photo-1465821508027-561b82d5df75?w=800&q=80',
    emotion: 'joy'
  }
];
