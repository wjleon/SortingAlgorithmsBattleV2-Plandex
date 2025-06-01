import { useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  setAlgorithm1,
  setAlgorithm2,
  setElementCount,
  setDistribution,
  toggleSound,
  setAnimationSpeed,
  startSorting,
  pauseSorting,
  resetSorting,
  updateAlgorithm1State,
  updateAlgorithm2State,
  completeAlgorithm1,
  completeAlgorithm2,
  generateNewArray,

  AlgorithmState
} from '@/context/types';
import { Distribution } from '@/hooks/useConfiguration';
import { generateArray } from '@/utils/arrayGenerators';
    

/**
 * Custom hook to use the app state with action creators
 */
const useAppState = () => {
  const { state, dispatch } = useAppContext();

  // Algorithm 1 actions
  const setAlgorithm1Name = useCallback((algorithm: string) => {
    dispatch(setAlgorithm1(algorithm));
  }, [dispatch]);

  const updateAlgorithm1 = useCallback((algorithmState: Partial<AlgorithmState>) => {
    dispatch(updateAlgorithm1State(algorithmState));
  }, [dispatch]);

  const completeAlgorithm1Sorting = useCallback(() => {
    dispatch(completeAlgorithm1());
  }, [dispatch]);

  // Algorithm 2 actions
  const setAlgorithm2Name = useCallback((algorithm: string) => {
    dispatch(setAlgorithm2(algorithm));
  }, [dispatch]);

  const updateAlgorithm2 = useCallback((algorithmState: Partial<AlgorithmState>) => {
    dispatch(updateAlgorithm2State(algorithmState));
  }, [dispatch]);

  const completeAlgorithm2Sorting = useCallback(() => {
    dispatch(completeAlgorithm2());
  }, [dispatch]);

  // Configuration actions
  const updateElementCount = useCallback((count: number) => {
    dispatch(setElementCount(count));
  }, [dispatch]);

  const updateDistribution = useCallback((distribution: Distribution) => {
    dispatch(setDistribution(distribution));
  }, [dispatch]);

  const toggleSoundEnabled = useCallback(() => {
    dispatch(toggleSound());
  }, [dispatch]);

  const updateAnimationSpeed = useCallback((speed: number) => {
    dispatch(setAnimationSpeed(speed));
  }, [dispatch]);

  // Control actions
  const start = useCallback(() => {
    dispatch(startSorting());
  }, [dispatch]);

  const pause = useCallback(() => {
    dispatch(pauseSorting());
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(resetSorting());
  }, [dispatch]);

  // Array generation
  const regenerateArray = useCallback(() => {
    const newArray = generateArray(state.elementCount, state.distribution);
    dispatch(generateNewArray(newArray));
  }, [dispatch, state.elementCount, state.distribution]);

  return {
    state,
    actions: {
      setAlgorithm1Name,
      updateAlgorithm1,
      completeAlgorithm1Sorting,
      setAlgorithm2Name,
      updateAlgorithm2,
      completeAlgorithm2Sorting,
      updateElementCount,
      updateDistribution,
      toggleSoundEnabled,
      updateAnimationSpeed,
      start,
      pause,
      reset,
      regenerateArray
    }
  };
};

export default useAppState;

