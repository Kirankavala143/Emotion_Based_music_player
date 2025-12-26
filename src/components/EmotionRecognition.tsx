'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { EmotionType } from '@/lib/music-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmotionRecognitionProps {
  onEmotionDetected: (emotion: EmotionType) => void;
}

const emotionMap: Record<string, EmotionType> = {
  happy: 'joy',
  sad: 'melancholy',
  angry: 'serenity', // Relaxing music for angry
  neutral: 'focus',
  surprised: 'energy',
  fearful: 'serenity',
  disgusted: 'serenity',
};

export const EmotionRecognition: React.FC<EmotionRecognitionProps> = ({ onEmotionDetected }) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Failed to load AI models. Please try again.');
      }
    };
    loadModels();
  }, []);

  const handleDetection = useCallback(async (input: HTMLVideoElement | HTMLImageElement) => {
    if (!isModelLoaded) return;
    
    setIsLoading(true);
    setDetectedEmotion(null);
    setError(null);

    try {
      const detections = await faceapi
        .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const expressions = detections.expressions;
        const dominantEmotion = Object.keys(expressions).reduce((a, b) => 
          expressions[a as keyof typeof expressions] > expressions[b as keyof typeof expressions] ? a : b
        );
        
        setDetectedEmotion(dominantEmotion);
        const mappedEmotion = emotionMap[dominantEmotion] || 'focus';
        onEmotionDetected(mappedEmotion);
      } else {
        setError('No face detected. Please try again.');
      }
    } catch (err) {
      console.error('Detection error:', err);
      setError('An error occurred during detection.');
    } finally {
      setIsLoading(false);
    }
  }, [isModelLoaded, onEmotionDetected]);

  const captureCamera = async () => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      if (video) {
        handleDetection(video);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => handleDetection(img);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isModelLoaded && !error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin mb-4" />
        <p className="text-white/60 font-medium">Initializing AI models...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          variant={mode === 'camera' ? 'default' : 'secondary'}
          onClick={() => setMode('camera')}
          className="rounded-full px-6"
        >
          <Camera className="w-4 h-4 mr-2" />
          Live Camera
        </Button>
        <Button
          variant={mode === 'upload' ? 'default' : 'secondary'}
          onClick={() => setMode('upload')}
          className="rounded-full px-6"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
        <AnimatePresence mode="wait">
          {mode === 'camera' ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
            >
              {isCameraActive ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    className="w-full h-full object-cover mirror"
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: 'user' }}
                  />
                  <div className="absolute inset-0 border-2 border-white/20 pointer-events-none m-8 rounded-lg" />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white/20" />
                  </div>
                  <Button onClick={() => setIsCameraActive(true)} variant="outline">
                    Enable Camera
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center p-12 text-center"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer group flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white/20 group-hover:text-white/40 transition-colors" />
                </div>
                <div>
                  <p className="text-white/60 font-medium">Click to upload photo</p>
                  <p className="text-white/20 text-sm mt-1">Showing facial expression</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-white/40 animate-spin mx-auto mb-4" />
              <p className="text-white/80 font-medium tracking-wide">Analyzing Expression...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        {mode === 'camera' && isCameraActive && !isLoading && (
          <Button 
            size="lg" 
            onClick={captureCamera}
            className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold h-12"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Detect Emotion
          </Button>
        )}

        <AnimatePresence>
          {detectedEmotion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            >
              <CheckCircle2 size={18} />
              <span className="font-semibold uppercase tracking-wider text-sm">
                Detected: {detectedEmotion}
              </span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400"
            >
              <AlertCircle size={18} />
              <span className="font-medium text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
