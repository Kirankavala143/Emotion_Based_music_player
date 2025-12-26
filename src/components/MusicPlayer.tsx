'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Track } from '@/lib/music-data';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

interface MusicPlayerProps {
  tracks: Track[];
  onTrackChange?: (index: number) => void;
  accentColor?: string;
}

export function MusicPlayer({ tracks, onTrackChange, accentColor = 'from-purple-500 to-blue-500' }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    // Reset progress when track changes
    setProgress(0);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    onTrackChange?.(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    onTrackChange?.(prevIndex);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
        {/* Background glow based on accent color */}
        <div className={cn("absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 bg-gradient-to-br", accentColor)} />
        <div className={cn("absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[100px] opacity-20 bg-gradient-to-br", accentColor)} />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Cover Art */}
          <motion.div
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl group"
          >
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full">
              <Music size={20} className="text-white" />
            </div>
          </motion.div>

          {/* Controls & Info */}
          <div className="flex-1 w-full space-y-6">
            <div className="text-center md:text-left">
              <motion.h2
                key={`title-${currentTrack.id}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-black text-white mb-1"
              >
                {currentTrack.title}
              </motion.h2>
              <motion.p
                key={`artist-${currentTrack.id}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/60"
              >
                {currentTrack.artist}
              </motion.p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[progress]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSliderChange}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs font-medium text-white/40">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center md:justify-start gap-8">
              <button
                onClick={handlePrev}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <SkipBack size={28} fill="currentColor" />
              </button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className={cn(
                  "p-5 rounded-full text-black shadow-xl transition-all duration-300 bg-white",
                  "hover:shadow-white/20"
                )}
              >
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </motion.button>

              <button
                onClick={handleNext}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <SkipForward size={28} fill="currentColor" />
              </button>

              <div className="hidden md:flex items-center gap-2 ml-auto text-white/40 hover:text-white transition-colors">
                <Volume2 size={20} />
                <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-white/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
