import { SortingStep } from "./types";

/**
 * Quick Sort implementation as a generator function
 * Time Complexity: O(n log n) average, O(n²) worst case
 * Space Complexity: O(log n)
 */
export function* quickSort(inputArray: number[]): Generator<SortingStep, SortingStep, void> {
  // Create a copy of the input array to avoid modifying the original
  const array = [...inputArray];
  const n = array.length;
  
  // Track metrics
  let comparisons = 0;
  let swaps = 0;
  
  // Track sorted indices
  const sortedIndices: number[] = [];
  
  // Helper function to partition the array
  function* partition(
    low: number,
    high: number
  ): Generator<SortingStep, number, void> {
    // Choose the rightmost element as the pivot
    const pivot = array[high];
    let i = low - 1;
    
    // Process all elements except the pivot
    for (let j = low; j < high; j++) {
      comparisons++;
      
      // Yield the current state with comparing indices
      yield {
        array: [...array],
        comparingIndices: [j, high], // Compare current element with pivot
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps
      };
      
      // If the current element is less than or equal to the pivot
      if (array[j] <= pivot) {
        i++;
        
        // Swap elements
        [array[i], array[j]] = [array[j], array[i]];
        swaps++;
        
        // Yield the current state with swapped indices
        yield {
          array: [...array],
          comparingIndices: [],
          swappedIndices: [i, j],
          sortedIndices: [...sortedIndices],
          comparisons,
          swaps
        };
      }
    }
    
    // Swap the pivot element with the element at (i + 1)
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swaps++;
    
    // Yield the current state with swapped indices
    yield {
      array: [...array],
      comparingIndices: [],
      swappedIndices: [i + 1, high],
      sortedIndices: [...sortedIndices],
      comparisons,
      swaps
    };
    
    // The pivot is now at its correct position
    sortedIndices.push(i + 1);
    
    // Return the pivot's index
    return i + 1;
  }
  
  // Helper function to recursively sort the array
  function* quickSortHelper(
    low: number,
    high: number
  ): Generator<SortingStep, void, void> {
    if (low < high) {
      // Partition the array and get the pivot index
      const pivotIndex = yield* partition(low, high);
      
      // Sort the elements before and after the pivot
      yield* quickSortHelper(low, pivotIndex - 1);
      yield* quickSortHelper(pivotIndex + 1, high);
    } else if (low === high) {
      // A single element is already sorted
      if (!sortedIndices.includes(low)) {
        sortedIndices.push(low);
      }
    }
  }
  
  // Start the quick sort process
  yield* quickSortHelper(0, n - 1);
  
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
