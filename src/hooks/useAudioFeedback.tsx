
import { useCallback, useEffect, useRef } from 'react';
import {
  isAudioSupported,
  playComparisonSound,
  playSwapSound,
  playCompletionSound,
  resumeAudioContext,
  suspendAudioContext
} from '@/utils/audioFeedback';

interface AudioFeedbackOptions {
  enabled: boolean;
  volume?: number;
}

/**
 * Hook for managing audio feedback in sorting visualizations
 */
const useAudioFeedback = (options: AudioFeedbackOptions) => {
  const { enabled, volume = 0.2 } = options;
  
  // Keep track of previous indices to avoid playing the same sound multiple times
  const prevComparingIndicesRef = useRef<number[]>([]);
  const prevSwappedIndicesRef = useRef<number[]>([]);
  const audioInitializedRef = useRef<boolean>(false);
  
  // Initialize audio context on first user interaction
  const initializeAudio = useCallback(async () => {
    if (enabled && isAudioSupported() && !audioInitializedRef.current) {
      await resumeAudioContext();
      audioInitializedRef.current = true;
    }
  }, [enabled]);
  
  // Clean up audio context when component unmounts
  useEffect(() => {
    return () => {
      suspendAudioContext();
    };
  }, []);
  
  // Toggle audio based on enabled state
  useEffect(() => {
    if (enabled && audioInitializedRef.current) {
      resumeAudioContext();
    } else if (!enabled) {
      suspendAudioContext();
    }
  }, [enabled]);
  
  // Play comparison sound
  const playComparison = useCallback(
    (values: number[], indices: number[], maxValue: number) => {
      if (!enabled || !isAudioSupported()) return;
      
      // Check if indices have changed to avoid playing the same sound multiple times
      const prevIndices = prevComparingIndicesRef.current;
      const sameIndices = 
        indices.length === prevIndices.length && 
        indices.every((val, idx) => val === prevIndices[idx]);
      
      if (!sameIndices) {
        playComparisonSound(values, indices, maxValue);
        prevComparingIndicesRef.current = [...indices];
      }
    },
    [enabled]
  );
  
  // Play swap sound
  const playSwap = useCallback(
    (values: number[], indices: number[], maxValue: number) => {
      if (!enabled || !isAudioSupported()) return;
      
      // Check if indices have changed to avoid playing the same sound multiple times
      const prevIndices = prevSwappedIndicesRef.current;
      const sameIndices = 
        indices.length === prevIndices.length && 
        indices.every((val, idx) => val === prevIndices[idx]);
      
      if (!sameIndices) {
        playSwapSound(values, indices, maxValue);
        prevSwappedIndicesRef.current = [...indices];
      }
    },
    [enabled]
  );
  
  // Play completion sound
  const playCompletion = useCallback(() => {
    if (enabled && isAudioSupported()) {
      playCompletionSound();
    }
  }, [enabled]);
  
  return {
    isSupported: isAudioSupported(),
    initializeAudio,
    playComparison,
    playSwap,
    playCompletion
  };
};

export default useAudioFeedback;
