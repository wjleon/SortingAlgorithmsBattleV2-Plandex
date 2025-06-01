import { useState, useCallback, useRef, useEffect } from "react";
import { ConfigurationState } from "@/hooks/useConfiguration";

export interface AnimationControllerState {
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  animationSpeed: number;
}

export interface AnimationControllerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  complete: () => void;
  setAnimationSpeed: (speed: number) => void;
}

export type AnimationControllerHook = [
  AnimationControllerState,
  AnimationControllerActions
];

/**
 * Hook to control animation state and timing
 */
const useAnimationController = (
  config: ConfigurationState,
  onStart?: () => void,
  onPause?: () => void,
  onReset?: () => void,
  onComplete?: () => void
): AnimationControllerHook => {
  // Animation state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(config.animationSpeed);

  // Animation frame reference
  const animationFrameRef = useRef<number | null>(null);

  // Update animation speed when config changes
  useEffect(() => {
    setAnimationSpeed(config.animationSpeed);
  }, [config.animationSpeed]);

  // Cancel animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Start animation
  const start = useCallback(() => {
    if (!isRunning || isPaused) {
      setIsRunning(true);
      setIsPaused(false);
      onStart?.();
    }
  }, [isRunning, isPaused, onStart]);

  // Pause animation
  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      onPause?.();
    }
  }, [isRunning, isPaused, onPause]);

  // Reset animation
  const reset = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    onReset?.();
  }, [onReset]);

  // Complete animation
  const complete = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(false);
      setIsComplete(true);
      onComplete?.();
    }
  }, [isRunning, onComplete]);

  // Calculate delay based on animation speed (1-10)
  const getAnimationDelay = useCallback(() => {
    // Map speed (1-10) to delay (500ms-10ms)
    // Speed 1 = 500ms delay (slowest)
    // Speed 10 = 10ms delay (fastest)
    return 510 - (animationSpeed * 50);
  }, [animationSpeed]);

  return [
    { isRunning, isPaused, isComplete, animationSpeed },
    { 
      start, 
      pause, 
      reset, 
      complete,
      setAnimationSpeed 
    }
  ];
};

export default useAnimationController;
