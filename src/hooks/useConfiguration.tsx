
import { useState, useCallback, useEffect } from "react";

// Define the available sorting algorithms
export const ALGORITHMS = [
  "Bubble Sort",
  "Selection Sort",
  "Insertion Sort",
  "Merge Sort",
  "Quick Sort",
  "Heap Sort",
  "Counting Sort",
  "Radix Sort",
  "Bucket Sort",
  "Shell Sort",
  "Tim Sort",
  "Comb Sort",
  "Pigeonhole Sort",
  "Cycle Sort",
  "Strand Sort",
  "Bitonic Sort",
  "Pancake Sort",
  "Bogo Sort",
  "Gnome Sort",
  "Stooge Sort",
  "Odd-Even Sort",
];

// Define the available distributions
export type Distribution = 
  | "random" 
  | "ascending" 
  | "descending" 
  | "nearly-sorted" 
  | "few-unique" 
  | "split-ascending" 
  | "split-descending";

export interface ConfigurationState {
  algorithm1: string;
  algorithm2: string;
  elementCount: number;
  distribution: Distribution;
  isSoundEnabled: boolean;
  animationSpeed: number;
  isRunning: boolean;
  isPaused: boolean;
}

export interface ConfigurationActions {
  setAlgorithm1: (algorithm: string) => void;
  setAlgorithm2: (algorithm: string) => void;
  setElementCount: (count: number) => void;
  setDistribution: (distribution: Distribution) => void;
  toggleSound: () => void;
  setAnimationSpeed: (speed: number) => void;
  startSorting: () => void;
  pauseSorting: () => void;
  resetSorting: () => void;
}

export type ConfigurationHook = [ConfigurationState, ConfigurationActions];

const useConfiguration = (): ConfigurationHook => {
  const [config, setConfig] = useState<ConfigurationState>({
    algorithm1: "Bubble Sort",
    algorithm2: "Quick Sort",
    elementCount: 30,
    distribution: "random",
    isSoundEnabled: true,
    animationSpeed: 5,
    isRunning: false,
    isPaused: false,
  });

  const setAlgorithm1 = useCallback((algorithm: string) => {
    setConfig((prev) => ({ ...prev, algorithm1: algorithm }));
  }, []);

  const setAlgorithm2 = useCallback((algorithm: string) => {
    setConfig((prev) => ({ ...prev, algorithm2: algorithm }));
  }, []);

  const setElementCount = useCallback((count: number) => {
    // Validate the element count (between 10 and 200)
    const validCount = Math.max(10, Math.min(200, count));
    setConfig((prev) => ({ ...prev, elementCount: validCount }));
  }, []);

  const setDistribution = useCallback((distribution: Distribution) => {
    setConfig((prev) => ({ ...prev, distribution }));
  }, []);

  const toggleSound = useCallback(() => {
    setConfig((prev) => ({ ...prev, isSoundEnabled: !prev.isSoundEnabled }));
  }, []);

  const setAnimationSpeed = useCallback((speed: number) => {
    // Validate the animation speed (between 1 and 10)
    const validSpeed = Math.max(1, Math.min(10, speed));
    setConfig((prev) => ({ ...prev, animationSpeed: validSpeed }));
  }, []);

  const startSorting = useCallback(() => {
    setConfig((prev) => ({ 
      ...prev, 
      isRunning: true, 
      isPaused: false 
    }));
  }, []);

  const pauseSorting = useCallback(() => {
    setConfig((prev) => ({ 
      ...prev, 
      isPaused: true 
    }));
  }, []);

  const resetSorting = useCallback(() => {
    setConfig((prev) => ({ 
      ...prev, 
      isRunning: false, 
      isPaused: false 
    }));
  }, []);

  // Synchronize animation speed with config
  useEffect(() => {
    if (config.isRunning) {
      // Don't allow changing algorithms or element count while running
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (config.isRunning) {
          e.preventDefault();
          e.returnValue = '';
          return '';
        }
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [config.isRunning]);

  return [
    config,
    {
      setAlgorithm1,
      setAlgorithm2,
      setElementCount,
      setDistribution,
      toggleSound,
      setAnimationSpeed,
      startSorting,
      pauseSorting,
      resetSorting,
    },
  ];
};

export default useConfiguration;
