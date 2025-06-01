
import { useState, useEffect, useRef, useCallback } from "react";
import { SortingStep, SortingAlgorithm } from "@/utils/sortingAlgorithms/types";
import { getSortingAlgorithm } from "@/utils/sortingAlgorithms";
import useAnimationController, { 
  AnimationControllerState, 
  AnimationControllerActions 
} from "@/hooks/useAnimationController";
import { ConfigurationState } from "@/hooks/useConfiguration";
import useAudioFeedback from "@/hooks/useAudioFeedback";

export interface SortingAnimationState {
  array: number[];
  comparingIndices: number[];
  swappedIndices: number[];
  sortedIndices: number[];
  comparisons: number;
  swaps: number;
  timeElapsed: number;
}

export interface SortingAnimationHook {
  state: SortingAnimationState;
  controller: [AnimationControllerState, AnimationControllerActions];
  isLoading: boolean;
  error: string | null;
  initializeAudio: () => void;
}

/**
 * Hook to animate sorting algorithms with step-by-step visualization
 */
const useSortingAnimation = (
  initialArray: number[],
  algorithmName: string,
  config: ConfigurationState,
  onComplete?: () => void
): SortingAnimationHook => {
  // Get the sorting algorithm
  const algorithm = getSortingAlgorithm(algorithmName);
  
  // Animation controller
  const controller = useAnimationController(
    config,
    undefined,
    undefined,
    handleReset,
    handleComplete
  );
    
  const [controllerState, controllerActions] = controller;

  // Audio feedback
  const audio = useAudioFeedback({
    enabled: config.isSoundEnabled
  });
    

  // Sorting state
  const [state, setState] = useState<SortingAnimationState>({
    array: [...initialArray],
    comparingIndices: [],
    swappedIndices: [],
    sortedIndices: [],
    comparisons: 0,
    swaps: 0,
    timeElapsed: 0
  });
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Performance optimization for large arrays
  const isLargeArray = initialArray.length > 100;
  
  // Generator reference
  const generatorRef = useRef<Generator<SortingStep, SortingStep, void> | null>(null);
  
  // Last step time reference
  const lastStepTimeRef = useRef<number>(0);
  
  // Start time reference
  const startTimeRef = useRef<number>(0);
  
  // Animation frame reference
  const animationFrameRef = useRef<number | null>(null);
  

  // Initialize or reset the generator
  const initializeGenerator = useCallback(() => {
    if (initialArray.length > 0) {
      try {
        setIsLoading(true);
        setError(null);

        // For large arrays, use a small delay to allow the UI to update
        if (isLargeArray) {
          setTimeout(() => {
            try {
              generatorRef.current = algorithm.generator([...initialArray]);
              lastStepTimeRef.current = 0;
              startTimeRef.current = performance.now();
              setIsLoading(false);
            } catch (err) {
              console.error("Error initializing sorting algorithm:", err);
              setError(`Failed to initialize ${algorithm.name}: ${err instanceof Error ? err.message : String(err)}`);
              setIsLoading(false);
              controllerActions.reset();
            }
          }, 50);
        } else {
          // For smaller arrays, initialize immediately
          generatorRef.current = algorithm.generator([...initialArray]);
          lastStepTimeRef.current = 0;
          startTimeRef.current = performance.now();
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error initializing sorting algorithm:", err);
        setError(`Failed to initialize ${algorithm.name}: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
        controllerActions.reset();
      }
    }
  }, [initialArray, algorithm, isLargeArray, controllerActions]);
    
  
  // Reset the sorting state
  function handleReset() {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setState({
      array: [...initialArray],
      comparingIndices: [],
      swappedIndices: [],
      sortedIndices: [],
      comparisons: 0,
      swaps: 0,
      timeElapsed: 0
    });
    
    generatorRef.current = null;
    lastStepTimeRef.current = 0;
    startTimeRef.current = 0;
  }
  
  // Calculate delay based on animation speed (1-10)
  const getAnimationDelay = useCallback(() => {
    // Map speed (1-10) to delay (500ms-10ms)
    // Speed 1 = 500ms delay (slowest)
    // Speed 10 = 10ms delay (fastest)
    return 510 - (controllerState.animationSpeed * 50);
  }, [controllerState.animationSpeed]);
  
  // Handle completion
  function handleComplete() {
    // Play completion sound
    audio.playCompletion();
    
    // Call the onComplete callback if provided
    onComplete?.();
  }
  
  // Perform a single animation step
  const performStep = useCallback(() => {
    if (!generatorRef.current) {
      initializeGenerator();
      if (!generatorRef.current) return false;
    }
    
    try {
      const { value, done } = generatorRef.current.next();
      
      if (done) {
        // Sorting is complete
        setState(prev => ({
          ...prev,
          array: value.array,
          comparingIndices: [],
          swappedIndices: [],
          sortedIndices: Array.from({ length: value.array.length }, (_, i) => i),
          comparisons: value.comparisons,
          swaps: value.swaps,
          timeElapsed: (performance.now() - startTimeRef.current) / 1000
        }));

        // Clear any previous errors
        setError(null);
        controllerActions.complete();
        return false;
    
      }
      
      // Update state with the current step
      setState({
        array: value.array,
        comparingIndices: value.comparingIndices,
        swappedIndices: value.swappedIndices,
        sortedIndices: value.sortedIndices,
        comparisons: value.comparisons,
        swaps: value.swaps,
        timeElapsed: (performance.now() - startTimeRef.current) / 1000
      });
      
      // Play audio feedback
      if (value.comparingIndices.length > 0 && config.isSoundEnabled) {
        audio.playComparison(value.array, value.comparingIndices, Math.max(...value.array));
      }
      
      if (value.swappedIndices.length > 0 && config.isSoundEnabled) {
        audio.playSwap(value.array, value.swappedIndices, Math.max(...value.array));
      }
      
      return true;
    } catch (error) {

      console.error("Error during sorting animation:", error);
      setError(`Error during sorting: ${error instanceof Error ? error.message : String(error)}`);
      controllerActions.reset();
      return false;
    
    }
  }, [initializeGenerator, controllerActions, audio, config.isSoundEnabled]);
    
  
  // Animation loop
  const animationLoop = useCallback((timestamp: number) => {
    if (!controllerState.isRunning || controllerState.isPaused) {
      return;
    }
    
    const delay = getAnimationDelay();
    
    if (timestamp - lastStepTimeRef.current >= delay) {
      lastStepTimeRef.current = timestamp;
      
      const shouldContinue = performStep();
      
      if (!shouldContinue) {
        return;
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animationLoop);
  }, [controllerState.isRunning, controllerState.isPaused, getAnimationDelay, performStep]);
  
  // Start or stop animation based on isRunning state
  useEffect(() => {
    if (controllerState.isRunning && !controllerState.isPaused) {
      // Initialize audio
      audio.initializeAudio();
      
      // Initialize generator if needed
      if (!generatorRef.current) {
        initializeGenerator();
        startTimeRef.current = performance.now();
      }
      
      // Start animation loop
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    } else if (animationFrameRef.current !== null) {
      // Stop animation loop
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    controllerState.isRunning, 
    controllerState.isPaused, 
    initializeGenerator, 
    animationLoop,
    audio
  ]);
  
  // Reset when algorithm or initial array changes
  useEffect(() => {
    handleReset();
  }, [algorithmName, initialArray]);
  


  return {
    state,
    controller,
    error,
    isLoading,
    initializeAudio: audio.initializeAudio
  };
};
    
    

export default useSortingAnimation;




