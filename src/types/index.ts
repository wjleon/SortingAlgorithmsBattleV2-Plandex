// Sorting algorithm types
export interface SortingAlgorithm {
  name: string;
  generator: (array: number[]) => Generator<SortingStep>;
}

// Sorting step types
export interface SortingStep {
  array: number[];
  comparingIndices: number[];
  swappedIndices: number[];
}

// Metrics types
export interface SortingMetrics {
  comparisons: number;
  timeElapsed: number;
}

// Animation state types
export interface AnimationState {
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
}
