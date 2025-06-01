import { SortingStep } from "./types";

/**
 * Selection Sort implementation as a generator function
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
export function* selectionSort(inputArray: number[]): Generator<SortingStep, SortingStep, void> {
  // Create a copy of the input array to avoid modifying the original
  const array = [...inputArray];
  const n = array.length;
  
  // Track metrics
  let comparisons = 0;
  let swaps = 0;
  
  // Track sorted indices (elements at the beginning that are in their final position)
  const sortedIndices: number[] = [];
  
  // Selection sort algorithm
  for (let i = 0; i < n - 1; i++) {
    // Assume the current index has the minimum value
    let minIndex = i;
    
    // Find the minimum element in the unsorted part of the array
    for (let j = i + 1; j < n; j++) {
      // Compare current element with the minimum
      comparisons++;
      
      // Yield the current state with comparing indices
      yield {
        array: [...array],
        comparingIndices: [minIndex, j],
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps
      };
      
      // If a smaller element is found, update minIndex
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    
    // If the minimum element is not at the current position, swap them
    if (minIndex !== i) {
      // Swap elements
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      swaps++;
      
      // Yield the current state with swapped indices
      yield {
        array: [...array],
        comparingIndices: [],
        swappedIndices: [i, minIndex],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps
      };
    }
    
    // After each iteration, one more element is in its final position
    sortedIndices.push(i);
  }
  
  // The last element is also sorted
  sortedIndices.push(n - 1);
  
  // Return the final state
  return {
    array,
    comparingIndices: [],
    swappedIndices: [],
    sortedIndices,
    comparisons,
    swaps
  };
}
