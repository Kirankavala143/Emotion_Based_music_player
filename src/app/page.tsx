'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { EmotionSelector } from '@/components/EmotionSelector';
import { MusicPlayer } from '@/components/MusicPlayer';
import { mockTracks, emotions, EmotionType } from '@/lib/music-data';
import { cn } from '@/lib/utils';
import { Sparkles, BrainCircuit } from 'lucide-react';

const EmotionRecognition = dynamic(
  () => import('@/components/EmotionRecognition').then((mod) => mod.EmotionRecognition),
  { ssr: false }
);

export default function Home() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [detectionMode, setDetectionMode] = useState<'manual' | 'ai'>('manual');

  const filteredTracks = useMemo(() => {
    if (!selectedEmotion) return [];
    return mockTracks.filter((track) => track.emotion === selectedEmotion);
  }, [selectedEmotion]);

  const activeEmotionData = useMemo(() => {
    return emotions.find((e) => e.id === selectedEmotion);
  }, [selectedEmotion]);

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden font-sans selection:bg-white/30 selection:text-white">
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        {selectedEmotion ? (
          <motion.div
            key={selectedEmotion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={cn(
              "fixed inset-0 bg-gradient-to-br transition-all duration-1000",
              activeEmotionData?.color || "from-zinc-900 to-black"
            )}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[100px]" />
          </motion.div>
        ) : (
          <motion.div
            key="default-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3e3e3e,transparent)]" />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 container mx-auto px-6 py-12 md:py-20 flex flex-col items-center min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium uppercase tracking-widest">
              <Sparkles size={14} className="text-yellow-400" />
              AI Emotion Sync
            </div>
            
            <div className="flex items-center p-1 bg-white/5 rounded-full border border-white/10">
              <button
                onClick={() => setDetectionMode('manual')}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  detectionMode === 'manual' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                )}
              >
                Manual Selection
              </button>
              <button
                onClick={() => setDetectionMode('ai')}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300",
                  detectionMode === 'ai' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                )}
              >
                <BrainCircuit size={16} />
                AI Recognition
              </button>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mt-8">
            How are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">feeling?</span>
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto">
            {detectionMode === 'ai' 
              ? "Let our AI analyze your expression and recommend the perfect soundscape."
              : "Select an emotion and let our curated soundscapes match your current mood perfectly."}
          </p>
        </motion.div>

        {/* Selection Area */}
        <div className="w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {detectionMode === 'manual' ? (
              <motion.div
                key="manual"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <EmotionSelector
                  selectedEmotion={selectedEmotion}
                  onSelect={(emotion) => setSelectedEmotion(emotion)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="ai"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EmotionRecognition
                  onEmotionDetected={(emotion) => setSelectedEmotion(emotion)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Music Player */}
        <AnimatePresence mode="wait">
          {selectedEmotion && filteredTracks.length > 0 && (
            <motion.div
              key={selectedEmotion}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <div className="mt-20 text-center">
                <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-2">Now Playing</p>
                <h2 className="text-2xl font-bold text-white mb-8">
                  Soundscapes for <span className="italic opacity-80">{activeEmotionData?.label}</span>
                </h2>
              </div>
              
              <MusicPlayer 
                tracks={filteredTracks} 
                accentColor={activeEmotionData?.color}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info if no emotion selected */}
        {!selectedEmotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-auto pt-20 text-white/20 text-sm"
          >
            Music curated for every human experience.
          </motion.div>
        )}
      </main>
    </div>
  );
}
