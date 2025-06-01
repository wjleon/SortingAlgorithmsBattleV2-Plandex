import { SortingStep } from "./types";

/**
 * Bubble Sort implementation as a generator function
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
export function* bubbleSort(inputArray: number[]): Generator<SortingStep, SortingStep, void> {
  // Create a copy of the input array to avoid modifying the original
  const array = [...inputArray];
  const n = array.length;
  
  // Track metrics
  let comparisons = 0;
  let swaps = 0;
  
  // Track sorted indices (elements at the end that are in their final position)
  const sortedIndices: number[] = [];
  
  // Bubble sort algorithm
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
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
      
      // If the elements are in the wrong order, swap them
      if (array[j] > array[j + 1]) {
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
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
      }
    }
    
    // After each pass, the largest element is at the end
    sortedIndices.unshift(n - i - 1);
    
    // If no swaps were made in this pass, the array is already sorted
    if (!swapped) {
      // Add all remaining indices as sorted
      for (let k = 0; k < n - i - 1; k++) {
        if (!sortedIndices.includes(k)) {
          sortedIndices.push(k);
        }
      }
      break;
    }
  }
  
  // Sort the sorted indices array
  sortedIndices.sort((a, b) => a - b);
  
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
