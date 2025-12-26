'use client';

import { motion } from 'framer-motion';
import { Sun, CloudRain, Brain, Zap, Wind, LucideIcon } from 'lucide-react';
import { emotions, EmotionType } from '@/lib/music-data';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Sun,
  CloudRain,
  Brain,
  Zap,
  Wind,
};

interface EmotionSelectorProps {
  selectedEmotion: EmotionType | null;
  onSelect: (emotion: EmotionType) => void;
}

export function EmotionSelector({ selectedEmotion, onSelect }: EmotionSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl mx-auto p-4">
      {emotions.map((emotion, index) => {
        const Icon = iconMap[emotion.icon];
        const isSelected = selectedEmotion === emotion.id;

        return (
          <motion.button
            key={emotion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(emotion.id)}
            className={cn(
              "relative group flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 overflow-hidden",
              "bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40",
              isSelected ? "ring-2 ring-white/60 shadow-lg shadow-white/10" : ""
            )}
          >
            {/* Background Gradient */}
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br",
              emotion.color
            )} />
            
            <div className={cn(
              "relative z-10 p-4 rounded-full mb-4 transition-colors duration-300",
              isSelected ? "bg-white text-black" : "bg-white/10 text-white group-hover:bg-white/20"
            )}>
              <Icon size={32} />
            </div>
            
            <h3 className="relative z-10 text-xl font-bold text-white mb-2">{emotion.label}</h3>
            <p className="relative z-10 text-sm text-white/60 text-center leading-relaxed">
              {emotion.description}
            </p>

            {isSelected && (
              <motion.div
                layoutId="active-pill"
                className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-white"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
