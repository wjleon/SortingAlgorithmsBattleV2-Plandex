/**
 * Represents a step in the sorting process
 */
export interface SortingStep {
  // The current state of the array
  array: number[];
  
  // Indices of elements being compared
  comparingIndices: number[];
  
  // Indices of elements being swapped
  swappedIndices: number[];
  
  // Indices of elements that are in their final sorted position
  sortedIndices: number[];
  
  // Number of comparisons made so far
  comparisons: number;
  
  // Number of swaps made so far
  swaps: number;
}

/**
 * Interface for a sorting algorithm generator function
 */
export type SortingAlgorithmGenerator = (
  array: number[]
) => Generator<SortingStep, SortingStep, void>;

/**
 * Interface for a sorting algorithm
 */
export interface SortingAlgorithm {
  name: string;
  generator: SortingAlgorithmGenerator;
}
