import { SortingStep } from "./types";

/**
 * Insertion Sort implementation as a generator function
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
export function* insertionSort(inputArray: number[]): Generator<SortingStep, SortingStep, void> {
  // Create a copy of the input array to avoid modifying the original
  const array = [...inputArray];
  const n = array.length;
  
  // Track metrics
  let comparisons = 0;
  let swaps = 0;
  
  // Track sorted indices (elements at the beginning that are in their final position)
  const sortedIndices: number[] = [0]; // First element is already sorted
  
  // Insertion sort algorithm
  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    
    // Compare the current element with the sorted elements
    while (j >= 0) {
      comparisons++;
      
      // Yield the current state with comparing indices
      yield {
        array: [...array],
        comparingIndices: [j, j + 1],
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps
      };
      
      // If the element is greater than the key, move it one position ahead
      if (array[j] > key) {
        array[j + 1] = array[j];
        swaps++;
        
        // Yield the current state with swapped indices
        yield {
          array: [...array],
          comparingIndices: [],
          swappedIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          comparisons,
          swaps
        };
        
        j--;
      } else {
        break;
      }
    }
    
    // Place the key at its correct position
    array[j + 1] = key;
    
    // After each iteration, one more element is in its final position
    sortedIndices.push(i);
  }
  
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
